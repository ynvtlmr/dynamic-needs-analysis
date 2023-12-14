import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Beneficiary } from '../beneficiary/beneficiary.component';
import { FormsModule } from '@angular/forms';
import { CommonModule, DecimalPipe } from '@angular/common';
import { TAX_BRACKETS, TaxBracket } from '../constants/tax.constant';
import { LocalStorageService } from '../services/local-storage.service';
import {
  FIN_INSTR_TYPES,
  FinTypeAttributes,
} from '../constants/asset-types.constant';

export interface Asset {
  name: string;
  initialValue: number;
  currentValue: number;
  yearAcquired: number;
  rate: number;
  term: number;
  type: string;
  isTaxable: boolean;
  isLiquid: boolean;
  isToBeSold: boolean;
  financialInstrumentTypes: string[];
  beneficiaries: Beneficiary[];
  selectedTaxBracket: TaxBracket | undefined;
  capitalGainsTaxRate: number;
}

@Component({
  selector: 'app-asset',
  templateUrl: './asset.component.html',
  standalone: true,
  imports: [FormsModule, DecimalPipe, CommonModule],
})
export class AssetComponent implements OnInit, OnChanges {
  name: string = '';
  initialValue: number = 0;
  currentValue: number = 0;
  yearAcquired: number = new Date().getFullYear();
  rate: number = 0;
  term: number = 0;
  type: string = '';
  isTaxable: boolean = false;
  isLiquid: boolean = false;
  isToBeSold: boolean = false;
  beneficiaries: Beneficiary[] = [];
  selectedTaxBracket: TaxBracket | undefined;

  capitalGainsTaxRate: number = 0;
  taxBrackets: TaxBracket[] = [];
  financialInstrumentTypes: string[] = Array.from(FIN_INSTR_TYPES.keys());

  @Input() asset: Asset | null = null;
  @Output() save: EventEmitter<Asset> = new EventEmitter<Asset>();
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.loadClientTaxBracket();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (this.asset) {
      this.populateAssetData(this.asset);
    }
  }

  populateAssetData(asset: Asset): void {
    this.name = asset.name;
    this.initialValue = asset.initialValue;
    this.currentValue = asset.currentValue;
    this.yearAcquired = asset.yearAcquired;
    this.rate = asset.rate;
    this.term = asset.term;
    this.type = asset.type;
    this.isTaxable = asset.isTaxable;
    this.isLiquid = asset.isLiquid;
    this.isToBeSold = asset.isToBeSold;
    this.beneficiaries = asset.beneficiaries;
    this.selectedTaxBracket = asset.selectedTaxBracket;
    this.capitalGainsTaxRate = asset.capitalGainsTaxRate;
    this.financialInstrumentTypes = asset.financialInstrumentTypes;
  }

  onSave(): void {
    const asset: Asset = {
      name: this.name,
      initialValue: this.initialValue,
      currentValue: this.currentValue,
      yearAcquired: this.yearAcquired,
      rate: this.rate,
      term: this.term,
      type: this.type,
      isTaxable: this.isTaxable,
      isLiquid: this.isLiquid,
      isToBeSold: this.isToBeSold,
      selectedTaxBracket: this.selectedTaxBracket,
      capitalGainsTaxRate: this.capitalGainsTaxRate,
      financialInstrumentTypes: this.financialInstrumentTypes,
      beneficiaries: this.beneficiaries,
    };
    this.save.emit(asset);
  }

  onCancel(): void {
    this.cancel.emit();
  }

  get currentYearsHeld(): number {
    const currentYear: number = new Date().getFullYear();
    return currentYear - this.yearAcquired;
  }

  private loadClientTaxBracket(): void {
    const clientData = this.localStorageService.getItem('client');
    if (clientData?.selectedBracket) {
      const clientBracketMinIncome = clientData.selectedBracket.minIncome;
      this.taxBrackets =
        TAX_BRACKETS[new Date().getFullYear()]?.[
          clientData.province.toUpperCase()
        ] || [];
      this.selectedTaxBracket = this.taxBrackets.find(
        (bracket: TaxBracket) => bracket.minIncome === clientBracketMinIncome,
      );
    }
    this.updateSelectedTaxBracket();
  }

  updateSelectedTaxBracket(): void {
    if (this.selectedTaxBracket) {
      this.capitalGainsTaxRate = this.selectedTaxBracket.taxRate * 0.5;
      // Other logic to handle the change, like updating localStorage
    } else {
      this.capitalGainsTaxRate = 0;
    }
  }

  get currentTaxLiabilityDollars(): number {
    if (!this.isTaxable) {
      return 0;
    }
    return this.currentGrowthDollars * (this.capitalGainsTaxRate / 100.0);
  }

  get futureTaxLiabilityDollars(): number {
    if (!this.isTaxable) {
      return 0;
    }
    return (
      (this.futureValueDollars - this.initialValue) *
      (this.capitalGainsTaxRate / 100.0)
    );
  }

  onTypeChange(selectedType: string): void {
    const typeInfo: FinTypeAttributes | undefined =
      FIN_INSTR_TYPES.get(selectedType);
    this.isTaxable = typeInfo ? typeInfo.taxable : false;
    this.isLiquid = typeInfo ? typeInfo.liquid : false;
  }

  loadBeneficiaries(): void {
    if (
      this.beneficiaries.length > 0 ||
      this.beneficiaries.length >=
        this.localStorageService.getItem('beneficiaries')?.length
    ) {
      let emptyBeneficiary: Beneficiary = {
        name: '',
        allocation: 0,
      };
      this.beneficiaries.push(emptyBeneficiary);
    } else {
      this.beneficiaries =
        this.localStorageService.getItem('beneficiaries') || [];
    }
  }

  deleteBeneficiary(index: number): void {
    this.beneficiaries.splice(index, 1);
  }

  clearBeneficiaries(): void {
    this.beneficiaries = [];
  }

  updateAllocation(index: number, newAllocation: number): void {
    if (this.beneficiaries[index]) {
      this.beneficiaries[index].allocation = newAllocation;
    }
  }

  get totalAllocations(): number {
    return this.beneficiaries.reduce(
      (total, beneficiary) => total + beneficiary.allocation,
      0,
    );
  }

  get currentGrowthDollars(): number {
    return this.currentValue - this.initialValue;
  }

  get currentGrowthPercentage(): number {
    if (this.initialValue === 0) {
      return 0;
    }
    return (this.currentValue / this.initialValue - 1) * 100;
  }

  get futureValueDollars(): number {
    return this.currentValue * Math.pow(1 + this.rate / 100, this.term);
  }

  get futureValueGrowthPercentage(): number {
    let futureValue = this.futureValueDollars;
    if (this.initialValue === 0) {
      return 0;
    }
    return (futureValue / this.initialValue - 1) * 100;
  }
}
