import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { Business, Shareholder } from '../../models/business.model';
import { LocalStorageService } from '../../services/local-storage.service';
import { formatCurrency } from '@angular/common';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
};

@Component({
  selector: 'app-shareholder-ebitda-contribution',
  templateUrl: './shareholder-ebitda-contribution.component.html',
  imports: [NgApexchartsModule],
  standalone: true,
})
export class ShareholderEbitdaContributionComponent
  implements OnInit, OnDestroy
{
  public chartOptions!: ChartOptions;
  private businesses: Business[] = [];
  private storageSub!: Subscription;

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.storageSub = this.localStorageService
      .watchStorage()
      .subscribe((key: string): void => {
        if (key === 'businesses' || key === 'shareholders' || key === 'all') {
          this.loadBusinessData();
          this.prepareChartData();
        }
      });
    this.loadBusinessData();
    this.prepareChartData();
  }

  ngOnDestroy(): void {
    if (this.storageSub) {
      this.storageSub.unsubscribe();
    }
  }

  private loadBusinessData(): void {
    this.businesses =
      this.localStorageService.getItem<Business[]>('businesses') || [];
  }

  private prepareChartData(): void {
    const series: ApexAxisChartSeries = [];

    this.businesses.forEach((business: Business): void => {
      business.shareholders.forEach((shareholder: Shareholder): void => {
        series.push({
          name: `${business.businessName} - ${shareholder.shareholderName}`,
          data: this.calculateCompoundedEbitdaContribution(
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
        toolbar: {
          show: false,
        },
      },
      xaxis: { type: 'category', categories: this.generateYearsArray() },
      yaxis: {
        title: { text: 'EBITDA Contribution ($)' },
        labels: {
          formatter: (value: number): string =>
            formatCurrency(value, 'en-US', '$', 'USD', '1.0-2'),
        },
      },
    };
  }

  private calculateCompoundedEbitdaContribution(
    business: Business,
    shareholder: Shareholder,
  ): number[] {
    const contributions: number[] = [];
    for (let year: number = 0; year <= business.term; year++) {
      const compounded: number =
        (shareholder.ebitdaContributionPercentage / 100) *
        business.ebitda *
        Math.pow(1 + business.rate / 100, year);
      contributions.push(compounded);
    }
    return contributions;
  }

  private generateYearsArray(): string[] {
    const currentYear: number = new Date().getFullYear();
    return Array.from({ length: 50 }, (_, i: number) =>
      (currentYear + i).toString(),
    );
  }
}
