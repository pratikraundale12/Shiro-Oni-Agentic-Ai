import PropTypes from 'prop-types';
import React from 'react';
import Chart from 'react-apexcharts';

export const FlowMetrics = ({ flowMetricsDataDynamic = [] }) => {
  const flowMetricsData = [
    {
      name: 'Flow Files Queued',
      data: flowMetricsDataDynamic,
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
    xaxis: {
      type: 'category',
      categories: ['Flow Files Queued', 'Flow Files In', 'Flow Files Out'],
    },
    yaxis: {
      opposite: false,
      labels: {
        minWidth: 50,
      },
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

FlowMetrics.propTypes = {
  flowMetricsDataDynamic: PropTypes.array,
};
