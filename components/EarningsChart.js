import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale
} from 'chart.js';

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale
);

const EarningsChart = ({ data }) => {
  const chartData = {
    labels: data.map(entry => entry.timestamp),
    datasets: [
      {
        label: 'Earnings (USD)',
        data: data.map(entry => entry.earnings),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h3>Earnings (USD)</h3>
      <Line data={chartData} />
    </div>
  );
};

export default EarningsChart;
