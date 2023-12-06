import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe, CommonModule } from '@angular/common';
import { Beneficiary } from '../beneficiary/beneficiary.component';
import {
  FIN_INSTR_TYPES,
  FinTypeAttributes,
} from '../constants/financial-instrument-types.constant';

interface YearValue {
  year: number;
  value: number;
}

@Component({
  selector: 'app-financial-instrument',
  standalone: true,
  imports: [FormsModule, DecimalPipe, CommonModule],
  templateUrl: './financial-instrument.component.html',
})
export class FinancialInstrumentComponent {
  financialInstrumentName: string = '';
  purchasePrice: number = 0;
  yearAcquired: number = new Date().getFullYear();
  currentValue: number = 0;
  annualContribution: number = 0;
  rate: number = 0;
  term: number = 0;
  type: string = '';
  isTaxable: boolean = false;
  isLiquid: boolean = false;
  isToBeSettled: boolean = false;
  beneficiaries: Beneficiary[] = [];

  inputYear: number = new Date().getFullYear();

  financialInstrumentTypes: string[] = Array.from(FIN_INSTR_TYPES.keys());

  capitalGainsTaxRate: number = 0;

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

  onTypeChange(selectedType: string): void {
    const typeInfo: FinTypeAttributes | undefined =
      FIN_INSTR_TYPES.get(selectedType);
    this.isTaxable = typeInfo ? typeInfo.taxable : false;
    this.isLiquid = typeInfo ? typeInfo.liquid : false;
    // Check if the selected type is 'Debt / Loan'
    if (selectedType === 'Debt / Loan') {
      this.ensureNegativeValues();
    }
  }

  private ensureNegativeValues(): void {
    // Convert to negative if the values are positive
    if (this.purchasePrice > 0) {
      this.purchasePrice *= -1;
    }
    if (this.currentValue > 0) {
      this.currentValue *= -1;
    }
  }
  onPurchasePriceChange(): void {
    if (this.type === 'Debt / Loan' && this.purchasePrice > 0) {
      this.purchasePrice *= -1;
    }
  }

  onCurrentValueChange(): void {
    if (this.type === 'Debt / Loan' && this.currentValue > 0) {
      this.currentValue *= -1;
    }
  }
  get currentYearsHeld(): number {
    const currentYear: number = new Date().getFullYear();
    return currentYear - this.yearAcquired;
  }
  get currentGrowthDollars(): number {
    return this.currentValue - this.purchasePrice;
  }
  get currentGrowthPercentage(): number {
    if (this.purchasePrice === 0) {
      return 0;
    }
    return (this.currentValue / this.purchasePrice - 1) * 100;
  }
  get futureValueDollars(): number {
    return this.currentValue * Math.pow(1 + this.rate / 100, this.term);
  }
  get futureValueGrowthPercentage(): number {
    if (this.purchasePrice === 0) {
      return 0;
    }
    return (this.futureValueDollars / this.purchasePrice - 1) * 100;
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
      (this.futureValueDollars - this.purchasePrice) *
      (this.capitalGainsTaxRate / 100.0)
    );
  }
  get annualContributionsToDate(): number {
    return this.annualContribution * this.currentYearsHeld;
  }

  valueAtYear(yearGiven: number): number {
    const currentYear: number = new Date().getFullYear();
    // Before item was acquired, it was worth 0.
    if (yearGiven < this.yearAcquired || yearGiven > currentYear + this.term) {
      return 0;
    }
    // For current year
    if (this.currentYearsHeld === 0 && yearGiven <= currentYear) {
      return this.purchasePrice;
    }
    // For past years
    if (this.yearAcquired <= yearGiven && yearGiven <= currentYear) {
      return (
        this.purchasePrice *
        Math.pow(
          this.currentValue / this.purchasePrice,
          (yearGiven - this.yearAcquired) / this.currentYearsHeld,
        )
      );
    }
    // For future years
    return (
      this.currentValue * Math.pow(1 + this.rate / 100, yearGiven - currentYear)
    );
  }

  valueSeries(startYear: number = 0, endYear: number = 0): YearValue[] {
    if (
      startYear === 0 &&
      endYear === 0 &&
      this.yearAcquired >= 1900 &&
      this.term <= 30
    ) {
      startYear = this.yearAcquired;
      endYear = new Date().getFullYear() + this.term;
    }

    const series: YearValue[] = [];
    for (let year: number = startYear; year <= endYear; year++) {
      series.push({ year: year, value: this.valueAtYear(year) });
    }
    return series;
  }
}
