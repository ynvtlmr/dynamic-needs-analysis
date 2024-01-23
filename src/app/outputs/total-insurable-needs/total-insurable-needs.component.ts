import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocalStorageService } from '../../services/local-storage.service';
import { Subscription } from 'rxjs';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Liability {
  name: string;
  value: number | string;
  percentageAllocation: number;
  calculatedCoverage: number;
}

@Component({
  selector: 'app-total-insurable-needs',
  templateUrl: './total-insurable-needs.component.html',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, FormsModule],
})
export class TotalInsurableNeedsComponent implements OnInit, OnDestroy {
  liabilities: Liability[] = [];
  totalInsurableNeed: number = 0;
  private storageSub!: Subscription;

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.loadDataFromStorage();
    this.subscribeToLocalStorageChanges();
  }

  ngOnDestroy(): void {
    if (this.storageSub) {
      this.storageSub.unsubscribe();
    }
  }

  private loadDataFromStorage(): void {
    const totals =
      this.localStorageService.getItem<{ [key: string]: any }>('totals') ?? {};
    const percentAllocations =
      this.localStorageService.getItem<{ [key: string]: number }>(
        'totalsPercentAllocations',
      ) ?? {};

    this.liabilities = Object.entries(totals).map(([name, value]) => ({
      name,
      value,
      percentageAllocation: this.isNumeric(value)
        ? percentAllocations[name] ?? 0
        : 0,
      calculatedCoverage: this.isNumeric(value)
        ? ((percentAllocations[name] ?? 0) * Number(value)) / 100
        : 0,
    }));
    this.calculateTotalInsurableNeed();
  }

  private calculateTotalInsurableNeed(): void {
    this.totalInsurableNeed = this.liabilities.reduce((acc, liability) => {
      return (
        acc + (this.isNumeric(liability.value) ? Number(liability.value) : 0)
      );
    }, 0);
  }

  private subscribeToLocalStorageChanges(): void {
    this.storageSub = this.localStorageService.watchStorage().subscribe(() => {
      this.loadDataFromStorage();
    });
  }

  onPercentageChange(liability: Liability): void {
    if (this.isNumeric(liability.value)) {
      liability.calculatedCoverage =
        (Number(liability.value) * liability.percentageAllocation) / 100;
      this.storePercentageAllocations();
    }
  }

  private storePercentageAllocations(): void {
    const allocations = this.liabilities.reduce(
      (acc, liability) =>
        this.isNumeric(liability.value)
          ? { ...acc, [liability.name]: liability.percentageAllocation }
          : acc,
      {},
    );

    this.localStorageService.setItem('totalsPercentAllocations', allocations);
  }

  isNumeric(value: any): boolean {
    return !isNaN(value) && isFinite(value);
  }
}
