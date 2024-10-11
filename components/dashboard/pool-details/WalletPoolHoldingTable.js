import React from 'react';

const WalletPoolHoldingTable = ({ holdings }) => {
  return (
    <div className="overflow-hidden">
      <table className="min-w-full bg-transparent text-white">
        <thead className="bg-gray-800">
          <tr>
            <th className="py-2 px-3 text-left text-xs font-light">Description</th>
            <th className="py-2 px-3 text-left text-xs font-light">Value</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((holding, index) => (
            <tr key={index} className="hover:bg-gray-700 hover:bg-opacity-25 border-b border-gray-700">
              <td className="py-2 px-3 text-xs">{holding.description}</td>
              <td className="py-2 px-3 text-xs">{holding.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WalletPoolHoldingTable;
