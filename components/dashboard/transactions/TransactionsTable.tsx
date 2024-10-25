'use client'

import React, { useState, useMemo } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpDown, ArrowUp, ArrowDown, HelpCircle } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import Link from 'next/link'

type Transaction = {
  id: string;
  date: string;
  type: string;
  sender: string;
  recipient?: string;
  amount: string;
  asset_currency: string;
  asset2_currency: string;
  lpTokens: string;
  ammOwnership: string;
};

interface TransactionsTableProps {
  transactions: Transaction[];
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

export default function TransactionsTable({ transactions }: TransactionsTableProps) {
  const [timeRange, setTimeRange] = useState('alltime')
  const [sortConfig, setSortConfig] = useState<{ key: keyof Transaction; direction: 'asc' | 'desc' } | null>(null)

  const formatCurrency = (value: string) => {
    const numberValue = parseFloat(value)
    return isNaN(numberValue) ? value : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(numberValue)
  }

  const formatDate = (dateString: string) => {
     // Splitting the date and time components
     const [datePart, timePart] = dateString.split(', ');
     const [day, month, year] = datePart.split('/');
     const formattedDateString = `${year}-${month}-${day}T${timePart}`;
 
     // Parse the date string with the new format
     const date = new Date(formattedDateString);
     return isNaN(date.getTime()) 
         ? 'Invalid Date' 
         : date.toLocaleString('en-US', {
             year: 'numeric',
             month: 'short',
             day: 'numeric',
             hour: '2-digit',
             minute: '2-digit',
             second: '2-digit',
             hour12: true
         });
 };

  const filterTransactionsByTimeRange = (transactions: Transaction[], range: string): Transaction[] => {
    const now = new Date()
    const msPerDay = 24 * 60 * 60 * 1000
    switch (range) {
      case '7days':
        return transactions.filter(t => (now.getTime() - new Date(t.date).getTime()) <= 7 * msPerDay)
      case '15days':
        return transactions.filter(t => (now.getTime() - new Date(t.date).getTime()) <= 15 * msPerDay)
      case 'month':
        return transactions.filter(t => new Date(t.date).getMonth() === now.getMonth() && new Date(t.date).getFullYear() === now.getFullYear())
      case '3months':
        return transactions.filter(t => (now.getTime() - new Date(t.date).getTime()) <= 90 * msPerDay)
      case '6months':
        return transactions.filter(t => (now.getTime() - new Date(t.date).getTime()) <= 180 * msPerDay)
      case 'year':
        return transactions.filter(t => (now.getTime() - new Date(t.date).getTime()) <= 365 * msPerDay)
      case 'alltime':
      default:
        return transactions
    }
  }

  const filteredTransactions = useMemo(() => {
    return filterTransactionsByTimeRange(transactions, timeRange)
  }, [transactions, timeRange])

  const sortedTransactions = useMemo(() => {
    if (sortConfig !== null) {
      return [...filteredTransactions].sort((a, b) => {
        if (sortConfig.key === 'date') {
          return sortConfig.direction === 'asc'
            ? new Date(a.date).getTime() - new Date(b.date).getTime()
            : new Date(b.date).getTime() - new Date(a.date).getTime()
        }
        const aValue = a[sortConfig.key]!;
        const bValue = b[sortConfig.key]!;
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
          <Table>
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
              {sortedTransactions.map((tx) => {
                console.log('Transaction date:', tx.date);
                return (
                  <TableRow key={tx.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <TableCell className="font-medium text-white">{formatDate(tx.date)}</TableCell>
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
                            <p>Transaction Type</p>
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
                              <span>{formatCurrency(tx.amount)} {tx.asset2_currency}</span>
                              <span className="text-sm text-gray-400">{tx.asset_currency}</span>
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{tx.amount} {tx.asset2_currency}</p>
                            <p>{tx.asset_currency}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="text-white">{tx.lpTokens}</TableCell>
                    <TableCell className="text-white">{tx.ammOwnership}%</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}