import React from 'react';
import Chart from 'react-apexcharts';

export const FlowMetricsChart = () => {
  const flowMetricsData = [
    {
      name: 'Flow Files Qued',
      data: [10, 15, 8],
    },
  ];

  const series = flowMetricsData;

  const options = {
    chart: {
      type: 'area',
      height: 350,
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'straight',
    },
    title: {
      text: 'Flow Metrics',
      align: 'center',
    },
    xaxis: {
      type: 'category',
      categories: ['Flow Files Qued', 'Flow Files In', 'Flow Files Out'],
    },
    yaxis: {
      opposite: false,
    },
    legend: {
      horizontalAlign: 'left',
    },
    colors: ['#F44336'],
  };

  return (
    <div id="chart" className="w-100">
      <Chart options={options} series={series} type="area" height={350} />
    </div>
  );
};
