import React from 'react';
import { Bar } from 'react-chartjs-2';

const HistoricalDataChart = ({ data }) => {
  const chartData = {
    labels: data.map(entry => entry.timestamp),
    datasets: [
      {
        label: 'LP Tokens',
        data: data.map(entry => entry.tokenHoldings),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Earnings (USD)',
        data: data.map(entry => entry.earnings),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
      {
        label: 'Fees Earned',
        data: data.map(entry => entry.shareOfFees),
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
      },
    ],
  };

  return (
    <div>
      <Bar data={chartData} />
    </div>
  );
};

export default HistoricalDataChart;
