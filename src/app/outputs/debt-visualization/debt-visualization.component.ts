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
        type: 'area', // Line chart to show the progression of debts over time
        height: 350,
        animations: {
          enabled: false, // Disable animations
        },
        toolbar: {
          show: false, // Hide the toolbar
        },
        stacked: true,
      },
      xaxis: {
        type: 'numeric', // Numeric x-axis to represent years
        title: { text: "Years" },
      },
      yaxis: {
        title: { text: "Debt Value ($)" },
      },
      tooltip: {
        y: {
          formatter: (val: number) => `$${val.toFixed(2)}`, // Format tooltip values as currency
        },
      },
      dataLabels: { enabled: false },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
        },
      },
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
    const startYear: number = Math.min(...this.debts.map(d => d.yearAcquired));
    const endYear: number = Math.max(...this.debts.map(d => d.yearAcquired + d.term));

    // Update x-axis with the year range
    this.chartOptions.xaxis = { ...this.chartOptions.xaxis, min: startYear, max: endYear };

    // Map each debt to a series in the chart
    this.chartOptions.series = this.debts.map(debt => {
      return {
        name: debt.name,
        data: Array.from({length: endYear - startYear + 1}, (_, i) => startYear + i)
          .map(year => [year, this.debtValueOverTime(debt, year)])
      };
    });
  }

  private debtValueOverTime(debt: Debt, year: number): number {
    // If the year is before the debt was acquired, return 0
    if (year < debt.yearAcquired) {
      return 0;
    }

    // Initialize remaining debt as the initial value for the year the debt was acquired
    let remainingDebt = year === debt.yearAcquired ? debt.initialValue : this.debtValueOverTime(debt, year - 1);

    // If the debt was already paid off last year, it remains 0
    if (remainingDebt <= 0) {
      return 0;
    }

    // Apply the interest rate to the remaining debt from the previous year
    remainingDebt *= Math.pow(1 + debt.rate / 100, 1);

    // Subtract this year's payment, but don't let the debt go below 0
    remainingDebt = Math.max(0, remainingDebt - debt.annualPayment);

    return remainingDebt;
  }
}
