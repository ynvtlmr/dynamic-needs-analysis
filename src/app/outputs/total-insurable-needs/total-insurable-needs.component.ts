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
  level: number; // Indentation level for visual hierarchy
  path: string[]; // Path to this item in the totals object
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

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.storageSub = this.localStorageService.watchStorage().subscribe({
      next: (key) => {
        if (key === 'totals') {
          this.loadAndParseTotals();
        }
      },
    });
    this.loadAndParseTotals(); // Initial load
  }

  ngOnDestroy(): void {
    this.storageSub.unsubscribe();
  }

  private loadAndParseTotals(): void {
    const totals =
      this.localStorageService.getItem<Record<string, TotalItem>>('totals');
    if (totals) {
      this.totals = totals;
      this.displayData = [];
      this.processTotalsObject(totals, 0, []);
    }
  }

  private processTotalsObject(
    totals: Record<string, TotalItem>,
    level: number,
    path: string[],
  ): void {
    Object.entries(totals).forEach(([key, item]) => {
      const currentPath = [...path, key];
      const label = key; // Use only the current key as the label for all nodes

      if (item.subcategories) {
        // Parent node
        this.displayData.push({ label, level, path: currentPath });
        this.processTotalsObject(item.subcategories, level + 1, currentPath);
      } else {
        // Leaf node
        this.displayData.push({
          label,
          value: item.value,
          priority: item.priority,
          level,
          path: currentPath,
        });
      }
    });
  }

  updateItemPriority(row: DisplayRow): void {
    let ref = this.totals;
    row.path.forEach((key, index) => {
      if (index === row.path.length - 1) {
        ref[key].priority = row.priority;
      } else {
        ref = ref[key].subcategories!;
      }
    });
    this.localStorageService.setItem('totals', this.totals);
  }
}
