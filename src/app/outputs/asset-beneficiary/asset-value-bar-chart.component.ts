// asset-value-bar-chart.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { ChartOptions } from './chart-options.model';
import { NgApexchartsModule } from 'ng-apexcharts';
import { Asset } from '../../models/asset.model';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-asset-value-bar-chart',
  templateUrl: './asset-value-bar-chart.component.html',
  standalone: true,
  imports: [NgApexchartsModule],
})
export class AssetValueBarChartComponent implements OnInit {
  @Input() assets: Asset[] = []; // Expect assets to be passed in from parent
  public chartOptions!: ChartOptions;

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.prepareChartData();
  }

  private initializeChartOptions(): ChartOptions {
    // Ensure all properties are defined for bar charts
    return {
      series: [],
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        animations: {
          enabled: false, // Disable animations
        },
        toolbar: {
          show: false, // Hide the toolbar
        },
      },
      plotOptions: { bar: { horizontal: true } },
      dataLabels: { enabled: false },
      xaxis: { type: 'category', categories: [] },
      yaxis: { title: { text: 'Asset Value' } },
      title: { text: 'Asset Value Distribution' },
      legend: { position: 'bottom' },
      labels: [], // Initialize labels even though not used for bar charts
    };
  }

  private prepareChartData(): void {
    const beneficiaryNames: string[] = [];
    const seriesData: { name: string; data: number[] }[] = [];

    // Collect all unique beneficiary names and initialize series data
    this.assets.forEach((asset) => {
      asset.beneficiaries.forEach((beneficiary) => {
        if (!beneficiaryNames.includes(beneficiary.name)) {
          beneficiaryNames.push(beneficiary.name);
          seriesData.push({ name: beneficiary.name, data: [] });
        }
      });
    });

    // Populate series data for value chart
    this.assets.forEach((asset) => {
      seriesData.forEach((series) => {
        const beneficiary = asset.beneficiaries.find(
          (b) => b.name === series.name,
        );
        series.data.push(
          beneficiary ? (beneficiary.allocation / 100) * asset.currentValue : 0,
        );
      });
    });

    // Extract asset names for the x-axis categories
    const assetNames: string[] = this.assets.map((asset) => asset.name);

    // Update chart options for value
    this.chartOptions = this.initializeChartOptions();
    this.chartOptions.series = seriesData;
    this.chartOptions.xaxis = {
      ...this.chartOptions.xaxis,
      categories: assetNames,
    };
  }
}
