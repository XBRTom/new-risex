'use client'

import React from 'react';
import { LPHolding } from '@/libs/lpHoldings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader, RefreshCw, Wallet } from 'lucide-react';
import { useWallet } from '@/context';

interface HoldingsTableProps {
  holdings: LPHolding[];
  loading: boolean;
  error: string | null;
  isWalletConnected: boolean;
  onRefresh?: () => void;
}

const HoldingsTable: React.FC<HoldingsTableProps> = ({
  holdings,
  loading,
  error,
  isWalletConnected
}) => {
  if (!isWalletConnected) {
    return (
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">LP Holdings</CardTitle>
          <CardDescription className="text-gray-400">
            Your liquidity provider positions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-400">Please connect your wallet to view your LP holdings</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">LP Holdings</CardTitle>
          <CardDescription className="text-gray-400">
            Loading your liquidity provider positions...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-400">Calculating holdings from transactions...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">LP Holdings</CardTitle>
          <CardDescription className="text-red-400">
            Error loading LP holdings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-400">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (holdings.length === 0) {
    return (
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">LP Holdings</CardTitle>
          <CardDescription className="text-gray-400">
            Your liquidity provider positions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-400">No active LP positions found</p>
            <p className="text-sm text-gray-500 mt-2">
              Start providing liquidity to earn fees and rewards
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatNumber = (value: number, decimals: number = 2): string => {
    return value.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const truncateAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">LP Holdings</CardTitle>
        <CardDescription className="text-gray-400">
          Your active liquidity provider positions ({holdings.length} pools)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-gray-700 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700 hover:bg-gray-800">
                <TableHead className="text-gray-300">Pool</TableHead>
                <TableHead className="text-gray-300">Pool Account</TableHead>
                <TableHead className="text-gray-300">LP Tokens</TableHead>
                <TableHead className="text-gray-300">Share %</TableHead>
                <TableHead className="text-gray-300">Total Deposits</TableHead>
                <TableHead className="text-gray-300">Total Withdrawals</TableHead>
                <TableHead className="text-gray-300">First Deposit</TableHead>
                <TableHead className="text-gray-300">Last Activity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {holdings.map((holding) => (
                <TableRow 
                  key={holding.id} 
                  className="border-gray-700 hover:bg-gray-800"
                >
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-blue-400 border-blue-400">
                        {holding.asset1_currency}/{holding.asset2_currency}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
                      {truncateAddress(holding.poolAccount)}
                    </code>
                  </TableCell>
                  <TableCell className="text-white">
                    {formatNumber(holding.lpTokenBalance, 6)}
                  </TableCell>
                  <TableCell className="text-white">
                    {formatNumber(holding.sharePercentage, 4)}%
                  </TableCell>
                  <TableCell className="text-green-400">
                    +{formatNumber(holding.totalDeposits, 6)}
                  </TableCell>
                  <TableCell className="text-red-400">
                    -{formatNumber(holding.totalWithdrawals, 6)}
                  </TableCell>
                  <TableCell className="text-gray-400">
                    {formatDate(holding.firstDepositDate)}
                  </TableCell>
                  <TableCell className="text-gray-400">
                    {formatDate(holding.lastActivityDate)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Summary Card */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-white">
                {holdings.length}
              </div>
              <p className="text-xs text-gray-400">Active Pools</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-400">
                {formatNumber(
                  holdings.reduce((sum, h) => sum + h.totalDeposits, 0),
                  2
                )}
              </div>
              <p className="text-xs text-gray-400">Total LP Tokens Deposited</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-400">
                {formatNumber(
                  holdings.reduce((sum, h) => sum + h.lpTokenBalance, 0),
                  2
                )}
              </div>
              <p className="text-xs text-gray-400">Current LP Token Balance</p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default HoldingsTable;
