import { Component } from '@angular/core';
import { FormsModule } from "@angular/forms";
import {DecimalPipe} from "@angular/common";

@Component({
  selector: 'app-financial-instrument',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  templateUrl: './financial-instrument.component.html',
})
export class FinancialInstrumentComponent {
  financialInstrumentName: string = '';
  purchasePrice: number = 0;
  yearAcquired: number = new Date().getFullYear();
  currentValue: number = 0;
  rate: number = 0;
  term: number = 0;

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
