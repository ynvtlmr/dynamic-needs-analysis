import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocalStorageService } from '../../services/local-storage.service';
import { Subscription } from 'rxjs';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Liability {
  name: string;
  value: number;
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
      this.localStorageService.getItem<{ [key: string]: number }>('totals') ??
      {};
    const percentAllocations =
      this.localStorageService.getItem<{ [key: string]: number }>(
        'totalsPercentAllocations',
      ) ?? {};

    this.liabilities = Object.entries(totals).map(([name, value]) => ({
      name,
      value,
      percentageAllocation: percentAllocations[name] ?? 0,
      calculatedCoverage: ((percentAllocations[name] ?? 0) * value) / 100,
    }));
  }

  private subscribeToLocalStorageChanges(): void {
    this.storageSub = this.localStorageService.watchStorage().subscribe(() => {
      this.loadDataFromStorage();
    });
  }

  onPercentageChange(liability: Liability): void {
    liability.calculatedCoverage =
      (liability.value * liability.percentageAllocation) / 100;
    this.storePercentageAllocations();
  }

  private storePercentageAllocations(): void {
    const allocations = this.liabilities.reduce(
      (acc, liability) => ({
        ...acc,
        [liability.name]: liability.percentageAllocation,
      }),
      {},
    );

    this.localStorageService.setItem('totalsPercentAllocations', allocations);
  }
}
