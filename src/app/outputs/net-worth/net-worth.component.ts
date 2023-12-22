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
import { Asset } from '../../inputs/asset/asset.component';
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

interface YearValue {
  year: number;
  value: number;
}

@Component({
  selector: 'app-net-worth',
  templateUrl: './net-worth.component.html',
  imports: [NgApexchartsModule],
  standalone: true,
})
export class NetWorthComponent implements OnInit, OnDestroy {
  private storageSub!: Subscription;
  public chartOptions!: Partial<ChartOptions>;
  private assets: Asset[] = [];

  constructor(private localStorageService: LocalStorageService) {
    this.initializeChart();
  }

  ngOnInit(): void {
    this.loadAssets(); // Load initial assets

    this.storageSub = this.localStorageService.watchStorage().subscribe((key) => {
      if (key === 'assets' || key === 'all') {
        this.loadAssets(); // Reload and update chart if assets change
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
      series: [], // Initialize as empty array
      chart: {
        type: 'area',
        height: 350,
        animations: {
          enabled: false // Disable animations
        },
        stacked: true,
      } as ApexChart,
      xaxis: {
        type: 'numeric',
        tickAmount: 0,
        min: 0,
        max: 0,
        labels: {
          formatter: (value: string) => {
            // Convert string to number, round it, then back to string
            const valAsNumber = parseFloat(value);
            return isNaN(valAsNumber)
              ? value
              : Math.round(valAsNumber).toString();
          },
        },
      } as ApexXAxis,
      dataLabels: {
        enabled: false,
      } as ApexDataLabels,
      fill: {
        type: 'gradient',
        gradient: {
          opacityFrom: 0.6,
          opacityTo: 0.8,
        },
      } as ApexFill,
      legend: {
        position: 'top',
        horizontalAlign: 'left',
      } as ApexLegend,
      tooltip: {
        y: {
          formatter: (val: number) => `$${val.toFixed(0)}`, // Format as currency
        },
      },
    };
  }

  private loadAssets(): void {
    this.assets = this.localStorageService.getItem('assets') || [];
    this.prepareChartData();
  }

  private prepareChartData(): void {
    // Calculate startYear and endYear
    const startYear: number = Math.min(
      ...this.assets.map((a) => a.yearAcquired),
    );
    const endYear: number = Math.max(
      ...this.assets.map((a) => a.yearAcquired + a.term),
    );

    // Configure x-axis range
    if (this.chartOptions && this.chartOptions.xaxis) {
      this.chartOptions.xaxis.min = startYear;
      this.chartOptions.xaxis.max = endYear;
      this.chartOptions.xaxis.tickAmount = endYear - startYear + 1;
    }

    // Aggregate series data for each asset
    this.chartOptions.series = this.assets.map((asset) => ({
      name: asset.name,
      data: this.valueSeries(asset, startYear, endYear).map((yv) => [
        yv.year,
        yv.value,
      ]),
    }));
  }

  private valueAtYear(asset: Asset, yearGiven: number): number {
    const currentYear: number = new Date().getFullYear();
    if (yearGiven < asset.yearAcquired) {
      return 0;
    }
    if (currentYear === asset.yearAcquired) {
      return asset.initialValue;
    }
    if (asset.yearAcquired <= yearGiven && yearGiven <= currentYear) {
      return (
        asset.initialValue *
        Math.pow(
          asset.currentValue / asset.initialValue,
          (yearGiven - asset.yearAcquired) / (currentYear - asset.yearAcquired),
        )
      );
    }
    return (
      asset.currentValue *
      Math.pow(1 + asset.rate / 100, yearGiven - currentYear)
    );
  }

  private valueSeries(
    asset: Asset,
    startYear: number,
    endYear: number,
  ): YearValue[] {
    const series: YearValue[] = [];
    for (let year: number = startYear; year <= endYear; year++) {
      series.push({ year: year, value: this.valueAtYear(asset, year) });
    }
    return series;
  }
}
