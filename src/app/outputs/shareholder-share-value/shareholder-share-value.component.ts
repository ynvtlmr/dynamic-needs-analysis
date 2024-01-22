import { Component, OnDestroy, OnInit } from '@angular/core';
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

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
};

@Component({
  selector: 'app-shareholder-share-value',
  templateUrl: './shareholder-share-value.component.html',
  imports: [NgApexchartsModule],
  standalone: true,
})
export class ShareholderShareValueComponent implements OnInit, OnDestroy {
  public chartOptions!: ChartOptions;
  private businesses: Business[] = [];
  storageSub!: Subscription;

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.storageSub = this.localStorageService
      .watchStorage()
      .subscribe((key: string) => {
        if (key === 'businesses' || key === 'shareholders' || key === 'all') {
          this.loadBusinessData();
          this.prepareChartData();
        }
      });
    this.loadBusinessData();
    this.prepareChartData();
  }

  ngOnDestroy() {
    if (this.storageSub) {
      this.storageSub.unsubscribe();
    }
  }

  private loadBusinessData(): void {
    this.businesses =
      this.localStorageService.getItem<Business[]>('businesses') ?? [];
    // Filter businesses where the client is a shareholder (implement as needed)
  }

  private prepareChartData(): void {
    const series: ApexAxisChartSeries = [];

    this.businesses.forEach((business) => {
      business.shareholders.forEach((shareholder) => {
        series.push({
          name: `${business.businessName} - ${shareholder.shareholderName}`,
          data: this.calculateShareValueOverTime(business, shareholder),
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
      yaxis: { title: { text: 'Share Value ($)' } },
    };
  }

  private calculateShareValueOverTime(
    business: Business,
    shareholder: Shareholder,
  ): number[] {
    const values: number[] = [];
    for (let year = 0; year <= business.term; year++) {
      const value =
        (shareholder.sharePercentage / 100) *
        business.valuation *
        Math.pow(1 + business.rate / 100, year);
      values.push(value);
    }
    return values;
  }

  private generateYearsArray(): string[] {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 50 }, (_, i) => (currentYear + i).toString()); // Adjust range as necessary
  }
}
