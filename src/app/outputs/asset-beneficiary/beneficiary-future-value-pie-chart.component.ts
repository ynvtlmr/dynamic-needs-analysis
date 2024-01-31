import { Component, Input, OnInit } from '@angular/core';
import { ChartOptions } from './chart-options.model';
import { NgApexchartsModule } from 'ng-apexcharts';
import { Asset } from '../../models/asset.model';
import { Beneficiary } from '../../models/beneficiary.model';

@Component({
  selector: 'app-beneficiary-future-value-pie-chart',
  templateUrl: './beneficiary-future-value-pie-chart.component.html',
  standalone: true,
  imports: [NgApexchartsModule],
})
export class BeneficiaryFutureValuePieChartComponent implements OnInit {
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
    const beneficiaryTotals: Record<string, number> = {};

    this.assets.forEach((asset: Asset) => {
      const futureValue = this.calculateFutureValue(asset);
      asset.beneficiaries.forEach((beneficiary: Beneficiary) => {
        if (!beneficiaryTotals[beneficiary.name]) {
          beneficiaryTotals[beneficiary.name] = 0;
        }
        beneficiaryTotals[beneficiary.name] +=
          (beneficiary.allocation / 100) * futureValue;
      });
    });

    this.chartOptions = this.initializeChartOptions();
    this.chartOptions.series = Object.values(beneficiaryTotals);
    this.chartOptions.labels = Object.keys(beneficiaryTotals);
  }

  private initializeChartOptions(): ChartOptions {
    return {
      series: [],
      chart: {
        type: 'pie',
        height: 350,
        animations: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: true,
      },
      title: {
        text: 'Beneficiary Future Value Distribution',
        align: 'center',
      },
      legend: {
        position: 'bottom',
      },
      labels: [],
      xaxis: {
        type: 'category',
        categories: [],
      },
      yaxis: {
        title: {
          text: '',
        },
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
    };
  }
}
