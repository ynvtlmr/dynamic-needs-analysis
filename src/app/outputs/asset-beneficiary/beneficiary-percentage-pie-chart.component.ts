// beneficiary-percentage-pie-chart.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { ChartOptions } from './chart-options.model';
import { NgApexchartsModule } from 'ng-apexcharts';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-beneficiary-percentage-pie-chart',
  templateUrl: './beneficiary-percentage-pie-chart.component.html',
  standalone: true,
  imports: [NgApexchartsModule],
})
export class BeneficiaryPercentagePieChartComponent implements OnInit {
  @Input() beneficiaries: any[] = []; // Expect beneficiaries to be passed in from parent
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
      title: { text: 'Beneficiary Percentage Distribution' },
      legend: { position: 'bottom' },
      labels: [],
      xaxis: { type: 'category', categories: [] },
      yaxis: { title: { text: '' } },
      plotOptions: { bar: { horizontal: true } },
    };
  }

  private prepareChartData(): void {
    const beneficiaryTotals: Record<string, number> = {};

    // Calculate the total allocation percentage for each beneficiary
    this.beneficiaries.forEach((beneficiary) => {
      if (!beneficiaryTotals[beneficiary.name]) {
        beneficiaryTotals[beneficiary.name] = 0;
      }
      beneficiaryTotals[beneficiary.name] += beneficiary.allocation;
    });

    // Set the series and labels for the chart
    this.chartOptions = this.initializeChartOptions();
    this.chartOptions.series = Object.values(beneficiaryTotals);
    this.chartOptions.labels = Object.keys(beneficiaryTotals);
  }
}
