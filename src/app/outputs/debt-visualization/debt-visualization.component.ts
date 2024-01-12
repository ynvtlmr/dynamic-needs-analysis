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
import { Debt } from '../../models/debt.model';
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
  private debtValuesCache: Map<string, number> = new Map<string, number>();

  constructor(private localStorageService: LocalStorageService) {
    this.initializeChart();
  }

  ngOnInit(): void {
    this.loadDebts();

    this.storageSub = this.localStorageService
      .watchStorage()
      .subscribe((key: string): void => {
        if (key === 'debts' || key === 'all') {
          this.loadDebts();
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
      series: [],
      chart: {
        type: 'line',
        height: 350,
        animations: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
        stacked: false,
      },
      xaxis: {
        type: 'numeric',
        title: { text: 'Years' },
      },
      yaxis: {
        title: { text: 'Debt Value ($)' },
      },
      tooltip: {
        y: {
          formatter: (val: number): string => `$${val.toFixed(2)}`,
        },
      },
      dataLabels: { enabled: false },
      legend: {
        position: 'top',
      },
    };
  }

  private loadDebts(): void {
    this.debts = this.localStorageService.getItem('debts') || [];
    this.debtValuesCache.clear();
    this.prepareChartData();
  }

  private prepareChartData(): void {
    const startYear: number = Math.min(
      ...this.debts.map((d: Debt) => d.yearAcquired),
    );
    const endYear: number = Math.max(
      ...this.debts.map((d: Debt) => d.yearAcquired + d.term),
    );

    this.chartOptions.series = this.debts.map((debt: Debt) => {
      return {
        name: debt.name,
        data: Array.from(
          { length: endYear - startYear + 1 },
          (_, i: number) => startYear + i,
        ).map((year: number) => [year, this.debtValueOverTime(debt, year)]),
      };
    });

    this.chartOptions.xaxis = {
      ...this.chartOptions.xaxis,
      min: startYear,
      max: endYear,
      labels: {
        formatter: (value: string): string => {
          return `'${value.toString().slice(-2)}`;
        },
      },
    };
  }

  private debtValueOverTime(debt: Debt, year: number): number {
    const cacheKey: string = `${debt.name}-${year}`;
    if (this.debtValuesCache.has(cacheKey)) {
      return this.debtValuesCache.get(cacheKey)!;
    }

    if (year < debt.yearAcquired) {
      return 0;
    }

    let remainingDebt: number =
      year === debt.yearAcquired
        ? debt.initialValue
        : this.debtValueOverTime(debt, year - 1);

    if (remainingDebt <= 0) {
      this.debtValuesCache.set(cacheKey, 0);
      return 0;
    }

    remainingDebt *= Math.pow(1 + debt.rate / 100, 1);
    remainingDebt = Math.max(0, remainingDebt - debt.annualPayment);

    this.debtValuesCache.set(cacheKey, remainingDebt);
    return remainingDebt;
  }
}
