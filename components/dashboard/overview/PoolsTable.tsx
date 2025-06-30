import React, { useState, useMemo, memo, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ArrowUp, ArrowDown, Plus, Minus, ChevronRight, ChevronLeft, AlertCircle } from 'lucide-react';
import Loader from '@/components/ui/loader';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import AddLiquidityModal from '@/components/dashboard/global/AddLiquidityModal';
import WithdrawLiquidityModal from '@/components/dashboard/global/WithdrawLiquidityModal';
import { useMediaQuery } from '@/hooks/use-media-query';

interface Pool {
  account: string;
  asset_currency: string;
  asset2_currency: string;
  tradingFee: number;
  totalValueLocked: string | number;
  totalPoolVolume: string | number;
  baseVolume?: number;
  counterVolume?: number;
  relativeAPR?: string | number;
}

interface PoolsTableProps {
  pools: Pool[];
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
  error?: string | null;
}

const PoolsTable = memo(function PoolsTable({
  pools = [],
  itemsPerPage,
  totalItems,
  currentPage,
  onPageChange,
  loading = false,
  error = null,
}: PoolsTableProps) {
  const [sortConfig, setSortConfig] = useState<{ key: string | null; direction: string | null }>({
    key: null,
    direction: null,
  });
  const [isAddLiquidityModalOpen, setIsAddLiquidityModalOpen] = useState(false);
  const [isWithdrawLiquidityModalOpen, setIsWithdrawLiquidityModalOpen] = useState(false);
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    'Pair', 'TradingFee', 'LiquidityXRP', 'TotalVolume', 'InstantAPR', 'Actions'
  ]);

  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isTablet = useMediaQuery("(min-width: 768px)");

  const headers = [
    { label: 'Pools', key: 'Pair', sortable: true },
    { label: 'Trading Fee', key: 'TradingFee', sortable: true },
    { label: 'Liquidity', key: 'LiquidityXRP', sortable: true },
    { label: '24h Volume', key: 'TotalVolume', sortable: true },
    { label: '24h Base Volume', key: 'baseVolume', sortable: true },
    { label: '24h Counter Volume', key: 'counterVolume', sortable: true },
    { label: 'Instant APR', key: 'InstantAPR', sortable: true },
    { label: 'Add / Withdraw', key: 'Actions', sortable: false },
  ];

  const sortedPools = useMemo(() => {
    let sortablePools = [...pools];
    if (sortConfig.key) {
      sortablePools.sort((a, b) => {
        let aValue: any = a[sortConfig.key as keyof Pool];
        let bValue: any = b[sortConfig.key as keyof Pool];

        if (sortConfig.key === 'LiquidityXRP') {
          aValue = parseFloat(a.totalValueLocked?.toString() || '0');
          bValue = parseFloat(b.totalValueLocked?.toString() || '0');
        } else if (sortConfig.key === 'TotalVolume') {
          aValue = parseFloat(a.totalPoolVolume?.toString() || '0');
          bValue = parseFloat(b.totalPoolVolume?.toString() || '0');
        } else if (sortConfig.key === 'Pair') {
          aValue = `${a.asset_currency} / ${a.asset2_currency}`;
          bValue = `${b.asset_currency} / ${b.asset2_currency}`;
        } else if (sortConfig.key === 'baseVolume' || sortConfig.key === 'counterVolume') {
          aValue = parseFloat(a[sortConfig.key as keyof Pool]?.toString() || '0');
          bValue = parseFloat(b[sortConfig.key as keyof Pool]?.toString() || '0');
        } else if (sortConfig.key === 'InstantAPR') {
          aValue = parseFloat(a.relativeAPR?.toString() || '0');
          bValue = parseFloat(b.relativeAPR?.toString() || '0');
        }

        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return sortConfig.direction === 'asc' ? -1 : 1;
        if (bValue == null) return sortConfig.direction === 'asc' ? 1 : -1;

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortablePools;
  }, [pools, sortConfig]);

  const requestSort = useCallback((key: string) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  }, [sortConfig.key, sortConfig.direction]);

  const formatCurrency = useCallback((value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  }, []);

  const openAddLiquidityModal = useCallback((pool: Pool) => {
    setSelectedPool(pool);
    setIsAddLiquidityModalOpen(true);
  }, []);

  const closeAddLiquidityModal = useCallback(() => {
    setIsAddLiquidityModalOpen(false);
    setSelectedPool(null);
  }, []);

  const openWithdrawLiquidityModal = useCallback((pool: Pool) => {
    setSelectedPool(pool);
    setIsWithdrawLiquidityModalOpen(true);
  }, []);

  const closeWithdrawLiquidityModal = useCallback(() => {
    setIsWithdrawLiquidityModalOpen(false);
    setSelectedPool(null);
  }, []);

  const handleRowClick = useCallback((account: string) => {
    window.location.href = `/dashboard/pool/${account}`;
  }, []);

  const renderTableContent = () => {
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={visibleColumns.length} className="h-24 text-center">
            <Loader size={32} className="mx-auto" />
            <p className="mt-2 text-lg font-semibold text-white">Loading Pools...</p>
          </TableCell>
        </TableRow>
      );
    }

    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={visibleColumns.length} className="h-24 text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-red-500 mb-2" />
            <p className="text-lg font-semibold text-white">Error Loading Pools</p>
            <p className="text-sm text-red-300">{error}</p>
          </TableCell>
        </TableRow>
      );
    }

    if (sortedPools.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={visibleColumns.length} className="h-24 text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-lg font-semibold text-white">No Pools Found</p>
            <p className="text-sm text-gray-400">There are no liquidity pools to display.</p>
          </TableCell>
        </TableRow>
      );
    }

    return sortedPools.map((pool, index) => (
      <TableRow
        key={pool.account || index}
        className="border-b border-gray-800 hover:bg-gray-800/50 cursor-pointer"
        onClick={() => handleRowClick(pool.account)}
      >
        {visibleColumns.includes('Pair') && (
          <TableCell className="font-medium text-white">
            {pool.asset_currency} / {pool.asset2_currency}
          </TableCell>
        )}
        {visibleColumns.includes('TradingFee') && (
          <TableCell className="text-white">
            {(pool.tradingFee / 1000).toFixed(2)}%
          </TableCell>
        )}
        {visibleColumns.includes('LiquidityXRP') && (
          <TableCell className="text-white">
            {formatCurrency(parseFloat(pool.totalValueLocked?.toString() || '0'))}
          </TableCell>
        )}
        {visibleColumns.includes('TotalVolume') && (
          <TableCell className="text-white">
            {formatCurrency(parseFloat(pool.totalPoolVolume?.toString() || '0'))}
          </TableCell>
        )}
        {visibleColumns.includes('baseVolume') && (
          <TableCell className="text-white">
            {(pool.baseVolume ?? 0).toFixed(2)} {pool.asset_currency}
          </TableCell>
        )}
        {visibleColumns.includes('counterVolume') && (
          <TableCell className="text-white">
            {(pool.counterVolume ?? 0).toFixed(2)} {pool.asset2_currency}
          </TableCell>
        )}
        {visibleColumns.includes('InstantAPR') && (
          <TableCell className="text-white">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="flex items-center space-x-1">
                    {parseFloat(pool.relativeAPR?.toString() || '0').toFixed(2)}%
                    {parseFloat(pool.relativeAPR?.toString() || '0') > 0 ? (
                      <ArrowUp className="h-4 w-4 text-green-500" />
                    ) : parseFloat(pool.relativeAPR?.toString() || '0') < 0 ? (
                      <ArrowDown className="h-4 w-4 text-red-500" />
                    ) : null}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Annual Percentage Rate</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TableCell>
        )}
        {visibleColumns.includes('Actions') && (
          <TableCell className="text-white">
            <Button
              variant="outline"
              size="sm"
              className="mr-2 bg-transparent hover:bg-gray-700/50 text-green-400 border border-green-400 hover:border-green-300"
              onClick={(e) => {
                e.stopPropagation();
                openAddLiquidityModal(pool);
              }}
            >
              <Plus className="h-4 w-4 mr-1" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent hover:bg-gray-700/50 text-red-400 border border-red-400 hover:border-red-300"
              onClick={(e) => {
                e.stopPropagation();
                openWithdrawLiquidityModal(pool);
              }}
            >
              <Minus className="h-4 w-4 mr-1" />
            </Button>
          </TableCell>
        )}
      </TableRow>
    ));
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Adjust visible columns based on screen size
  React.useEffect(() => {
    if (isDesktop) {
      setVisibleColumns(['Pair', 'TradingFee', 'LiquidityXRP', 'TotalVolume', 'baseVolume', 'counterVolume', 'InstantAPR', 'Actions']);
    } else if (isTablet) {
      setVisibleColumns(['Pair', 'TradingFee', 'LiquidityXRP', 'TotalVolume', 'InstantAPR', 'Actions']);
    } else {
      setVisibleColumns(['Pair', 'LiquidityXRP', 'InstantAPR', 'Actions']);
    }
  }, [isDesktop, isTablet]);

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
                {headers.filter(header => visibleColumns.includes(header.key)).map((header, index) => (
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
              {renderTableContent()}
            </TableBody>
          </Table>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 space-y-2 sm:space-y-0">
          <div className="text-sm text-gray-400">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
      {isAddLiquidityModalOpen && selectedPool && (
        <AddLiquidityModal pool={selectedPool} closeModal={closeAddLiquidityModal} />
      )}
      {isWithdrawLiquidityModalOpen && selectedPool && (
        <WithdrawLiquidityModal pool={selectedPool} closeModal={closeWithdrawLiquidityModal} />
      )}
    </Card>
  );
});

export default PoolsTable;
