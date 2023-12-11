import { Component, OnInit } from '@angular/core';
import { FinancialInstrumentBase } from '../finance/financial-instrument.utils';
import { FormsModule } from '@angular/forms';
import { CommonModule, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-debt',
  templateUrl: './debt.component.html',
  standalone: true,
  imports: [FormsModule, DecimalPipe, CommonModule],
})
export class DebtComponent extends FinancialInstrumentBase implements OnInit {
  annualPayment: number = 0;

  constructor() {
    super('', 0, new Date().getFullYear(), 0, 0, 0);
  }

  ngOnInit(): void {
    // Initialization logic here
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
    return Math.max(0, this.currentValueOfDebtDollars - this.amountPaidOffDollars);
  }

  get yearsToBePaidOff(): number {
    return DebtComponent.nper(this.rate, this.annualPayment, this.initialValue);
  }

  get futureValueOfActualTermDebtDollars(): number {
    return this.initialValue * Math.pow(1 + this.rate / 100, this.term);
  }

  get insurableFutureValueDollars(): number {
    return this.futureValueOfActualTermDebtDollars - this.amountPaidOffDollars;
  }

  static nper(rate: number, annualPayment: number, presentValue: number): number {
    rate = rate / 100; // Convert to decimal

    // Ensure rate is positive and non-zero
    if (rate <= 0) {
      throw new Error("Interest rate must be positive.");
    }

    // The formula to calculate nper
    const numerator = Math.log(annualPayment / (annualPayment - presentValue * rate));
    const denominator = Math.log(1 + rate);
    return numerator / denominator;
  }

}
