import { Component, Input, OnInit } from '@angular/core';
import { ChartOptions } from './chart-options.model';
import { NgApexchartsModule } from 'ng-apexcharts';
import { Asset } from '../../models/asset.model';
import { Beneficiary } from '../../models/beneficiary.model';

@Component({
  selector: 'app-beneficiary-future-value-bar-chart',
  templateUrl: './beneficiary-future-value-bar-chart.component.html',
  standalone: true,
  imports: [NgApexchartsModule],
})
export class BeneficiaryFutureValueBarChartComponent implements OnInit {
  @Input() assets: Asset[] = [];
  public chartOptions!: ChartOptions;

  ngOnInit(): void {
    this.prepareChartData();
  }
  public refreshChart(): void {
    this.prepareChartData();
  }

  private calculateFutureValue(asset: Asset): number {
    return asset.currentValue * Math.pow(1 + asset.rate / 100, asset.term);
  }

  private prepareChartData(): void {
    const beneficiaryNames: string[] = [];
    const seriesData: { name: string; data: number[] }[] = [];

    this.assets.forEach((asset: Asset) => {
      asset.beneficiaries.forEach((beneficiary: Beneficiary) => {
        if (!beneficiaryNames.includes(beneficiary.name)) {
          beneficiaryNames.push(beneficiary.name);
          seriesData.push({ name: beneficiary.name, data: [] });
        }
      });
    });

    this.assets.forEach((asset: Asset) => {
      const futureValue = this.calculateFutureValue(asset);
      seriesData.forEach((series) => {
        const beneficiary = asset.beneficiaries.find(
          (b) => b.name === series.name,
        );
        series.data.push(
          beneficiary ? (beneficiary.allocation / 100) * futureValue : 0,
        );
      });
    });

    const assetNames: string[] = this.assets.map((asset) => asset.name);

    this.chartOptions = this.initializeChartOptions();
    this.chartOptions.series = seriesData;
    this.chartOptions.xaxis = {
      ...this.chartOptions.xaxis,
      categories: assetNames,
    };
  }
  // In BeneficiaryFutureValueBarChartComponent

  private initializeChartOptions(): ChartOptions {
    return {
      series: [],
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        animations: {
          enabled: true,
        },
        toolbar: {
          show: true,
        },
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        type: 'category',
        categories: [],
      },
      yaxis: {
        title: {
          text: 'Future Value ($)',
        },
      },
      title: {
        text: 'Beneficiary Future Value Distribution',
        align: 'center',
      },
      legend: {
        position: 'bottom',
      },
      labels: [],
    };
  }
}
