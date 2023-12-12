import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface Debt {
  name: string;
  initialValue: number;
  yearAcquired: number;
  rate: number;
  term: number;
  annualPayment: number;
}

@Component({
  imports: [FormsModule, DecimalPipe, CommonModule],
  selector: 'app-debt',
  standalone: true,
  templateUrl: './debt.component.html',
})
export class DebtComponent implements OnInit {
  name: string = '';
  initialValue: number = 0;
  yearAcquired: number = new Date().getFullYear();
  rate: number = 0;
  term: number = 0;
  annualPayment: number = 0;

  constructor() {}

  ngOnInit(): void {
    // Initialization logic here
  }

  get currentYearsHeld(): number {
    const currentYear: number = new Date().getFullYear();
    return currentYear - this.yearAcquired;
  }

  get amountPaidOffDollars(): number {
    return this.annualPayment * this.currentYearsHeld;
  }

  get currentValueOfDebtDollars(): number {
    return (
      this.initialValue * Math.pow(1 + this.rate / 100, this.currentYearsHeld)
    );
  }

  get debtRemainingDollars(): number {
    return Math.max(
      0,
      this.currentValueOfDebtDollars - this.amountPaidOffDollars,
    );
  }

  get yearsToBePaidOff(): number {
    return DebtComponent.nper(
      this.rate,
      this.annualPayment,
      this.debtRemainingDollars,
    );
  }

  get futureValueOfActualTermDebtDollars(): number {
    return this.initialValue * Math.pow(1 + this.rate / 100, this.term);
  }

  get insurableFutureValueDollars(): number {
    return this.futureValueOfActualTermDebtDollars - this.amountPaidOffDollars;
  }

  static nper(
    rate: number,
    annualPayment: number,
    presentValue: number,
  ): number {
    rate = rate / 100; // Convert to decimal

    // Ensure rate is positive and non-zero
    if (rate <= 0) {
      rate *= -1;
    }

    // The formula to calculate nper
    const numerator = Math.log(
      annualPayment / (annualPayment - presentValue * rate),
    );
    const denominator = Math.log(1 + rate);
    return numerator / denominator;
  }
}
