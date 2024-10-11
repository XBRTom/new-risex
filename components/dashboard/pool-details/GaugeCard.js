import React from 'react';

const GaugeCard = ({ title, children }) => {
  return (
    <div className="bg-black p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-light text-white mb-4">{title}</h3>
      {children}
    </div>
  );
};

export default GaugeCard;
