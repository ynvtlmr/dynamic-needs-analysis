// beneficiary-value-pie-chart.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { ChartOptions } from './chart-options.model';
import { NgApexchartsModule } from 'ng-apexcharts';
import { Asset } from '../../inputs/asset/asset.component';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-beneficiary-value-pie-chart',
  templateUrl: './beneficiary-value-pie-chart.component.html',
  standalone: true,
  imports: [NgApexchartsModule],
})
export class BeneficiaryValuePieChartComponent implements OnInit {
  @Input() assets: Asset[] = []; // Expect assets to be passed in from parent
  public chartOptions!: ChartOptions;

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.prepareChartData();
  }

  private initializeChartOptions(): ChartOptions {
    // Ensure all properties are defined for pie charts
    return {
      series: [],
      chart: {
        type: 'pie',
        height: 350,
        animations: {
          enabled: false, // Disable animations
        },
        toolbar: {
          show: false, // Hide the toolbar
        },
      },
      dataLabels: { enabled: true },
      title: { text: 'Beneficiary Value Distribution' },
      legend: { position: 'bottom' },
      labels: [],
      xaxis: { type: 'category', categories: [] },
      yaxis: { title: { text: '' } },
      plotOptions: { bar: { horizontal: true } },
    };
  }

  private prepareChartData(): void {
    const beneficiaryTotals: Record<string, number> = {};

    // Calculate the total value for each beneficiary
    this.assets.forEach((asset) => {
      asset.beneficiaries.forEach((beneficiary) => {
        if (!beneficiaryTotals[beneficiary.name]) {
          beneficiaryTotals[beneficiary.name] = 0;
        }
        beneficiaryTotals[beneficiary.name] +=
          (beneficiary.allocation / 100) * asset.currentValue;
      });
    });

    // Set the series and labels for the chart
    this.chartOptions = this.initializeChartOptions();
    this.chartOptions.series = Object.values(beneficiaryTotals);
    this.chartOptions.labels = Object.keys(beneficiaryTotals);
  }
}
