import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Beneficiary } from '../beneficiary/beneficiary.component';
import {
  FIN_INSTR_TYPES,
  FinTypeAttributes,
} from '../constants/asset-types.constant';
import { TAX_BRACKETS, TaxBracket } from '../constants/tax.constant';
import { LocalStorageService } from '../services/local-storage.service';

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
  capitalGainsTaxRate: number;
  financialInstrumentTypes: string[];
  beneficiaries: Beneficiary[];
}

@Component({
  imports: [FormsModule, DecimalPipe, CommonModule],
  selector: 'app-asset',
  standalone: true,
  templateUrl: './asset.component.html',
})
export class AssetComponent implements OnInit {
  name: string = '';
  initialValue: number = 0;
  currentValue: number = 0;
  yearAcquired: number = new Date().getFullYear();
  rate: number = 0;
  term: number = 0;
  type: string = '';

  // boolean attributes
  isTaxable: boolean = false;
  isLiquid: boolean = false;
  isToBeSold: boolean = false;

  // other
  beneficiaries: Beneficiary[] = [];
  capitalGainsTaxRate: number = 0;
  financialInstrumentTypes: string[] = Array.from(FIN_INSTR_TYPES.keys());

  // tax
  taxBrackets: TaxBracket[] = [];
  selectedBracket: TaxBracket | undefined;

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.loadCapitalGainsTaxRate();
    this.loadBeneficiaries();
    this.initializeTaxBrackets();
  }

  private initializeTaxBrackets(): void {
    const year = new Date().getFullYear(); // Use current year or a specific year
    const province = this.localStorageService.getItem('client')?.province; // Load province from client data
    if (province) {
      this.taxBrackets = TAX_BRACKETS[year]?.[province.toUpperCase()] || [];
      this.selectedBracket = this.taxBrackets[0]; // Initialize to the first bracket or a specific logic
    }

    const selectedTaxBracket =
      this.localStorageService.getItem('selectedTaxBracket');
    if (selectedTaxBracket) {
      const storedBracket = selectedTaxBracket;
      this.selectedBracket = this.taxBrackets.find(
        (bracket) => bracket.minIncome === storedBracket.minIncome,
      );
    }
  }

  get currentYearsHeld(): number {
    const currentYear: number = new Date().getFullYear();
    return currentYear - this.yearAcquired;
  }

  private loadCapitalGainsTaxRate(): void {
    const selectedBracketString =
      this.localStorageService.getItem('selectedTaxBracket');
    if (selectedBracketString) {
      this.capitalGainsTaxRate = selectedBracketString.taxRate * 0.5;
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
    const typeInfo: undefined | FinTypeAttributes =
      FIN_INSTR_TYPES.get(selectedType);
    this.isTaxable = typeInfo ? typeInfo.taxable : false;
    this.isLiquid = typeInfo ? typeInfo.liquid : false;
  }

  loadBeneficiaries(): void {
    this.beneficiaries =
      this.localStorageService.getItem('beneficiaries') || [];
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
