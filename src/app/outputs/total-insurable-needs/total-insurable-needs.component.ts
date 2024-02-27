import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocalStorageService } from '../../services/local-storage.service';
import { KeyValuePipe, NgForOf, NgIf, CurrencyPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

interface TotalItem {
  value?: number;
  priority?: number;
  subcategories?: Record<string, TotalItem>;
}

interface DisplayRow {
  label: string;
  value?: number;
  priority?: number;
  level: number;
  path: string[];
}

@Component({
  selector: 'app-total-insurable-needs',
  standalone: true,
  imports: [KeyValuePipe, FormsModule, NgIf, NgForOf, CurrencyPipe],
  templateUrl: './total-insurable-needs.component.html',
})
export class TotalInsurableNeedsComponent implements OnInit, OnDestroy {
  private storageSub!: Subscription;
  totals: Record<string, TotalItem> = {};
  displayData: DisplayRow[] = [];

  static readonly ITEMS_ORDER: string[] = [
    'Income Replacement',
    'Estate Tax Liability',
    'Equalization',
    'Debt Future Liability',
    'Goal Shortfall',
    'Key Man',
    'Shareholder Agreement',
  ];

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.storageSub = this.localStorageService.watchStorage().subscribe({
      next: (key: string): void => {
        if (key === 'totals') {
          this.loadAndParseTotals();
        }
      },
    });
    this.loadAndParseTotals();
  }

  ngOnDestroy(): void {
    this.storageSub.unsubscribe();
  }

  private loadAndParseTotals(): void {
    const totalsFromStorage =
      this.localStorageService.getItem<Record<string, TotalItem>>('totals');
    if (totalsFromStorage) {
      this.totals = totalsFromStorage;
      this.displayData = [];
      TotalInsurableNeedsComponent.ITEMS_ORDER.forEach((item: string): void => {
        if (totalsFromStorage[item]) {
          this.processTotalsObject(totalsFromStorage[item], 0, [item]);
        }
      });
    }
  }

  private processTotalsObject(
    totalItem: TotalItem,
    level: number,
    path: string[],
  ): void {
    const label: string = path[path.length - 1];
    if (totalItem.subcategories) {
      // Parent node
      this.displayData.push({ label, level, path });
      Object.entries(totalItem.subcategories).forEach(([key, item]) => {
        this.processTotalsObject(item, level + 1, [...path, key]);
      });
    } else {
      // Leaf node
      this.displayData.push({
        label,
        value: totalItem.value,
        priority: totalItem.priority,
        level,
        path,
      });
    }
  }

  updateItemPriority(row: DisplayRow): void {
    let ref = this.totals;
    row.path.forEach((key: string, index: number): void => {
      if (index === row.path.length - 1) {
        ref[key].priority = row.priority;
      } else {
        ref = ref[key].subcategories!;
      }
    });
    this.localStorageService.setItem('totals', this.totals);
  }

  get totalValue(): number {
    return this.displayData.reduce(
      (acc: number, row: DisplayRow) => acc + (row.value || 0),
      0,
    );
  }

  get totalAllocatedBudget(): number {
    return this.displayData.reduce(
      (acc: number, row: DisplayRow) =>
        acc + ((row.value || 0) * (row.priority || 0)) / 100,
      0,
    );
  }
}
