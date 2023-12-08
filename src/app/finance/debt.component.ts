import { Component, OnInit } from '@angular/core';
import { FinancialInstrumentBase } from './financial-instrument.utils';
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

  get currentvalueOfDebtDollars(): number {
    return (
      this.initialValue * Math.pow(1 + this.rate / 100, this.currentYearsHeld)
    );
  }

  get debtRemainingDollars(): number {
    return this.currentvalueOfDebtDollars - this.amountPaidOffDollars;
  }

  get yearsToBePaidOff(): number {
    return -DebtComponent.nper(this.rate, this.annualPayment);
  }

  get futureValueOfActualTermDebtDollars(): number {
    return (
      this.currentvalueOfDebtDollars * Math.pow(1 + this.rate / 100, this.term)
    );
  }

  get insurableFutureValueDollars(): number {
    return this.futureValueOfActualTermDebtDollars - this.amountPaidOffDollars;
  }

  static nper(rate: number, annualPayment: number, fv: number = 0.0): number {
    if (rate <= 0) {
      rate = -rate;
    }

    const denominator = annualPayment + (rate / 100) * annualPayment;
    const numerator = annualPayment - (rate / 100) * fv;
    if (denominator === 0) {
      return 0;
    }

    const a = Math.log(numerator / denominator);
    const b = Math.log(1.0 + rate / 100.0);
    return a / b;
  }
}
