import React, { useState } from 'react';

const AmmInfoTable = ({ headers, data }) => {
  const [sortConfig, setSortConfig] = useState(null);

  const onSort = (key) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    if (sortConfig !== null) {
      return [...data].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return data;
  }, [data, sortConfig]);

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
                className={`py-2 px-3 text-left text-xs font-light cursor-pointer ${getClassNamesFor(header.key)}`}
              >
                {header.label}
                {['date', 'type', 'ammOwnership'].includes(header.key) && (
                  <span className={`ml-2 ${getClassNamesFor(header.key) === 'ascending' ? 'chevron-up' : 'chevron-down'}`}></span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, rowIndex) => (
            <tr key={rowIndex} className="bg-transparent hover:bg-gray-700 hover:bg-opacity-25 border-b border-gray-200" style={{ borderBottomWidth: '1px' }}>
              {headers.map((header, colIndex) => (
                <td key={colIndex} className="py-2 px-3 text-xs">{row[header.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AmmInfoTable;
