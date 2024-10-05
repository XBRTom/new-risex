import React from 'react';

const Gauge = ({ value, max }) => {
  const percentage = (value / max) * 100;

  return (
    <div className="gauge">
      <svg width="100" height="50" viewBox="0 0 100 50">
        <path d="M10 45 A40 40 0 0 1 90 45" fill="none" stroke="#ccc" strokeWidth="10" />
        <path
          d="M10 45 A40 40 0 0 1 90 45"
          fill="none"
          stroke="#00FF00"
          strokeWidth="10"
          strokeDasharray={`${percentage} ${100 - percentage}`}
        />
      </svg>
      <div className="gauge-text">{value}</div>
    </div>
  );
};

export default Gauge;
