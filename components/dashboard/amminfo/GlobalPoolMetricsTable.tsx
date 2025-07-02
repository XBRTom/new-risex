
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

interface RawMetric {
  date: string
  totalValueLocked: number
  totalPoolVolume: number
  poolYield: number
  relativeAPR: number
  feesGenerated: number
}

interface ProcessedMetric extends RawMetric {
  cumulativeFees: number
  growth: number
  tvlGrowth: number
  volumeGrowth: number
}

interface GlobalPoolMetricsTableProps {
  metrics: RawMetric[]
  initialTimeRange: string
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

export default function GlobalPoolMetricsTable({ metrics, initialTimeRange }: GlobalPoolMetricsTableProps) {
  const [timeRange, setTimeRange] = useState(initialTimeRange)
  const [sortConfig, setSortConfig] = useState<{ key: keyof ProcessedMetric; direction: 'asc' | 'desc' } | null>(null)

  const safeToFixed = (value: number | string | null | undefined, digits = 2) => {
    if (value === null || value === undefined) return '-'
    const numberValue = typeof value === 'string' ? parseFloat(value) : value
    return isNaN(numberValue) || numberValue === null || numberValue === undefined ? '-' : numberValue.toFixed(digits)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
  }

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 0
    return ((current - previous) / previous) * 100
  }

  const filterMetricsByTimeRange = (metrics: RawMetric[], range: string): RawMetric[] => {
    const now = new Date()
    const msPerDay = 24 * 60 * 60 * 1000
    switch (range) {
      case '7days':
        return metrics.filter(m => (now.getTime() - new Date(m.date).getTime()) <= 7 * msPerDay)
      case '15days':
        return metrics.filter(m => (now.getTime() - new Date(m.date).getTime()) <= 15 * msPerDay)
      case 'month':
        return metrics.filter(m => new Date(m.date).getMonth() === now.getMonth() && new Date(m.date).getFullYear() === now.getFullYear())
      case '3months':
        return metrics.filter(m => (now.getTime() - new Date(m.date).getTime()) <= 90 * msPerDay)
      case '6months':
        return metrics.filter(m => (now.getTime() - new Date(m.date).getTime()) <= 180 * msPerDay)
      case 'year':
        return metrics.filter(m => (now.getTime() - new Date(m.date).getTime()) <= 365 * msPerDay)
      case 'alltime':
      default:
        return metrics
    }
  }

  const processedMetrics = useMemo<ProcessedMetric[]>(() => {
    let cumulativeFees = 0
    return filterMetricsByTimeRange(metrics, timeRange)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((metric, index, array) => {
        const feesGenerated = Number(metric.feesGenerated) || 0
        cumulativeFees += feesGenerated
        const prevMetric = index > 0 ? array[index - 1] : null
        const growth = prevMetric
          ? calculateGrowth(feesGenerated, prevMetric.feesGenerated)
          : 0
        const tvlGrowth = prevMetric
          ? calculateGrowth(metric.totalValueLocked, prevMetric.totalValueLocked)
          : 0
        const volumeGrowth = prevMetric
          ? calculateGrowth(metric.totalPoolVolume, prevMetric.totalPoolVolume)
          : 0
        return {
          ...metric,
          feesGenerated,
          cumulativeFees,
          growth,
          tvlGrowth,
          volumeGrowth
        }
      })
  }, [metrics, timeRange])

