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
import { Debt } from '../../models/debt.model';

@Component({
  selector: 'app-debt',
  templateUrl: './debt.component.html',
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
export class DebtComponent implements OnChanges {
  name: string = '';
  initialValue: number = 0;
  yearAcquired: number = new Date().getFullYear();
  rate: number = 0;
  term: number = 0;
  annualPayment: number = 0;

  @Input() debt: Debt | null = null;
  @Output() save: EventEmitter<Debt> = new EventEmitter<Debt>();
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();

  ngOnChanges(): void {
    if (this.debt) {
      this.populateDebtData(this.debt);
    }
  }

  populateDebtData(debt: Debt): void {
    this.name = debt.name;
    this.initialValue = debt.initialValue;
    this.yearAcquired = debt.yearAcquired;
    this.rate = debt.rate;
    this.term = debt.term;
    this.annualPayment = debt.annualPayment;
  }
  onSave(): void {
    const debt: Debt = {
      name: this.name,
      initialValue: this.initialValue,
      yearAcquired: this.yearAcquired,
      rate: this.rate,
      term: this.term,
      annualPayment: this.annualPayment,
      insurableFutureValueDollars: this.insurableFutureValueDollars,
    };
    this.save.emit(debt);
  }

  onCancel(): void {
    this.cancel.emit();
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
    rate = rate / 100;

    if (rate <= 0) {
      rate *= -1;
    }

    const numerator: number = Math.log(
      annualPayment / (annualPayment - presentValue * rate),
    );
    const denominator: number = Math.log(1 + rate);
    return numerator / denominator;
  }
}
