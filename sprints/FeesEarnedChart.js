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

const FeesEarnedChart = ({ data }) => {
  const chartData = {
    labels: data.map(entry => entry.timestamp),
    datasets: [
      {
        label: 'Fees Earned',
        data: data.map(entry => entry.shareOfFees),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h3>Fees Earned</h3>
      <Line data={chartData} />
    </div>
  );
};

export default FeesEarnedChart;
