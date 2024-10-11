import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const GlobalPoolMetricsChart = ({ metrics }) => {
  const dates = metrics.map(metric => new Date(metric.date).toLocaleDateString());
  const totalValueLocked = metrics.map(metric => parseFloat(metric.totalValueLocked));
  const totalPoolVolume = metrics.map(metric => parseFloat(metric.totalPoolVolume));
  const poolYield = metrics.map(metric => parseFloat(metric.poolYield));
  const relativeAPR = metrics.map(metric => parseFloat(metric.relativeAPR));
  const feesGenerated = metrics.map(metric => parseFloat(metric.feesGenerated)); // Added for fees generated

  const data = {
    labels: dates,
    datasets: [
      {
        type: 'bar',
        label: 'Total Value Locked (XRP)',
        data: totalValueLocked,
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        yAxisID: 'y1',
      },
      {
        type: 'bar',
        label: 'Total Pool Volume (XRP)',
        data: totalPoolVolume,
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        yAxisID: 'y1',
      },
      {
        type: 'bar', // Added for fees generated
        label: 'Fees Generated (XRP)',
        data: feesGenerated,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        yAxisID: 'y1',
      },
      {
        type: 'line',
        label: 'Pool Yield (%)',
        data: poolYield,
        borderColor: 'rgba(255, 159, 64, 1)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        yAxisID: 'y2',
      },
      {
        type: 'line',
        label: 'Relative APR (%)',
        data: relativeAPR,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        yAxisID: 'y2',
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y1: {
        type: 'linear',
        position: 'left',
        ticks: {
          beginAtZero: true,
          callback: function (value) {
            return `${value} XRP`;
          },
        },
      },
      y2: {
        type: 'linear',
        position: 'right',
        ticks: {
          beginAtZero: true,
          callback: function (value) {
            return `${value}%`;
          },
        },
        grid: {
          drawOnChartArea: false, // only want the grid lines for one axis to show up
        },
      },
    },
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-light text-white mb-4">Pool Metrics (Current Month)</h3>
      <Bar data={data} options={options} />
    </div>
  );
};

export default GlobalPoolMetricsChart;
