import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { DebtComponent } from '../debt/debt.component';
import { LocalStorageService } from '../../services/local-storage.service';
import { Debt } from '../../models/debt.model';

@Component({
  selector: 'app-debt-manager',
  standalone: true,
  imports: [CommonModule, DebtComponent, CurrencyPipe],
  templateUrl: './debt-manager.component.html',
})
export class DebtManagerComponent {
  debts: Debt[] = [];
  editingDebt: Debt | null = null;
  editingDebtIndex: number | null = null;

  constructor(private localStorageService: LocalStorageService) {
    this.loadDebtsFromStorage();
  }

  loadDebtsFromStorage(): void {
    const storedDebts: Debt[] | null =
      this.localStorageService.getItem<Debt[]>('debts');
    if (storedDebts) {
      this.debts = storedDebts;
    }
  }

  addNewDebt(): void {
    this.editingDebt = {
      name: '',
      initialValue: 0,
      yearAcquired: new Date().getFullYear(),
      rate: 0,
      term: 0,
      annualPayment: 0,
    };
  }

  saveDebt(updatedDebt: Debt): void {
    if (this.editingDebtIndex !== null) {
      this.debts[this.editingDebtIndex] = updatedDebt;
    } else {
      this.debts.push(updatedDebt);
    }
    this.editingDebt = null;
    this.editingDebtIndex = null;
    this.updateStorage();
  }

  editDebt(index: number): void {
    if (this.editingDebtIndex !== null && this.editingDebtIndex === index) {
      this.onCancelEditing();
    } else {
      this.editingDebt = { ...this.debts[index] };
      this.editingDebtIndex = index;
    }
  }

  deleteDebt(index: number): void {
    this.debts.splice(index, 1);
    this.updateStorage();
  }

  updateStorage(): void {
    this.localStorageService.setItem('debts', this.debts);

    let totals: { [key: string]: number } =
      this.localStorageService.getItem<{ [key: string]: number }>('totals') ??
      {};
    totals['Debt Future Liability'] = this.totalInsurableFutureValue;
    this.localStorageService.setItem('totals', totals);
  }

  onCancelEditing(): void {
    this.editingDebt = null;
    this.editingDebtIndex = null;
  }

  isEditing(index: number): boolean {
    return this.editingDebtIndex === index;
  }

  get totalInitialValue(): number {
    return this.debts.reduce((sum, debt) => sum + debt.initialValue, 0);
  }

  get totalInsurableFutureValue(): number {
    return this.debts.reduce(
      (sum, debt) => sum + (debt.insurableFutureValueDollars ?? 0),
      0,
    );
  }
}
