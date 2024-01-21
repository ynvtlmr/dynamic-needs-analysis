import { Component, Input, OnInit } from '@angular/core';
import { ChartOptions } from './chart-options.model';
import { NgApexchartsModule } from 'ng-apexcharts';
import { Beneficiary } from '../../models/beneficiary.model';

@Component({
  selector: 'app-beneficiary-percentage-pie-chart',
  templateUrl: './beneficiary-percentage-pie-chart.component.html',
  standalone: true,
  imports: [NgApexchartsModule],
})
export class BeneficiaryPercentagePieChartComponent implements OnInit {
  @Input() beneficiaries: Beneficiary[] = [];
  public chartOptions!: ChartOptions;

  ngOnInit(): void {
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
      dataLabels: { enabled: true },
      title: { text: 'Desired Beneficiary Allocation' },
      legend: { position: 'bottom' },
      labels: [],
      xaxis: { type: 'category', categories: [] },
      yaxis: { title: { text: '' } },
      plotOptions: { bar: { horizontal: true } },
    };
  }

  private prepareChartData(): void {
    const beneficiaryTotals: Record<string, number> = {};

    this.beneficiaries.forEach((beneficiary: Beneficiary): void => {
      if (!beneficiaryTotals[beneficiary.name]) {
        beneficiaryTotals[beneficiary.name] = 0;
      }
      beneficiaryTotals[beneficiary.name] += beneficiary.allocation;
    });

    this.chartOptions = this.initializeChartOptions();
    this.chartOptions.series = Object.values(beneficiaryTotals);
    this.chartOptions.labels = Object.keys(beneficiaryTotals);
  }
}
