import React from 'react';

const Table = ({ headers, data, onSort, sortConfig }) => {
  const getClassNamesFor = (name) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };

  return (
    <div className="overflow-hidden">
      <table className="min-w-full text-white">
        <thead className="bg-transparent">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                onClick={() => onSort(header.key)}
                className={`py-1 px-3 text-left text-xs font-light cursor-pointer ${getClassNamesFor(header.key)}`}
              >
                {header.label}
                {['date', 'type', 'ammOwnership'].includes(header.key) && (
                  <span className={`ml-2 ${getClassNamesFor(header.key) === 'ascending' ? 'chevron-up' : 'chevron-down'}`}></span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white">
          {data.map((row, index) => (
            <tr key={index} className="bg-transparent hover:bg-gray-700 hover:bg-opacity-25">
              {Object.values(row).map((cell, cellIndex) => (
                <td key={cellIndex} className="py-1 px-3 text-xs">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
