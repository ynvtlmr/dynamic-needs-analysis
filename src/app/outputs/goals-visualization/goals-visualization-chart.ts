import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexDataLabels,
  ApexPlotOptions,
  ApexTooltip,
} from 'ng-apexcharts';
import { formatCurrency } from '@angular/common';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
};

export function getChartOptions(values: number[]): ChartOptions {
  const categories = [
    'Future Liquidity',
    'Preserved Liquidity',
    'Allocated to Goals',
    'Total Goals',
    'Surplus / Shortfall',
  ];

  const positiveColor = '#00E396';
  const negativeColor = '#FF4560';

  const dataWithColors = values.map((value: number, index: number) => {
    return {
      x: categories[index],
      y: value,
      fillColor: value >= 0 ? positiveColor : negativeColor,
    };
  });

  return {
    series: [{ data: dataWithColors }],
    chart: {
      type: 'bar',
      height: 350,
      animations: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: [
        'Future Liquidity',
        'Preserved Liquidity',
        'Allocated to Goals',
        'Total Goals',
        'Surplus / Shortfall',
      ],
    },
    yaxis: {
      title: { text: 'Value ($)' },
      labels: {
        formatter: (value: number) =>
          formatCurrency(value, 'en-US', '$', 'USD', '1.0-2'),
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) =>
          formatCurrency(val, 'en-US', '$', 'USD', '1.2-2'),
        title: {
          formatter: () => '',
        },
      },
    },
    dataLabels: { enabled: false },
    plotOptions: { bar: { horizontal: false } },
  };
}
