import { Component, Input, OnInit } from '@angular/core';
import { ChartOptions } from './chart-options.model';
import { NgApexchartsModule } from 'ng-apexcharts';
import { Asset } from '../../models/asset.model';
import { Beneficiary } from '../../models/beneficiary.model';

@Component({
  selector: 'app-asset-value-bar-chart',
  templateUrl: './asset-value-bar-chart.component.html',
  standalone: true,
  imports: [NgApexchartsModule],
})
export class AssetValueBarChartComponent implements OnInit {
  @Input() assets: Asset[] = [];
  public chartOptions!: ChartOptions;

  ngOnInit(): void {
    this.prepareChartData();
  }
  public refreshChart(): void {
    this.prepareChartData();
  }
  private initializeChartOptions(): ChartOptions {
    return {
      series: [],
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        animations: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      plotOptions: { bar: { horizontal: true } },
      dataLabels: { enabled: false },
      xaxis: { type: 'category', categories: [] },
      yaxis: {
        title: { text: 'Asset Value' },
      },
      tooltip: {
        y: {
          formatter: (val: number): string => {
            return `$${val.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`;
          },
        },
      },
      title: { text: 'Asset Value Distribution' },
      legend: { position: 'bottom' },
      labels: [],
    };
  }

  private prepareChartData(): void {
    const beneficiaryNames: string[] = [];
    const seriesData: { name: string; data: number[] }[] = [];

    this.assets.forEach((asset: Asset): void => {
      asset.beneficiaries.forEach((beneficiary: Beneficiary): void => {
        if (!beneficiaryNames.includes(beneficiary.name)) {
          beneficiaryNames.push(beneficiary.name);
          seriesData.push({ name: beneficiary.name, data: [] });
        }
      });
    });

    this.assets.forEach((asset: Asset): void => {
      const totalAllocation = asset.beneficiaries.reduce(
        (sum, b: Beneficiary) => sum + b.allocation,
        0,
      );

      seriesData.forEach((series: { name: string; data: number[] }): void => {
        const beneficiary: Beneficiary | undefined = asset.beneficiaries.find(
          (b: Beneficiary): boolean => b.name === series.name,
        );
        series.data.push(
          beneficiary
            ? (beneficiary.allocation / totalAllocation) * asset.currentValue
            : 0,
        );
      });
    });

    const assetNames: string[] = this.assets.map((asset: Asset) => asset.name);

    this.chartOptions = this.initializeChartOptions();
    this.chartOptions.series = seriesData;
    this.chartOptions.xaxis = {
      ...this.chartOptions.xaxis,
      categories: assetNames,
    };
  }
}
