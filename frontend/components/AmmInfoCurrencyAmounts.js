import React from 'react';
import BarChartCard from './BarChartCard';

const CurrencyAmounts = ({ amountValue, amountCurrency, amount2Value, amount2Currency }) => {
  const convertToXRP = (value, currency) => {
    const numericValue = Number(value);
    if (isNaN(numericValue)) return 0;
    return currency === 'XRP' ? numericValue * 0.000001 : numericValue;
  };

  const amountInXRP = convertToXRP(amountValue, amountCurrency);
  const amount2InXRP = convertToXRP(amount2Value, amount2Currency);

  const barChartData = {
    labels: [amountCurrency, amount2Currency],
    datasets: [
      {
        label: 'Asset Quantity',
        data: [amountInXRP, amount2InXRP],
        backgroundColor: ['#00FF00', '#FF0000'],
      },
    ],
  };

  const barChartOptions = {
    indexAxis: 'y',
    maintainAspectRatio: true,
    aspectRatio: 2,
    scales: {
      x: {
        display: false,
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: 'white',
          font: {
            size: 14,
            weight: '300',
          },
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: 'white',
          boxWidth: 10,
        },
      },
      datalabels: {
        color: 'white',
        anchor: 'end',
        align: 'end',
        formatter: (value, context) => {
          const label = context.chart.data.labels[context.dataIndex];
          return `${value.toFixed(2)} ${label}`;
        },
      },
    },
    layout: {
      padding: {
        top: 20,
        bottom: 20,
        left: 10,
        right: 10,
      },
    },
    elements: {
      bar: {
        borderRadius: 5,
        borderSkipped: false,
        barThickness: 15,
      },
    },
  };

  return (
    <div className="currency-amounts-container">
      <BarChartCard
        title=""
        data={barChartData}
        options={barChartOptions}
      />
    </div>
  );
};

export default CurrencyAmounts;
