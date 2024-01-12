import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexLegend,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { Asset } from '../../models/asset.model';
import { LocalStorageService } from '../../services/local-storage.service';

export type PieChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: string[];
  legend: ApexLegend;
};

@Component({
  selector: 'app-diversification',
  templateUrl: './diversification.component.html',
  imports: [NgApexchartsModule],
  standalone: true,
})
export class DiversificationComponent implements OnInit, OnDestroy {
  private storageSub!: Subscription;
  public chartOptions: PieChartOptions;

  constructor(private localStorageService: LocalStorageService) {
    this.chartOptions = {
      series: [],
      chart: {
        type: 'pie',
        animations: {
          enabled: false,
        },
      },
      responsive: [{ breakpoint: 400, options: { chart: { width: 200 } } }],
      labels: [],
      legend: { position: 'bottom' },
    };
  }

  ngOnInit(): void {
    this.prepareChartData();

    this.storageSub = this.localStorageService
      .watchStorage()
      .subscribe((key: string): void => {
        if (key === 'assets' || key === 'all') {
          this.prepareChartData();
        }
      });
  }

  ngOnDestroy(): void {
    if (this.storageSub) {
      this.storageSub.unsubscribe();
    }
  }

  private prepareChartData(): void {
    const assets: Asset[] = this.localStorageService.getItem('assets') || [];
    const totalByType: Record<string, number> = {};

    assets.forEach((asset: Asset): void => {
      totalByType[asset.type] =
        (totalByType[asset.type] || 0) + asset.currentValue;
    });

    this.chartOptions.series = Object.values(totalByType);
    this.chartOptions.labels = Object.keys(totalByType);
  }
}
