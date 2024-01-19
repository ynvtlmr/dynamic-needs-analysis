import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexDataLabels,
  ApexPlotOptions,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
};

export function getChartOptions(values: number[]): ChartOptions {
  return {
    series: [{ data: values }],
    chart: { type: 'bar', height: 350, animations: { enabled: false } },
    xaxis: {
      categories: [
        'Future Liquidity',
        'Preserved Liquidity',
        'Allocated to Goals',
        'Total Goals',
        'Surplus / Shortfall',
      ],
    },
    yaxis: { title: { text: 'Value ($)' } },
    dataLabels: { enabled: false },
    plotOptions: { bar: { horizontal: false } },
  };
}
