import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, DecimalPipe } from '@angular/common';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { LocalStorageService } from '../../services/local-storage.service';
import { TAX_BRACKETS, TaxBracket } from '../constants/tax.constant';
import {
  FIN_INSTR_TYPES,
  FinTypeAttributes,
} from '../constants/asset-types.constant';
import { Client } from '../../models/client.model';
import { Asset } from '../../models/asset.model';
import { Beneficiary } from '../../models/beneficiary.model';

@Component({
  selector: 'app-asset',
  templateUrl: './asset.component.html',
  standalone: true,
  imports: [
    FormsModule,
    DecimalPipe,
    CommonModule,
    NgxMaskPipe,
    NgxMaskDirective,
  ],
  providers: [provideNgxMask()],
})
export class AssetComponent implements OnChanges {
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

  ngOnChanges(): void {
    if (this.asset) {
      this.populateAssetData(this.asset);
    }
  }

  populateAssetData(asset: Asset): void {
    Object.assign(this, asset);
    this.setTaxBracketsAndSelected(asset);
  }

  setTaxBracketsAndSelected(asset: Asset): void {
    const currentYear: number = new Date().getFullYear();
    const clientData: Client | null =
      this.localStorageService.getItem<Client>('client');

    this.taxBrackets =
      TAX_BRACKETS[currentYear]?.[clientData?.province.toUpperCase() || ''] ||
      [];

    this.selectedTaxBracket = this.taxBrackets.find(
      (bracket: TaxBracket): boolean =>
        bracket.minIncome ===
        (asset.selectedTaxBracket?.minIncome ||
          clientData?.selectedBracket?.minIncome),
    );
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

  updateSelectedTaxBracket(): void {
    if (this.selectedTaxBracket) {
      this.capitalGainsTaxRate = this.selectedTaxBracket.taxRate * 0.5;
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
    if (!this.beneficiaries.length) {
      this.beneficiaries =
        this.localStorageService.getItem<Beneficiary[]>('beneficiaries') || [];
    }
    this.checkDefinedBeneficiaries();
  }

  checkDefinedBeneficiaries(): void {
    const definedBeneficiaries: Beneficiary[] | null =
      this.localStorageService.getItem<Beneficiary[]>('beneficiaries');
    if (definedBeneficiaries && definedBeneficiaries.length === 0) {
      alert('Please add beneficiaries in beneficiary component');
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
      (total: number, beneficiary: Beneficiary) =>
        total + beneficiary.allocation,
      0,
    );
  }

  get currentGrowthDollars(): number {
    return this.currentValue - this.initialValue;
  }

  get currentGrowthPercentage(): number {
    return this.initialValue === 0
      ? 0
      : (this.currentValue / this.initialValue - 1) * 100;
  }

  get futureValueDollars(): number {
    return this.currentValue * Math.pow(1 + this.rate / 100, this.term);
  }

  get futureValueGrowthPercentage(): number {
    const futureValue: number = this.futureValueDollars;
    return this.initialValue === 0
      ? 0
      : (futureValue / this.initialValue - 1) * 100;
  }
}
