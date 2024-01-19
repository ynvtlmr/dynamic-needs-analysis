import { Component, OnInit } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { Business, Shareholder } from '../../models/business.model';
import { LocalStorageService } from '../../services/local-storage.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
};

@Component({
  selector: 'app-shareholder-ebita-contribution',
  templateUrl: './shareholder-ebita-contribution.component.html',
  imports: [NgApexchartsModule],
  standalone: true,
})
export class ShareholderEbitaContributionComponent implements OnInit {
  public chartOptions!: ChartOptions;
  private businesses: Business[] = [];

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.loadBusinessData();
    this.prepareChartData();
  }

  private loadBusinessData(): void {
    this.businesses =
      this.localStorageService.getItem<Business[]>('businesses') || [];
  }

  private prepareChartData(): void {
    const series: ApexAxisChartSeries = [];

    this.businesses.forEach((business) => {
      business.shareholders.forEach((shareholder) => {
        series.push({
          name: `${business.businessName} - ${shareholder.shareholderName}`,
          data: this.calculateCompoundedEbitaContribution(
            business,
            shareholder,
          ),
        });
      });
    });

    this.chartOptions = {
      series: series,
      chart: {
        type: 'line',
        height: 350,
        animations: {
          enabled: false,
        },
      },
      xaxis: { type: 'category', categories: this.generateYearsArray() },
      yaxis: { title: { text: 'EBITA Contribution ($)' } },
    };
  }

  private calculateCompoundedEbitaContribution(
    business: Business,
    shareholder: Shareholder,
  ): number[] {
    const contributions: number[] = [];
    for (let year = 0; year <= business.term; year++) {
      const compounded =
        shareholder.ebitaContributionPercentage *
        business.ebita *
        Math.pow(1 + business.rate / 100, year);
      contributions.push(compounded);
    }
    return contributions;
  }

  private generateYearsArray(): string[] {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 50 }, (_, i) => (currentYear + i).toString()); // Adjust range as necessary
  }
}
