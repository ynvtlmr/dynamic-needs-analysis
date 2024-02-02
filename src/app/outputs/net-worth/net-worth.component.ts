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
import { Asset } from '../../models/asset.model';
import { LocalStorageService } from '../../services/local-storage.service';
import { formatCurrency } from '@angular/common';

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
    this.loadAssets();

    this.storageSub = this.localStorageService
      .watchStorage()
      .subscribe((key: string): void => {
        if (key === 'assets' || key === 'all') {
          this.loadAssets();
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
      } as ApexChart,
      xaxis: {
        type: 'numeric',
        labels: {
          formatter: (value: string): string => {
            const valAsNumber: number = parseFloat(value);
            return isNaN(valAsNumber)
              ? value
              : Math.round(valAsNumber).toString().slice(-4);
          },
        },
      } as ApexXAxis,
      yaxis: {
        labels: {
          formatter: (value: number): string =>
            formatCurrency(value, 'en-US', '$', 'USD', '1.0-2'),
        },
      } as ApexYAxis,
      dataLabels: {
        enabled: false,
      } as ApexDataLabels,
      fill: {
        type: 'solid',
      } as ApexFill,
      legend: {
        position: 'top',
        horizontalAlign: 'left',
      } as ApexLegend,
      tooltip: {
        y: {
          formatter: (val: number): string => `$${val.toFixed(0)}`,
        },
      },
    };
  }

  private loadAssets(): void {
    this.assets = this.localStorageService.getItem('assets') || [];
    this.prepareChartData();
  }

  private prepareChartData(): void {
    const startYear: number = Math.min(
      ...this.assets.map((a: Asset) => a.yearAcquired),
    );
    const endYear: number = Math.max(
      ...this.assets.map((a: Asset) => a.yearAcquired + a.term),
    );

    let tickAmount: number = endYear - startYear + 1;
    while (tickAmount > 20) {
      tickAmount = tickAmount / 2;
    }
    if (this.chartOptions && this.chartOptions.xaxis) {
      this.chartOptions.xaxis.min = startYear;
      this.chartOptions.xaxis.max = endYear;
      this.chartOptions.xaxis.tickAmount = tickAmount;
    }

    this.chartOptions.series = this.assets.map((asset: Asset) => ({
      name: asset.name,
      data: this.valueSeries(asset, startYear, endYear).map((yv: YearValue) => [
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
    for (
      let year: number = Math.max(startYear, asset.yearAcquired);
      year <= endYear;
      year++
    ) {
      series.push({ year: year, value: this.valueAtYear(asset, year) });
    }
    return series;
  }
}
