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
  const categories = [
    'Future Liquidity',
    'Preserved Liquidity',
    'Allocated to Goals',
    'Total Goals',
    'Surplus / Shortfall',
  ];

  const positiveColor = '#00E396'; // Color for positive values
  const negativeColor = '#FF4560'; // Color for negative values

  // Map each value to an object with x as category name and color based on its value
  const dataWithColors = values.map((value, index) => {
    return {
      x: categories[index], // Using category name
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
    yaxis: { title: { text: 'Value ($)' } },
    dataLabels: { enabled: false },
    plotOptions: { bar: { horizontal: false } },
  };
}
