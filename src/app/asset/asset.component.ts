import { Component, OnInit } from '@angular/core';
import { FinancialInstrumentBase } from '../finance/financial-instrument.utils';
import { Beneficiary } from '../beneficiary/beneficiary.component';
import { FormsModule } from '@angular/forms';
import { CommonModule, DecimalPipe } from '@angular/common';
import {
  FIN_INSTR_TYPES,
  FinTypeAttributes,
} from '../constants/asset-types.constant';

@Component({
  selector: 'app-asset',
  templateUrl: './asset.component.html',
  standalone: true,
  imports: [FormsModule, DecimalPipe, CommonModule],
})
export class AssetComponent extends FinancialInstrumentBase implements OnInit {
  type: string = '';
  isTaxable: boolean = false;
  isLiquid: boolean = false;
  isToBeSold: boolean = false;
  beneficiaries: Beneficiary[] = []; // Initialize with an empty array
  capitalGainsTaxRate: number = 0;
  financialInstrumentTypes: string[] = Array.from(FIN_INSTR_TYPES.keys());

  constructor() {
    // If needed, pass default values or modify as per requirements
    super('', 0, new Date().getFullYear(), 0, 0, 0);
  }

  ngOnInit(): void {
    this.loadCapitalGainsTaxRate();
  }

  private loadCapitalGainsTaxRate(): void {
    const selectedBracketString = localStorage.getItem('selectedTaxBracket');
    if (selectedBracketString) {
      const selectedBracket = JSON.parse(selectedBracketString);
      this.capitalGainsTaxRate = selectedBracket.taxRate * 0.5;
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
    const beneficiariesData = localStorage.getItem('beneficiaries');
    if (beneficiariesData) {
      this.beneficiaries = JSON.parse(beneficiariesData);
    }
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
