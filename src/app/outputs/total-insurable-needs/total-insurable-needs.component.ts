import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocalStorageService } from '../../services/local-storage.service';
import { KeyValuePipe, NgForOf, NgIf, CurrencyPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

interface TotalItem {
  value: number;
  priority: number;
  subcategories?: Record<string, TotalItem>;
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
  formattedData: any[] = [];

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
    this.storageSub = this.localStorageService
      .watchStorage()
      .subscribe((key: string): void => {
        if (key === 'totals') {
          this.loadTotals();
        }
      });
    this.loadTotals();
    this.formatTotalsForDisplay();
    console.log(this.totals);
    console.log(this.formattedData);
  }

  ngOnDestroy(): void {
    if (this.storageSub) {
      this.storageSub.unsubscribe();
    }
  }

  private loadTotals(): void {
    const totalsFromStorage: Record<string, TotalItem> | null =
      this.localStorageService.getItem<Record<string, TotalItem>>('totals');
    if (totalsFromStorage) {
      this.totals = totalsFromStorage;
    }
  }

  private formatTotalsForDisplay(): void {
    this.formattedData = []; // Reset formatted data

    TotalInsurableNeedsComponent.ITEMS_ORDER.forEach((category) => {
      const categoryData = this.totals[category];
      if (!categoryData) {
        return;
      }

      if (categoryData.subcategories) {
        this.formattedData.push({
          category,
          subCategory: '',
          name: '',
          isCategory: true,
        });
        this.processSubcategories(categoryData.subcategories, category, 1);
      } else {
        this.formattedData.push({
          category,
          subCategory: '',
          name: '',
          ...categoryData,
        });
      }
    });
  }

  private processSubcategories(
    subcategories: Record<string, TotalItem>,
    parentCategory: string,
    level: number,
  ): void {
    Object.entries(subcategories).forEach(([subCategory, subCatData]) => {
      if (subCatData.subcategories) {
        this.formattedData.push({
          category: parentCategory,
          subCategory,
          name: '',
          isSubcategory: true,
          level,
        });
        this.processSubcategories(
          subCatData.subcategories,
          subCategory,
          level + 1,
        );
      } else {
        this.formattedData.push({
          category: parentCategory,
          subCategory,
          name: subCategory,
          ...subCatData,
          level,
        });
      }
    });
  }

  updateItemPriority(item: any): void {
    // Construct the path to the item in the totals object
    const path = [item.category];
    if (item.subCategory) path.push(item.subCategory);
    if (item.name) path.push(item.name);

    // Update the priority in the totals object
    let ref = this.totals;
    path.forEach((key, index) => {
      if (index === path.length - 1) {
        // Update priority at the leaf node
        ref[key].priority = item.priority;
      } else {
        // Navigate to the next level
        ref = ref[key].subcategories!;
      }
    });

    // Save the updated totals object to localStorage
    this.localStorageService.setItem('totals', this.totals);
  }
}
