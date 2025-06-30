'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Clock, Send, ArrowDownLeft, ArrowUpRight, Waves, Loader, ArrowUpDown } from "lucide-react"
import { Transaction } from '@/libs/xrpl';

interface TransactionsTableProps {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  isWalletConnected: boolean;
}

const timeRanges = [
  { value: '7days', label: 'Last 7 Days' },
  { value: '15days', label: 'Last 15 Days' },
  { value: 'month', label: 'Current Month' },
  { value: '3months', label: 'Last 3 Months' },
  { value: '6months', label: 'Last 6 Months' },
  { value: 'year', label: 'Last Year' },
  { value: 'alltime', label: 'All Time' },
]

export default function TransactionsTable({ transactions, loading, error, isWalletConnected }: TransactionsTableProps) {
  const [timeRange, setTimeRange] = useState('alltime')
  const [sortConfig, setSortConfig] = useState<{ key: keyof Transaction; direction: 'asc' | 'desc' } | null>(null)

  const formatAmount = (amount: string) => {
    return `${amount}`;
  };

  const filterTransactionsByTimeRange = (transactions: Transaction[], range: string): Transaction[] => {
    console.log('Filtering transactions for range:', range);
    console.log('Total transactions before filtering:', transactions.length);
    
    const now = new Date()
    const msPerDay = 24 * 60 * 60 * 1000
    let filteredTransactions: Transaction[];
    
    switch (range) {
      case '7days':
        filteredTransactions = transactions.filter(t => (now.getTime() - new Date(t.date).getTime()) <= 7 * msPerDay)
        break;
      case '15days':
        filteredTransactions = transactions.filter(t => (now.getTime() - new Date(t.date).getTime()) <= 15 * msPerDay)
        break;
      case 'month':
        filteredTransactions = transactions.filter(t => {
          const txDate = new Date(t.date);
          return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
        })
        break;
      case '3months':
        filteredTransactions = transactions.filter(t => (now.getTime() - new Date(t.date).getTime()) <= 90 * msPerDay)
        break;
      case '6months':
        filteredTransactions = transactions.filter(t => (now.getTime() - new Date(t.date).getTime()) <= 180 * msPerDay)
        break;
      case 'year':
        filteredTransactions = transactions.filter(t => (now.getTime() - new Date(t.date).getTime()) <= 365 * msPerDay)
        break;
      case 'alltime':
      default:
        filteredTransactions = transactions
    }
    
    console.log('Filtered transactions:', filteredTransactions.length);
    return filteredTransactions;
  }

  const filteredTransactions = useMemo(() => {
    return filterTransactionsByTimeRange(transactions, timeRange);
  }, [transactions, timeRange])

  const sortedTransactions = useMemo(() => {
    if (sortConfig !== null) {
      return [...filteredTransactions].sort((a, b) => {
        if (sortConfig.key === 'date') {
          return sortConfig.direction === 'asc'
            ? new Date(a.date).getTime() - new Date(b.date).getTime()
            : new Date(b.date).getTime() - new Date(a.date).getTime()
        }
        const aValue = a[sortConfig.key] || 0;
        const bValue = b[sortConfig.key] || 0;
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return filteredTransactions;
  }, [filteredTransactions, sortConfig]);

  const requestSort = (key: keyof Transaction) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const getClassNamesFor = (name: keyof Transaction) => {
    if (!sortConfig) {
      return
    }
    return sortConfig.key === name ? sortConfig.direction : undefined
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'Payment':
        return <Send className="h-4 w-4" />;
      case 'AMMDeposit':
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
      case 'AMMWithdraw':
        return <ArrowUpRight className="h-4 w-4 text-red-500" />;
      default:
        return <Waves className="h-4 w-4" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'Payment':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'AMMDeposit':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'AMMWithdraw':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateString;
    }
  };

  const truncateAddress = (address: string): string => {
    if (!address || address === 'N/A') return 'N/A';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  useEffect(() => {
    console.log('Time range changed to:', timeRange);
  }, [timeRange]);

  const renderTableContent = () => {
    if (!isWalletConnected) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="h-32 text-center">
            <div className="flex flex-col items-center space-y-4">
              <AlertCircle className="h-12 w-12 text-yellow-500" />
              <div>
                <p className="text-lg font-semibold text-white mb-1">Wallet Not Connected</p>
                <p className="text-gray-400">Please connect your wallet to view your transactions.</p>
              </div>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="h-32 text-center">
            <div className="flex flex-col items-center space-y-4">
              <Loader className="h-8 w-8 animate-spin text-blue-500" />
              <div>
                <p className="text-lg font-semibold text-white">Loading Transactions...</p>
                <p className="text-gray-400">Fetching your transaction history...</p>
              </div>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="h-32 text-center">
            <div className="flex flex-col items-center space-y-4">
              <AlertCircle className="h-12 w-12 text-red-500" />
              <div>
                <p className="text-lg font-semibold text-white mb-1">Error Loading Transactions</p>
                <p className="text-red-300">{error}</p>
              </div>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    if (sortedTransactions.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="h-32 text-center">
            <div className="flex flex-col items-center space-y-4">
              <Clock className="h-12 w-12 text-gray-400" />
              <div>
                <p className="text-lg font-semibold text-white mb-1">No Transactions Found</p>
                <p className="text-gray-400">No transactions found for the selected time range.</p>
              </div>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    return sortedTransactions.map((tx) => (
      <TableRow key={tx.id || tx.date} className="border-gray-700 hover:bg-gray-800/50 transition-colors">
        <TableCell className="text-gray-300">
          <div className="flex flex-col">
            <span className="text-white font-medium">{formatDate(tx.date).split(' ')[0]}</span>
            <span className="text-xs text-gray-400">{formatDate(tx.date).split(' ')[1]}</span>
          </div>
        </TableCell>
        
        <TableCell>
          <div className="flex items-center space-x-2">
            {getTransactionIcon(tx.type)}
            <Badge className={`${getTransactionColor(tx.type)} border font-medium`}>
              {tx.type}
            </Badge>
          </div>
        </TableCell>
        
        <TableCell>
          <code className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
            {truncateAddress(tx.sender)}
          </code>
        </TableCell>
        
        <TableCell>
          {tx.recipient && tx.recipient !== 'N/A' ? (
            <code className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
              {truncateAddress(tx.recipient)}
            </code>
          ) : (
            <span className="text-gray-500">N/A</span>
          )}
        </TableCell>
        
        <TableCell className="text-white font-medium">
          {formatAmount(tx.amount)}
        </TableCell>
        
        <TableCell className="text-white">
          {tx.lpTokens && tx.lpTokens !== '0' ? (
            <span className={`font-medium ${
              parseFloat(tx.lpTokens) > 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {parseFloat(tx.lpTokens) > 0 ? '+' : ''}{parseFloat(tx.lpTokens).toFixed(6)}
            </span>
          ) : (
            <span className="text-gray-500">-</span>
          )}
        </TableCell>
        
        <TableCell className="text-white">
          {tx.ammOwnership && tx.ammOwnership !== '0' ? (
            <span className="text-blue-400 font-medium">
              {parseFloat(tx.ammOwnership).toFixed(4)}%
            </span>
          ) : (
            <span className="text-gray-500">-</span>
          )}
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <Card className="w-full bg-gradient-to-br from-gray-900 to-black border-gray-800 shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold text-white">Transaction History</CardTitle>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px] bg-gray-800 text-white border-gray-700 hover:bg-gray-700">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 text-white border-gray-700">
            {timeRanges.map((range) => (
              <SelectItem key={range.value} value={range.value} className="hover:bg-gray-800">
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table aria-label="Transactions history">
            <TableHeader>
              <TableRow className="border-b border-gray-800">
                {[
                  { key: 'date', label: 'Date' },
                  { key: 'type', label: 'Type' },
                  { key: 'sender', label: 'Sender' },
                  { key: 'recipient', label: 'Recipient' },
                  { key: 'amount', label: 'Amount' },
                  { key: 'lpTokens', label: 'LP Tokens' },
                  { key: 'ammOwnership', label: 'AMM Ownership' },
                ].map((column) => (
                  <TableHead key={column.key} className="text-gray-400">
                    <Button
                      variant="ghost"
                      onClick={() => requestSort(column.key as keyof Transaction)}
                      className={`flex items-center space-x-1 ${getClassNamesFor(column.key as keyof Transaction)}`}
                    >
                      {column.label}
                      <ArrowUpDown className="h-4 w-4" />
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
        
        {/* Summary Cards */}
        {sortedTransactions.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-white">
                  {sortedTransactions.length}
                </div>
                <p className="text-xs text-gray-400">Total Transactions</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-400">
                  {sortedTransactions.filter(tx => tx.type === 'AMMDeposit').length}
                </div>
                <p className="text-xs text-gray-400">AMM Deposits</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-red-400">
                  {sortedTransactions.filter(tx => tx.type === 'AMMWithdraw').length}
                </div>
                <p className="text-xs text-gray-400">AMM Withdrawals</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-blue-400">
                  {sortedTransactions.filter(tx => tx.type === 'Payment').length}
                </div>
                <p className="text-xs text-gray-400">Payments</p>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  )
}