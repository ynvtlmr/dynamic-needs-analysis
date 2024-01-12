import { Component, Input, OnInit } from '@angular/core';
import { ChartOptions } from './chart-options.model';
import { NgApexchartsModule } from 'ng-apexcharts';
import { Asset } from '../../models/asset.model';
import { Beneficiary } from '../../models/beneficiary.model';

@Component({
  selector: 'app-asset-percentage-bar-chart',
  templateUrl: './asset-percentage-bar-chart.component.html',
  standalone: true,
  imports: [NgApexchartsModule],
})
export class AssetPercentageBarChartComponent implements OnInit {
  @Input() assets: Asset[] = [];
  public chartOptions!: ChartOptions;

  constructor() {}

  ngOnInit(): void {
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
      yaxis: { title: { text: 'Percentage' }, max: 100 },
      title: { text: 'Beneficiary Allocation Percentage' },
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
      seriesData.forEach((series: { name: string; data: number[] }): void => {
        const beneficiary: Beneficiary | undefined = asset.beneficiaries.find(
          (b: Beneficiary): boolean => b.name === series.name,
        );
        series.data.push(beneficiary ? beneficiary.allocation : 0);
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
