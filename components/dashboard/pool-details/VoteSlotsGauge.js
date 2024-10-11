import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  DoughnutController,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, DoughnutController);

const VoteSlotsGauge = ({ voteSlotsData }) => {
  const totalWeight = voteSlotsData.reduce((sum, slot) => sum + slot.vote_weight, 0);

  const data = {
    labels: voteSlotsData.map(slot => slot.account),
    datasets: [
      {
        data: voteSlotsData.map(slot => slot.vote_weight), // Display vote weights
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
        borderColor: [], // Light grey lines
        borderWidth: 0,  // Set border width to 0
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        position: 'bottom',
        align: 'start',
        labels: {
          generateLabels: function(chart) {
            const labels = chart.data.labels.map((label, index) => {
              const slot = voteSlotsData[index];
              return {
                text: ` Trading Fee: ${slot.trading_fee} / Vote Weight: ${slot.vote_weight}`,
                fillStyle: chart.data.datasets[0].backgroundColor[index],
                fontColor: 'white', // Explicitly set the text color to white
                hidden: false,
              };
            });
            return labels;
          },
          color: 'white', // Set the default color to white
          font: {
            size: 14,
            color: 'white', // Ensure the text color is white
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const slot = voteSlotsData[context.dataIndex];
            return ` Trading Fee: ${slot.trading_fee}`;
          },
        },
      },
      datalabels: {
        display: true,
        color: 'white',
        formatter: (value) => {
          return `${value}`;
        },
        anchor: 'end',
        align: 'end',
        offset: 4,
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 4,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 4,
        font: {
          size: 12,
        },
      },
    },
    cutout: '80%',
    layout: {
      padding: {
        left: 50,
        right: 50,
        top: 50,
        bottom: 50,
      },
    },
  };

  const centerText = {
    id: 'centerText',
    beforeDraw: function (chart) {
      const ctx = chart.ctx;
      const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
      const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 20px Arial';
      ctx.fillStyle = 'white';
      ctx.fillText('Total Weight', centerX, centerY - 10);
      ctx.font = 'bold 30px Arial';
      ctx.fillText(totalWeight, centerX, centerY + 20);
      ctx.restore();
    },
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '350px' }}>
      <Doughnut data={data} options={options} plugins={[centerText]} />
    </div>
  );
};

export default VoteSlotsGauge;
