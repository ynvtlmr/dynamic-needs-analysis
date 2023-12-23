import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexPlotOptions,
  ApexXAxis,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexLegend,
  ApexNonAxisChartSeries,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { Asset } from '../../inputs/asset/asset.component';
import { LocalStorageService } from '../../services/local-storage.service';

export type ChartOptions = {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  title: ApexTitleSubtitle;
  legend: ApexLegend;
  labels: string[];
};

@Component({
  selector: 'app-asset-beneficiary',
  templateUrl: './asset-beneficiary.component.html',
  imports: [NgApexchartsModule],
  standalone: true,
})
export class AssetBeneficiaryComponent implements OnInit, OnDestroy {
  private storageSub!: Subscription;
  public valueChartOptions: ChartOptions;
  public percentageChartOptions: ChartOptions;
  public beneficiaryValuePieChartOptions: ChartOptions;
  public beneficiaryPercentageChartOptions: ChartOptions;

  constructor(private localStorageService: LocalStorageService) {
    // Initialize ChartOptions with default values for all charts
    this.valueChartOptions = this.initializeChartOptions();
    this.percentageChartOptions = this.initializeChartOptions();
    this.beneficiaryValuePieChartOptions = this.initializePieChartOptions();
    this.beneficiaryPercentageChartOptions = this.initializePieChartOptions();
  }

  ngOnInit(): void {
    this.prepareChartData(); // Prepare initial chart data

    // Subscribe to the localStorage changes
    this.storageSub = this.localStorageService
      .watchStorage()
      .subscribe((key) => {
        // If the change is related to assets or something that affects the chart
        if (key === 'assets' || key === 'all') {
          this.prepareChartData(); // Update the chart data
        }
      });
    this.prepareBeneficiaryPercentageChartData();
  }

  ngOnDestroy(): void {
    // Clean up the subscription to prevent memory leaks
    if (this.storageSub) {
      this.storageSub.unsubscribe();
    }
  }

  private initializeChartOptions(): ChartOptions {
    // Ensure all properties are defined for bar charts
    return {
      series: [],
      chart: {
        type: 'bar',
        height: 350,
        animations: {
          enabled: false, // Disable animations
        },
        toolbar: {
          show: false, // Hide the toolbar
        },
      },
      plotOptions: {bar: {horizontal: true}},
      dataLabels: {enabled: false},
      xaxis: {type: 'category', categories: []},
      yaxis: {title: {text: ''}},
      title: {text: ''},
      legend: {position: 'bottom'},
      labels: [], // Initialize labels even though not used for bar charts
    };
  }

  private initializePieChartOptions(): ChartOptions {
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
      dataLabels: {enabled: true},
      title: {text: 'Beneficiary Distribution'},
      legend: {position: 'bottom'},
      labels: [],
      xaxis: {type: 'category', categories: []},
      yaxis: {title: {text: ''}},
      plotOptions: {bar: {horizontal: true}},
    };
  }

  private prepareChartData(): void {
    const assets: Asset[] = this.localStorageService.getItem('assets') || [];
    const beneficiaryNames: string[] = [];
    const valueSeriesData: { name: string; data: number[] }[] = [];
    const percentageSeriesData: { name: string; data: number[] }[] = [];
    const beneficiaryTotals: Record<string, number> = {};

    // pie chart of beneficiaries
    assets.forEach((asset) => {
      asset.beneficiaries.forEach((beneficiary) => {
        if (!beneficiaryTotals[beneficiary.name]) {
          beneficiaryTotals[beneficiary.name] = 0;
        }
        beneficiaryTotals[beneficiary.name] +=
          (beneficiary.allocation / 100) * asset.currentValue;
      });
    });
    this.beneficiaryValuePieChartOptions.series =
      Object.values(beneficiaryTotals);
    this.beneficiaryValuePieChartOptions.labels =
      Object.keys(beneficiaryTotals);

    // Collect all unique beneficiary names and initialize series data
    assets.forEach((asset) => {
      asset.beneficiaries.forEach((beneficiary) => {
        if (!beneficiaryNames.includes(beneficiary.name)) {
          beneficiaryNames.push(beneficiary.name);
          valueSeriesData.push({name: beneficiary.name, data: []});
          percentageSeriesData.push({name: beneficiary.name, data: []});
        }
      });
    });

    // Populate series data for value and percentage charts
    assets.forEach((asset) => {
      valueSeriesData.forEach((series) => {
        const beneficiary = asset.beneficiaries.find(
          (b) => b.name === series.name,
        );
        series.data.push(
          beneficiary ? (beneficiary.allocation / 100) * asset.currentValue : 0,
        );
      });

      percentageSeriesData.forEach((series) => {
        const beneficiary = asset.beneficiaries.find(
          (b) => b.name === series.name,
        );
        series.data.push(beneficiary ? beneficiary.allocation : 0);
      });
    });

    // Extract asset names for the x-axis categories
    const assetNames: string[] = assets.map((asset) => asset.name);

    // Update chart options for value and percentage
    this.valueChartOptions = this.createChartOptions(
      valueSeriesData,
      '$ Value',
      assetNames,
    );
    this.percentageChartOptions = this.createChartOptions(
      percentageSeriesData,
      '% Percentage',
      assetNames,
      true,
    );
  }

  private createChartOptions(
    seriesData: { name: string; data: number[] }[],
    yAxisTitle: string,
    assetNames: string[],
    usePercentage: boolean = false,
  ): ChartOptions {
    // Common chart options
    const chartOptions: ChartOptions = {
      series: seriesData,
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        animations: {
          enabled: false, // Disable animations
        },
        toolbar: {
          show: false, // Hide the toolbar
        },
      },
      plotOptions: {bar: {horizontal: true}},
      dataLabels: {enabled: false},
      xaxis: {
        type: 'category',
        categories: assetNames,
        // Additional configuration for percentage chart
        max: usePercentage ? 100 : undefined, // Set max to 100% for percentage chart
      },
      yaxis: {title: {text: yAxisTitle}},
      title: {
        text: usePercentage
          ? 'Beneficiary Allocation Percentage'
          : 'Asset Value Distribution',
      },
      legend: {position: 'bottom'},
      labels: [], // Initialize labels even though not used for bar charts
    };

    return chartOptions;
  }

  private prepareBeneficiaryPercentageChartData(): void {
    const beneficiaries = this.localStorageService.getItem('beneficiaries') || [];
    const beneficiaryTotals: Record<string, number> = {};

    // Calculate the total allocation for each beneficiary
    beneficiaries.forEach((beneficiary: any) => {
      if (!beneficiaryTotals[beneficiary.name]) {
        beneficiaryTotals[beneficiary.name] = 0;
      }
      beneficiaryTotals[beneficiary.name] += beneficiary.allocation;
    });

    // Set the series and labels for the chart
    this.beneficiaryPercentageChartOptions.series = Object.values(beneficiaryTotals);
    this.beneficiaryPercentageChartOptions.labels = Object.keys(beneficiaryTotals);
  }
}
