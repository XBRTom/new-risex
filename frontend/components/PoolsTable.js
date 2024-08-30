import React, { useState } from 'react';
import AddLiquidityModal from '@/components/AddLiquidityModal';
import WithdrawLiquidityModal from '@/components/WithdrawLiquidityModal';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

const PoolsTable = ({ pools = [] }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [isAddLiquidityModalOpen, setIsAddLiquidityModalOpen] = useState(false);
  const [isWithdrawLiquidityModalOpen, setIsWithdrawLiquidityModalOpen] = useState(false);
  const [selectedPool, setSelectedPool] = useState(null);

  const headers = [
    { label: 'Pools', key: 'Pair', sortable: true },
    { label: 'Trading Fee', key: 'TradingFee', sortable: true },
    { label: 'Liquidity', key: 'LiquidityXRP', sortable: true },
    { label: '24h Volume', key: 'TotalVolume', sortable: true },
    { label: '24h Base Volume', key: 'baseVolume', sortable: true },
    { label: '24h Counter Volume', key: 'counterVolume', sortable: true },
    { label: 'Instant APR', key: 'InstantAPR', sortable: true },
    { label: 'Actions', key: 'Actions', sortable: false }
  ];

  // const convertDropsToXRP = (drops) => (drops / 1_000_000).toFixed(2);

  const sortedPools = [...pools].sort((a, b) => {
    if (sortConfig.key) {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      
      if (sortConfig.key === 'LiquidityXRP') {
        aValue = parseFloat(a.latestMetrics.totalValueLocked || 0);
        bValue = parseFloat(b.latestMetrics.totalValueLocked || 0);
      } else if (sortConfig.key === 'TotalVolume') {
        aValue = parseFloat(a.latestMetrics.totalPoolVolume || 0);
        bValue = parseFloat(b.latestMetrics.totalPoolVolume || 0);
      } else if (sortConfig.key === 'Pair') {
        aValue = `${a.asset_currency} / ${a.asset2_currency}`;
        bValue = `${b.asset_currency} / ${b.asset2_currency}`;
      } else if (sortConfig.key === 'baseVolume' || sortConfig.key === 'counterVolume') {
        aValue = parseFloat(a[sortConfig.key]);
        bValue = parseFloat(b[sortConfig.key]);
      } else if (sortConfig.key === 'InstantAPR') {
        aValue = parseFloat(a.latestMetrics.relativeAPR || 0);
        bValue = parseFloat(b.latestMetrics.relativeAPR || 0);
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />;
    }
    return <FaSort />;
  };

  const openAddLiquidityModal = (pool) => {
    setSelectedPool(pool);
    setIsAddLiquidityModalOpen(true);
  };

  const closeAddLiquidityModal = () => {
    setIsAddLiquidityModalOpen(false);
    setSelectedPool(null);
  };

  const openWithdrawLiquidityModal = (pool) => {
    setSelectedPool(pool);
    setIsWithdrawLiquidityModalOpen(true);
  };

  const closeWithdrawLiquidityModal = () => {
    setIsWithdrawLiquidityModalOpen(false);
    setSelectedPool(null);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-transparent">
        <thead className="bg-transparent">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="py-1 px-3 text-left text-xs font-light cursor-pointer"
                onClick={() => header.sortable && requestSort(header.key)}
              >
                {header.label} {header.sortable && getSortIcon(header.key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white">
          {sortedPools.map((pool, index) => {
    // console.log('Pool account:', pool); // Log the account value here
    return (
      <tr
        key={index}
        className="bg-transparent hover:bg-gray-700 hover:bg-opacity-25 cursor-pointer"
        onClick={() => window.location.href = `/pool/${pool.account}`}
      >
        <td className="py-1 px-3 text-xs">{pool.asset_currency} / {pool.asset2_currency}</td>
        <td className="py-1 px-3 text-xs">{(pool.tradingFee / 1000).toFixed(2)}%</td>
        <td className="py-1 px-3 text-xs">{parseFloat(pool.latestMetrics?.totalValueLocked || 0).toFixed(2)} XRP</td>
        <td className="py-1 px-3 text-xs">{parseFloat(pool.latestMetrics?.totalPoolVolume || 0).toFixed(2)} XRP</td>
        {/* <td className="py-1 px-3 text-xs">{(pool.balance / exchangeRates[pool.asset_currency] || 1).toFixed(2)} USD</td> */}
        <td className="py-1 px-3 text-xs">{(pool.baseVolume).toFixed(2)} {pool.asset_currency}</td>
        {/* <td className="py-1 px-3 text-xs">{(pool.counterVolume).toFixed(2)} {pool.asset2_currency}</td> */}
        <td className="py-1 px-3 text-xs">{(pool.counterVolume).toFixed(2)}</td>
        <td className="py-1 px-3 text-xs">{parseFloat(pool.latestMetrics?.relativeAPR || 0).toFixed(4)}%</td> 
        <td className="py-1 px-3 text-xs">
          <span
            className="text-green-500 cursor-pointer mr-2"
            onClick={(e) => { e.stopPropagation(); openAddLiquidityModal(pool); }}
          >
            Add Liquidity
          </span>
          <span
            className="text-red-500 cursor-pointer"
            onClick={(e) => { e.stopPropagation(); openWithdrawLiquidityModal(pool); }}
          >
            Withdraw
          </span>
        </td>
      </tr>
    );
  })}
</tbody>
      </table>
      {isAddLiquidityModalOpen && (
        <AddLiquidityModal
          pool={selectedPool}
          closeModal={closeAddLiquidityModal}
        />
      )}
      {isWithdrawLiquidityModalOpen && (
        <WithdrawLiquidityModal
          pool={selectedPool}
          closeModal={closeWithdrawLiquidityModal}
        />
      )}
    </div>
  );
};

export default PoolsTable;
