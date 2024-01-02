// debt-visualization.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexLegend,
  ApexXAxis,
  ApexYAxis,
  ApexTooltip,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { Debt } from '../../inputs/debt/debt.component';
import { LocalStorageService } from '../../services/local-storage.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  yaxis: ApexYAxis;
  fill: ApexFill;
  legend: ApexLegend;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-debt-visualization',
  templateUrl: './debt-visualization.component.html',
  imports: [NgApexchartsModule],
  standalone: true,
})
export class DebtVisualizationComponent implements OnInit, OnDestroy {
  private storageSub!: Subscription;
  public chartOptions!: Partial<ChartOptions>;
  private debts: Debt[] = [];
  private debtValuesCache = new Map<string, number>(); // Cache to store computed debt values

  constructor(private localStorageService: LocalStorageService) {
    this.initializeChart();
  }

  ngOnInit(): void {
    this.loadDebts(); // Load initial debts

    // Subscribe to changes in localStorage
    this.storageSub = this.localStorageService
      .watchStorage()
      .subscribe((key) => {
        if (key === 'debts' || key === 'all') {
          this.loadDebts(); // Reload and update chart if debts change
        }
      });
  }

  ngOnDestroy(): void {
    if (this.storageSub) {
      this.storageSub.unsubscribe();
    }
  }

  private initializeChart(): void {
    this.chartOptions = {
      series: [], // Will be populated with debt data
      chart: {
        type: 'line', // Line chart to show the progression of debts over time
        height: 350,
        animations: {
          enabled: false, // Disable animations
        },
        toolbar: {
          show: false, // Hide the toolbar
        },
        stacked: false,
      },
      xaxis: {
        type: 'numeric', // Numeric x-axis to represent years
        title: { text: 'Years' },
      },
      yaxis: {
        title: { text: 'Debt Value ($)' },
      },
      tooltip: {
        y: {
          formatter: (val: number) => `$${val.toFixed(2)}`, // Format tooltip values as currency
        },
      },
      dataLabels: { enabled: false },
      legend: {
        position: 'top', // Place legend at the top of the chart
      },
    };
  }

  private loadDebts(): void {
    this.debts = this.localStorageService.getItem('debts') || [];
    this.prepareChartData();
  }

  private prepareChartData(): void {
    // Find the earliest year and the latest possible term across all debts
    const startYear: number = Math.min(
      ...this.debts.map((d) => d.yearAcquired),
    );
    const endYear: number = Math.max(
      ...this.debts.map((d) => d.yearAcquired + d.term),
    );

    // Map each debt to a series in the chart
    this.chartOptions.series = this.debts.map((debt) => {
      return {
        name: debt.name,
        data: Array.from(
          { length: endYear - startYear + 1 },
          (_, i) => startYear + i,
        ).map((year) => [year, this.debtValueOverTime(debt, year)]),
      };
    });

    // Update x-axis with the year range and formatter for labels
    this.chartOptions.xaxis = {
      ...this.chartOptions.xaxis,
      min: startYear,
      max: endYear,
      labels: {
        formatter: (value) => {
          // Extract the last two digits and prepend with a quote
          return `'${value.toString().slice(-2)}`;
        },
      },
    };
  }

  private debtValueOverTime(debt: Debt, year: number): number {
    const cacheKey = `${debt.name}-${year}`; // Unique key for the debt and year
    if (this.debtValuesCache.has(cacheKey)) {
      return this.debtValuesCache.get(cacheKey)!; // Return cached value if available
    }

    if (year < debt.yearAcquired) {
      return 0;
    }

    let remainingDebt =
      year === debt.yearAcquired
        ? debt.initialValue
        : this.debtValueOverTime(debt, year - 1);

    if (remainingDebt <= 0) {
      this.debtValuesCache.set(cacheKey, 0);
      return 0;
    }

    remainingDebt *= Math.pow(1 + debt.rate / 100, 1);
    remainingDebt = Math.max(0, remainingDebt - debt.annualPayment);

    this.debtValuesCache.set(cacheKey, remainingDebt); // Store the calculated value in the cache
    return remainingDebt;
  }
}
