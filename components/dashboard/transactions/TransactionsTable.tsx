'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpDown, HelpCircle, AlertCircle } from "lucide-react"
import Loader from '@/components/ui/loader';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import Link from 'next/link'
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

  const renderTableContent = () => {
    if (!isWalletConnected) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="h-24 text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-yellow-500 mb-2" />
            <p className="text-lg font-semibold text-white">Wallet Not Connected</p>
            <p className="text-sm text-white">Please connect your wallet to view your transactions.</p>
          </TableCell>
        </TableRow>
      );
    }

    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="h-24 text-center">
            <Loader size={32} className="mx-auto" />
            <p className="mt-2 text-lg font-semibold text-white">Loading Transactions...</p>
          </TableCell>
        </TableRow>
      );
    }

    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="h-24 text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-red-500 mb-2" />
            <p className="text-lg font-semibold text-white">Error Loading Transactions</p>
            <p className="text-sm text-red-300">{error}</p>
          </TableCell>
        </TableRow>
      );
    }

    if (sortedTransactions.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="h-24 text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-lg font-semibold text-white">No Transactions Found</p>
            <p className="text-sm text-gray-400">There are no transactions to display for the selected time range.</p>
          </TableCell>
        </TableRow>
      );
    }

    return sortedTransactions.map((tx) => (
      <TableRow key={tx.id || tx.date} className="border-b border-gray-800 hover:bg-gray-800/50">
        <TableCell className="font-medium text-white">{tx.date}</TableCell>
        <TableCell className="text-white">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="flex items-center space-x-1">
                  {tx.type}
                  <HelpCircle className="h-4 w-4 ml-1" />
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Transaction Type: {tx.type}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </TableCell>
        <TableCell className="text-white">{tx.sender}</TableCell>
        <TableCell className="text-white">
          {(tx.type === 'AMMDeposit' || tx.type === 'AMMWithdraw') && tx.recipient ? (
            <Link href={`/pool/${tx.recipient}`} className="text-blue-400 hover:underline">
              {tx.recipient}
            </Link>
          ) : (
            tx.recipient
          )}
        </TableCell>
        <TableCell className="text-white">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="flex flex-col">
                  <span>
                    {formatAmount(tx.amount)}
                  </span>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tx.amount} {tx.asset_currency}</p>
                {tx.asset2_currency && <p>{tx.amount} {tx.asset2_currency}</p>}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </TableCell>
        <TableCell className="text-white">{tx.lpTokens}</TableCell>
        <TableCell className="text-white">{tx.ammOwnership}%</TableCell>
      </TableRow>
    ));
  };

  useEffect(() => {
    console.log('Time range changed to:', timeRange);
  }, [timeRange]);

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
      </CardContent>
    </Card>
  )
}