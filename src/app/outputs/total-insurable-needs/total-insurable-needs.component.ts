import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../services/local-storage.service';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

interface TotalsRow {
  key: string;
  label: string;
  value?: number;
  priority?: number;
}

@Component({
  selector: 'app-total-insurable-needs',
  standalone: true,
  imports: [
    FormsModule,
    DecimalPipe,
    CommonModule,
    NgxMaskPipe,
    NgxMaskDirective,
    CurrencyPipe,
  ],
  templateUrl: './total-insurable-needs.component.html',
})
export class TotalInsurableNeedsComponent implements OnInit {
  totalsData: TotalsRow[] = [];

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.loadTotalsData();
  }

  private loadTotalsData(): void {
    const totals =
      this.localStorageService.getItem<Record<string, any>>('totals');
    const totalsPercentAllocations = this.localStorageService.getItem<
      Record<string, any>
    >('totalsPercentAllocations');

    if (totals) {
      Object.entries(totals).forEach(([key, value]) => {
        let sum: number = 0;
        let priority: number | undefined;

        if (typeof value === 'object' && !Array.isArray(value)) {
          sum = Object.values(value).reduce((acc: number, val: any) => {
            return (
              acc + (this.isNumeric(val) ? val : this.sumNestedValues(val))
            );
          }, 0);
        } else if (this.isNumeric(value)) {
          sum = value;
          priority = totalsPercentAllocations?.[key];
        }
        this.totalsData.push({ key, label: key, value: sum, priority });
      });
    }
    console.log(this.totalsData);
  }

  private isNumeric(value: any): boolean {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  private sumNestedValues(obj: any): number {
    if (typeof obj === 'object' && !Array.isArray(obj)) {
      return Object.values(obj).reduce((acc: number, val: any) => {
        return acc + (this.isNumeric(val) ? val : 0);
      }, 0);
    }
    return 0;
  }

  updatePriority(key: string, newPriority: number | undefined): void {
    let totalsPercentAllocations =
      this.localStorageService.getItem<Record<string, any>>(
        'totalsPercentAllocations',
      ) || {};
    totalsPercentAllocations[key] = newPriority;
    this.localStorageService.setItem(
      'totalsPercentAllocations',
      totalsPercentAllocations,
    );
  }
}
