import { Component, Input, OnInit } from '@angular/core';
import { ChartOptions } from './chart-options.model';
import { NgApexchartsModule } from 'ng-apexcharts';
import { Asset } from '../../models/asset.model';
import { Beneficiary } from '../../models/beneficiary.model';

@Component({
  selector: 'app-beneficiary-value-pie-chart',
  templateUrl: './beneficiary-value-pie-chart.component.html',
  standalone: true,
  imports: [NgApexchartsModule],
})
export class BeneficiaryValuePieChartComponent implements OnInit {
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
      title: { text: 'Real Beneficiary Distribution' },
      legend: { position: 'bottom' },
      labels: [],
      xaxis: { type: 'category', categories: [] },
      yaxis: { title: { text: '' } },
      plotOptions: { bar: { horizontal: true } },
    };
  }

  private prepareChartData(): void {
    const beneficiaryTotals: Record<string, number> = {};

    this.assets.forEach((asset: Asset): void => {
      const totalAllocation = asset.beneficiaries.reduce(
        (sum, b: Beneficiary) => sum + b.allocation,
        0,
      );

      asset.beneficiaries.forEach((beneficiary: Beneficiary): void => {
        if (!beneficiaryTotals[beneficiary.name]) {
          beneficiaryTotals[beneficiary.name] = 0;
        }
        beneficiaryTotals[beneficiary.name] +=
          (beneficiary.allocation / totalAllocation) * asset.currentValue;
      });
    });

    this.chartOptions = this.initializeChartOptions();
    this.chartOptions.series = Object.values(beneficiaryTotals);
    this.chartOptions.labels = Object.keys(beneficiaryTotals);
  }
}