  const sortedMetrics = useMemo(() => {
    if (sortConfig !== null) {
      return [...processedMetrics].sort((a, b) => {
        if (sortConfig.key === 'date') {
          return sortConfig.direction === 'asc' 
            ? new Date(a.date).getTime() - new Date(b.date).getTime()
            : new Date(b.date).getTime() - new Date(a.date).getTime()
        }
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1
        }
        return 0
      })
    }
    return processedMetrics
  }, [processedMetrics, sortConfig])

  const requestSort = (key: keyof ProcessedMetric) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const getClassNamesFor = (name: keyof ProcessedMetric) => {
    if (!sortConfig) {
      return
    }
    return sortConfig.key === name ? sortConfig.direction : undefined
  }

  const renderGrowthCell = (value: number) => (
    <span className={value > 0 ? 'text-green-500' : value < 0 ? 'text-red-500' : ''}>
      {safeToFixed(value)}%
      {value > 0 ? <ArrowUp className="h-4 w-4 inline ml-1" /> : value < 0 ? <ArrowDown className="h-4 w-4 inline ml-1" /> : null}
    </span>
  )

  return (
    <Card className="w-full bg-gradient-to-br from-gray-900 to-black border-gray-800 shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold text-white">Historical Pool Metrics</CardTitle>
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
                  { key: 'totalValueLocked', label: 'TVL' },
                  { key: 'tvlGrowth', label: 'TVL Growth' },
                  { key: 'totalPoolVolume', label: 'Volume' },
                  { key: 'volumeGrowth', label: 'Volume Growth' },
                  { key: 'poolYield', label: 'Yield' },
                  { key: 'relativeAPR', label: 'APR' },
                  { key: 'feesGenerated', label: 'Fees' },
                  { key: 'growth', label: 'Fees Growth' },
                  { key: 'cumulativeFees', label: 'Cum. Fees' }
                ].map((column) => (
                  <TableHead key={column.key} className="text-gray-400">
                    <Button
                      variant="ghost"
                      onClick={() => requestSort(column.key as keyof ProcessedMetric)}
                      className={`flex items-center space-x-1 ${getClassNamesFor(column.key as keyof ProcessedMetric)}`}
                    >
                      {column.label}
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedMetrics.map((metric, index) => (
                <TableRow key={index} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <TableCell className="font-medium text-white">{new Date(metric.date).toLocaleDateString()}</TableCell>
                  <TableCell className="text-white">{formatCurrency(metric.totalValueLocked)}</TableCell>
                  <TableCell className="text-white">{renderGrowthCell(metric.tvlGrowth)}</TableCell>
                  <TableCell className="text-white">{formatCurrency(metric.totalPoolVolume)}</TableCell>
                  <TableCell className="text-white">{renderGrowthCell(metric.volumeGrowth)}</TableCell>
                  <TableCell className="text-white">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="flex items-center space-x-1">
                            {safeToFixed(metric.poolYield)}%
                            {index === 0 ? (
                              metric.poolYield > 0 ? <ArrowUp className="h-4 w-4 text-green-500" /> :
                              metric.poolYield < 0 ? <ArrowDown className="h-4 w-4 text-red-500" /> : null
                            ) : (
                              metric.poolYield > sortedMetrics[index - 1].poolYield ? <ArrowUp className="h-4 w-4 text-green-500" /> :
                              metric.poolYield < sortedMetrics[index - 1].poolYield ? <ArrowDown className="h-4 w-4 text-red-500" /> : null
                            )}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Pool Yield</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell className="text-white">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="flex items-center space-x-1">
                            {safeToFixed(metric.relativeAPR)}%
                            {index === 0 ? (
                              metric.relativeAPR > 0 ? <ArrowUp className="h-4 w-4 text-green-500" /> :
                              metric.relativeAPR < 0 ? <ArrowDown className="h-4 w-4 text-red-500" /> : null
                            ) : (
                              metric.relativeAPR > sortedMetrics[index - 1].relativeAPR ? <ArrowUp className="h-4 w-4 text-green-500" /> :
                              metric.relativeAPR < sortedMetrics[index - 1].relativeAPR ? <ArrowDown className="h-4 w-4 text-red-500" /> : null
                            )}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Relative Annual Percentage Rate</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell className="text-white">{formatCurrency(metric.feesGenerated)}</TableCell>
                  <TableCell className="text-white">{renderGrowthCell(metric.growth)}</TableCell>
                  <TableCell className="text-white">{formatCurrency(metric.cumulativeFees)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}