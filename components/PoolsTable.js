import React, { useState } from 'react';
import AddLiquidityModal from '@/components/AddLiquidityModal';
import WithdrawLiquidityModal from '@/components/WithdrawLiquidityModal';

import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
        aValue = parseFloat(a.totalValueLocked || 0);
        bValue = parseFloat(b.totalValueLocked || 0);
      } else if (sortConfig.key === 'TotalVolume') {
        aValue = parseFloat(a.totalPoolVolume || 0);
        bValue = parseFloat(b.totalPoolVolume || 0);
      } else if (sortConfig.key === 'Pair') {
        aValue = `${a.asset_currency} / ${a.asset2_currency}`;
        bValue = `${b.asset_currency} / ${b.asset2_currency}`;
      } else if (sortConfig.key === 'baseVolume' || sortConfig.key === 'counterVolume') {
        aValue = parseFloat(a[sortConfig.key]);
        bValue = parseFloat(b[sortConfig.key]);
      } else if (sortConfig.key === 'InstantAPR') {
        aValue = parseFloat(a.relativeAPR || 0);
        bValue = parseFloat(b.relativeAPR || 0);
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
      return sortConfig.direction === 'asc' ? <ChevronUp /> : <ChevronDown />;
    }
    return <ChevronsUpDown />;
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
    <div className="">
      <Table className="">
        <TableHeader>
          <TableRow>
            {headers.map((header, index) => (
              <TableHead
                key={index}
                className="cursor-pointer"
                onClick={() => header.sortable && requestSort(header.key)}
              >
                <div className="w-full flex justify-between">
                  {header.label} {header.sortable && getSortIcon(header.key)}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-white">
          {sortedPools.map((pool, index) => {
            return (
              <TableRow
                key={index}
                className="cursor-pointer"
                onClick={() => window.location.href = `/pool/${pool.account}`}
              >
                <TableCell className="">{pool.asset_currency} / {pool.asset2_currency}</TableCell>
                <TableCell className="">{(pool.tradingFee / 1000).toFixed(2)}%</TableCell>
                <TableCell className="">{parseFloat(pool.totalValueLocked || 0).toFixed(2)} XRP</TableCell>
                <TableCell className="">{parseFloat(pool.totalPoolVolume || 0).toFixed(2)} XRP</TableCell>
                <TableCell className="">{(pool.baseVolume ?? 0).toFixed(2)} {pool.asset_currency}</TableCell>
                <TableCell className="">{(pool.counterVolume ?? 0).toFixed(2)}</TableCell>
                <TableCell className="">{parseFloat(pool.relativeAPR || 0).toFixed(4)}%</TableCell> 
                <TableCell className="">
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
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
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
