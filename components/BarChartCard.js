import React from 'react';
import BarChart from './BarChart';

const BarChartCard = ({ title, data, options }) => {
  return (
    <div className="bg-black rounded-lg shadow-lg bar-chart-card">
      <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
      {data ? <BarChart data={data} options={options} /> : <p className="text-white text-common">No data available</p>}
    </div>
  );
};

export default BarChartCard;
