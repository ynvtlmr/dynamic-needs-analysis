import { Component, OnInit } from '@angular/core';
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexLegend,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { Asset } from '../../inputs/asset/asset.component';
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
export class DiversificationComponent implements OnInit {
  public chartOptions: PieChartOptions;

  constructor(private localStorageService: LocalStorageService) {
    // Initialize PieChartOptions with default values
    this.chartOptions = {
      series: [],
      chart: { type: 'pie' },
      responsive: [{ breakpoint: 400, options: { chart: { width: 200 } } }],
      labels: [],
      legend: { position: 'bottom' },
    };
  }

  ngOnInit(): void {
    this.prepareChartData();
  }

  private prepareChartData(): void {
    const assets: Asset[] = this.localStorageService.getItem('assets') || [];
    const totalByType: Record<string, number> = {};

    assets.forEach((asset) => {
      totalByType[asset.type] =
        (totalByType[asset.type] || 0) + asset.currentValue;
    });

    this.chartOptions.series = Object.values(totalByType);
    this.chartOptions.labels = Object.keys(totalByType);
  }
}
