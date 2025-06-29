import React from 'react';

const Filters = ({ handleSort }) => {
  return (
    <div className="flex space-x-2 mb-4">
      <button onClick={() => handleSort('Asset', 'asc')} className="p-2 text-white">Pair Asc</button>
      <button onClick={() => handleSort('Asset', 'desc')} className="p-2 text-white">Pair Desc</button>
      <button onClick={() => handleSort('TradingFee', 'asc')} className="p-2 text-white">Fee Asc</button>
      <button onClick={() => handleSort('TradingFee', 'desc')} className="p-2 text-white">Fee Desc</button>
      <button onClick={() => handleSort('Balance', 'asc')} className="p-2 text-white">Liquidity Asc</button>
      <button onClick={() => handleSort('Balance', 'desc')} className="p-2 text-white">Liquidity Desc</button>
    </div>
  );
};

export default Filters;
