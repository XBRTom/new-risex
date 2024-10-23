import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ArrowUp, ArrowDown, Plus, Minus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AddLiquidityModal from '@/components/AddLiquidityModal';
import WithdrawLiquidityModal from '@/components/WithdrawLiquidityModal';

const PoolsTable = ({ pools = [], itemsPerPage, totalItems, currentPage, onPageChange }) => {
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

  const sortedPools = useMemo(() => {
    let sortablePools = [...pools];
    if (sortConfig.key) {
      sortablePools.sort((a, b) => {
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
        return 0;
      });
    }
    return sortablePools;
  }, [pools, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
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

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <Card className="w-full bg-gradient-to-br from-gray-900 to-black border-gray-800 shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold text-white">Liquidity Pools</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-800">
                {headers.map((header, index) => (
                  <TableHead key={index} className="text-gray-400">
                    <Button
                      variant="ghost"
                      onClick={() => header.sortable && requestSort(header.key)}
                      className="flex items-center space-x-1"
                    >
                      {header.label}
                      {header.sortable && <ArrowUpDown className="h-4 w-4" />}
                    </Button>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedPools.map((pool, index) => (
                <TableRow
                  key={index}
                  className="border-b border-gray-800 hover:bg-gray-800/50"
                  onClick={() => window.location.href = `/dashboard/pool/${pool.account}`}
                >
                  <TableCell className="font-medium text-white">{pool.asset_currency} / {pool.asset2_currency}</TableCell>
                  <TableCell className="text-white">{(pool.tradingFee / 1000).toFixed(2)}%</TableCell>
                  <TableCell className="text-white">{formatCurrency(parseFloat(pool.totalValueLocked || 0))}</TableCell>
                  <TableCell className="text-white">{formatCurrency(parseFloat(pool.totalPoolVolume || 0))}</TableCell>
                  <TableCell className="text-white">{(pool.baseVolume ?? 0).toFixed(2)} {pool.asset_currency}</TableCell>
                  <TableCell className="text-white">{(pool.counterVolume ?? 0).toFixed(2)} {pool.asset2_currency}</TableCell>
                  <TableCell className="text-white">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="flex items-center space-x-1">
                            {parseFloat(pool.relativeAPR || 0).toFixed(2)}%
                            {parseFloat(pool.relativeAPR || 0) > 0 ? <ArrowUp className="h-4 w-4 text-green-500" /> : 
                             parseFloat(pool.relativeAPR || 0) < 0 ? <ArrowDown className="h-4 w-4 text-red-500" /> : null}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Annual Percentage Rate</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell className="text-white">
                    <Button
                      variant="outline"
                      size="sm"
                      className="mr-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        openAddLiquidityModal(pool);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        openWithdrawLiquidityModal(pool);
                      }}
                    >
                      <Minus className="h-4 w-4 mr-1" /> Withdraw
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-400">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
      {isAddLiquidityModalOpen && selectedPool && (
        <AddLiquidityModal
          pool={selectedPool}
          closeModal={closeAddLiquidityModal}
        />
      )}
      {isWithdrawLiquidityModalOpen && selectedPool && (
        <WithdrawLiquidityModal
          pool={selectedPool}
          closeModal={closeWithdrawLiquidityModal}
        />
      )}
    </Card>
  );
};

export default PoolsTable;