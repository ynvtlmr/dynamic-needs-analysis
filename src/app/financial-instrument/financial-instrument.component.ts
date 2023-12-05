import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe, CommonModule } from '@angular/common';
import { FIN_INSTR_TYPES } from '../constants/financial-instrument-types.constant';

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

  financialInstrumentTypes: string[] = Array.from(FIN_INSTR_TYPES.keys());

  onTypeChange(selectedType: string): void {
    const typeInfo = FIN_INSTR_TYPES.get(selectedType);
    this.isTaxable = typeInfo ? typeInfo.taxable : false;
    this.isLiquid = typeInfo ? typeInfo.liquid : false;
  }
  get currentYearsHeld(): number {
    const currentYear = new Date().getFullYear();
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
}
