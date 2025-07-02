'use client'

import React, { useMemo, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, BarChart, Bar, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, LineChart as LineChartIcon, BarChart as BarChartIcon, LayoutGrid, Rows, ArrowUpRight, ArrowDownRight, Wallet, BarChart3, Percent, Coins, Scale, TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react'
import { startOfWeek, startOfMonth, startOfQuarter, endOfWeek, endOfMonth, endOfQuarter, format, parseISO, isWithinInterval, subDays, subMonths, subYears } from 'date-fns'


interface PoolMetricsChartProps {
  metrics: Metric[]
}

interface Metric {
  date: string;
  totalValueLocked: number;
  totalPoolVolume: number;
  feesGenerated: number;
  relativeAPR: number;
}

type ProcessedMetric = {
  date: string;
  totalValueLocked: number;
  tvlPercentageChange: number;
  totalPoolVolume: number;
  totalPoolVolumePercentageChange: number;
  feesGenerated: number;
  feesGeneratedPercentageChange: number;
  relativeAPR: number;
  relativeAPRPercentageChange: number;
  liquidityUtilizationRate: number;
  liquidityUtilizationRatePercentageChange: number;
  [key: string]: number | string;
};

const formatNumber = (value: number) => {
  const absValue = Math.abs(value);
  if (absValue >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (absValue >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  if (absValue >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
  return value.toFixed(2);
};

const formatDate = (dateString: string, aggregation: string) => {
  const date = parseISO(dateString);
  switch (aggregation) {
    case 'daily':
      return format(date, 'MMM d');
    case 'weekly':
      return `Week of ${format(date, 'MMM d')}`;
    case 'monthly':
      return format(date, 'MMMM yyyy');
    case 'quarterly':
      return `Q${Math.floor(date.getMonth() / 3) + 1} ${date.getFullYear()}`;
    default:
      return format(date, 'MMM d');
  }
};

const CustomTooltip = ({ active, payload, label, aggregation }: any) => {
  if (active && payload && payload.length) {
    const tvlValue = payload.find((p: any) => p.dataKey === 'totalValueLocked')?.value;
    const tvlPercentageChange = payload.find((p: any) => p.dataKey === 'tvlPercentageChange')?.value;
    const totalPoolVolumeValue = payload.find((p: any) => p.dataKey === 'totalPoolVolume')?.value;
    const totalPoolVolumePercentageChange = payload.find((p: any) => p.dataKey === 'totalPoolVolumePercentageChange')?.value;
    const feesGeneratedValue = payload.find((p: any) => p.dataKey === 'feesGenerated')?.value;
    const feesGeneratedPercentageChange = payload.find((p: any) => p.dataKey === 'feesGeneratedPercentageChange')?.value;
    const relativeAPRValue = payload.find((p: any) => p.dataKey === 'relativeAPR')?.value;
    const relativeAPRPercentageChange = payload.find((p: any) => p.dataKey === 'relativeAPRPercentageChange')?.value;
    const liquidityUtilizationRateValue = payload.find((p: any) => p.dataKey === 'liquidityUtilizationRate')?.value;
    const liquidityUtilizationRatePercentageChange = payload.find((p: any) => p.dataKey === 'liquidityUtilizationRatePercentageChange')?.value;

    return (
      <div className="bg-gray-800/90 p-4 rounded-lg shadow-lg border border-gray-700 backdrop-blur-sm">
        <p className="text-white text-sm font-medium mb-2">{formatDate(label, aggregation)}</p>
        {tvlValue !== undefined && (
          <div className="mb-2">
            <p className="text-white text-sm font-medium flex items-center">
              <span className="w-3 h-3 inline-block mr-2 bg-[#FF9500]"></span>
              TVL: {formatNumber(tvlValue)}
            </p>
            {tvlPercentageChange !== undefined && (
              <p className={`text-sm font-medium flex items-center ${
                tvlPercentageChange > 0
                  ? 'text-green-400'
                  : tvlPercentageChange < 0
                    ? 'text-red-400'
                    : 'text-gray-400'
              }`}>
                <span className="w-3 h-3 inline-block mr-2 bg-[#007AFF]"></span>
                <span className="text-white">Performance:</span> {tvlPercentageChange.toFixed(2)}%
              </p>
            )}
          </div>
        )}
        {totalPoolVolumeValue !== undefined && (
          <div className="mb-2">
            <p className="text-white text-sm font-medium flex items-center">
              <span className="w-3 h-3 inline-block mr-2 bg-[#34C759]"></span>
              Pool Volume: {formatNumber(totalPoolVolumeValue)}
            </p>
            {totalPoolVolumePercentageChange !== undefined && (
              <p className={`text-sm font-medium flex items-center ${
                totalPoolVolumePercentageChange > 0
                  ? 'text-green-400'
                  : totalPoolVolumePercentageChange < 0
                    ? 'text-red-400'
                    : 'text-gray-400'
              }`}>
                <span className="w-3 h-3 inline-block mr-2 bg-[#5856D6]"></span>
                <span className="text-white">Performance: </span>  
                {totalPoolVolumePercentageChange.toFixed(2)}%
              </p>
            )}
          </div>
        )}
        {feesGeneratedValue !== undefined && (
          <div className="mb-2">
            <p className="text-white text-sm font-medium flex items-center">
              <span className="w-3 h-3 inline-block mr-2 bg-[#FF2D55]"></span>
              Fees Generated: {formatNumber(feesGeneratedValue)}
            </p>
            {feesGeneratedPercentageChange !== undefined && (
              <p className={`text-sm font-medium flex items-center ${
                feesGeneratedPercentageChange > 0
                  ? 'text-green-400'
                  : feesGeneratedPercentageChange < 0
                    ? 'text-red-400'
                    : 'text-gray-400'
              }`}>
                <span className="w-3 h-3 inline-block mr-2 bg-[#AF52DE]"></span>
                <span className="text-white">Performance: </span>  
                {feesGeneratedPercentageChange.toFixed(2)}%
              </p>
            )}
          </div>
        )}
        {relativeAPRValue !== undefined && (
          <div className="mb-2">
            <p className="text-white text-sm font-medium flex items-center">
              <span className="w-3 h-3 inline-block mr-2 bg-[#FF9500]"></span>
              Relative APR: {relativeAPRValue.toFixed(2)}%
            </p>
            {relativeAPRPercentageChange !== undefined && (
              <p className={`text-sm font-medium flex items-center ${
                relativeAPRPercentageChange > 0
                  ? 'text-green-400'
                  : relativeAPRPercentageChange < 0
                    ? 'text-red-400'
                    : 'text-gray-400'
              }`}>
                <span className="w-3 h-3 inline-block mr-2 bg-[#FF3B30]"></span>
                <span className="text-white">Performance: </span>  
                {relativeAPRPercentageChange.toFixed(2)}%
              </p>
            )}
          </div>
        )}
        {liquidityUtilizationRateValue !== undefined && (
          <div>
            <p className="text-white text-sm font-medium flex items-center">
              <span className="w-3 h-3 inline-block mr-2 bg-[#FF9500]"></span>
              Liquidity Utilization Rate: {liquidityUtilizationRateValue.toFixed(2)}%
            </p>
            {liquidityUtilizationRatePercentageChange !== undefined && (
              <p className={`text-sm font-medium flex items-center ${
                liquidityUtilizationRatePercentageChange > 0
                  ? 'text-green-400'
                  : liquidityUtilizationRatePercentageChange < 0
                    ? 'text-red-400'
                    : 'text-gray-400'
              }`}>
                <span className="w-3 h-3 inline-block mr-2 bg-[#FF3B30]"></span>
                <span className="text-white">Performance: </span>  
                {liquidityUtilizationRatePercentageChange.toFixed(2)}%
              </p>
            )}
          </div>
        )}
      </div>
    )
  }
  return null
}

const timeRangeDisplayTextBase = {
  all: "All Time",
  "7d": "Last 7 Days",
  "30d": "Last 30 Days",
  "90d": "Last 90 Days",
  "180d": "Last 180 Days",
  "1y": "Last Year",
  "5y": "Last 5 Years"
};

export default function PoolMetricsChart({ metrics }: PoolMetricsChartProps) {
  const [timeRange, setTimeRange] = useState<keyof typeof timeRangeDisplayTextBase>('all')
  const [aggregation, setAggregation] = useState<string>('daily')
  const [tvlChartType, setTvlChartType] = useState<string>('bar')
  const [totalPoolVolumeChartType, setVolumeChartType] = useState<string>('bar')
  const [feesGeneratedChartType, setFeesGeneratedChartType] = useState<string>('bar')
  const [relativeAPRChartType, setRelativeAPRChartType] = useState<string>('bar')
  const [percentageChartType, setPercentageChartType] = useState<string>('line')
  const [showTVL, setShowTVL] = useState<boolean>(true)
  const [showTotalPoolVolume, setShowVolume] = useState<boolean>(true)
  const [showFeesGenerated, setShowFeesGenerated] = useState<boolean>(true)
  const [showRelativeAPR, setShowRelativeAPR] = useState<boolean>(true)
  const [showPercentageChange, setShowPercentageChange] = useState<boolean>(true)
  const [chartLayout, setChartLayout] = useState<'sideBySide' | 'stacked'>('sideBySide')
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false)
  const [liquidityUtilizationRateChartType, setLiquidityUtilizationRateChartType] = useState<string>('bar')
  const [showLiquidityUtilizationRate, setShowLiquidityUtilizationRate] = useState<boolean>(true)

  const timeRangeDisplayText = useMemo(() => timeRangeDisplayTextBase, []);

  const filteredMetrics = useMemo(() => {
    let filtered = metrics.sort((a: Metric, b: Metric) => parseISO(a.date).getTime() - parseISO(b.date).getTime())

    if (timeRange !== 'all') {
      const now = new Date()
      let pastDate: Date
      switch (timeRange) {
        case '7d':
          pastDate = subDays(now, 7)
          break
        case '30d':
          pastDate = subDays(now, 30)
          break
        case '90d':
          pastDate = subDays(now, 90)
          break
        case '180d':
          pastDate = subDays(now, 180)
          break
        case '1y':
          pastDate = subYears(now, 1)
          break
        case '5y':
          pastDate = subYears(now, 5)
          break
        default:
          pastDate = subDays(now, 30)
      }
      filtered = filtered.filter(metric => 
        isWithinInterval(parseISO(metric.date), { start: pastDate, end: now })
      )
    }

    return filtered
  }, [metrics, timeRange])

  const totalMetrics = useMemo(() => {
    return {
      totalPoolVolume: filteredMetrics.reduce((sum, metric) => sum + metric.totalPoolVolume, 0),
      totalValueLocked: filteredMetrics.reduce((sum, metric) => sum + metric.totalValueLocked, 0),
      totalFeesGenerated: filteredMetrics.reduce((sum, metric) => sum + metric.feesGenerated, 0),
      totalRelativeAPR: filteredMetrics.reduce((sum, metric) => sum + metric.relativeAPR, 0),
    };
  }, [filteredMetrics]);

  const processedMetrics = useMemo<ProcessedMetric[]>(() => {
    const aggregatedMetrics = filteredMetrics.reduce((acc: any[], metric: Metric) => {
      const date = parseISO(metric.date)
      let key: string
      let periodStart: Date

      switch (aggregation) {
        case 'weekly':
          periodStart = startOfWeek(date)
          key = format(periodStart, 'yyyy-MM-dd')
          break
        case 'monthly':
          periodStart = startOfMonth(date)
          key = format(periodStart, 'yyyy-MM')
          break
        case  'quarterly':
          periodStart = startOfQuarter(date)
          key = `${date.getFullYear()}-Q${Math.floor(date.getMonth() / 3) + 1}`
          break
        default:
          key = metric.date
          periodStart = date
      }

      const existingEntry = acc.find(m => m.key === key)
      if (existingEntry) {
        existingEntry.totalValueLocked += metric.totalValueLocked
        existingEntry.totalPoolVolume += metric.totalPoolVolume
        existingEntry.feesGenerated += metric.feesGenerated
        existingEntry.relativeAPR += metric.relativeAPR
        existingEntry.count += 1
      } else {
        acc.push({ 
          key, 
          date: format(periodStart, 'yyyy-MM-dd'),
          totalValueLocked: metric.totalValueLocked, 
          totalPoolVolume: metric.totalPoolVolume,
          feesGenerated: metric.feesGenerated,
          relativeAPR: metric.relativeAPR,
          count: 1
        })
      }
      return acc
    }, [])

    return aggregatedMetrics.map((m: any, index: number, array: any[]) => {
      const tvl = m.totalValueLocked
      const prevTVL = index > 0 ? array[index - 1].totalValueLocked : tvl
      const tvlPercentageChange = ((tvl - prevTVL) / prevTVL) * 100

      const totalPoolVolume = m.totalPoolVolume
      const prevTotalPoolVolume = index > 0 ? array[index - 1].totalPoolVolume : totalPoolVolume
      const totalPoolVolumePercentageChange = ((totalPoolVolume - prevTotalPoolVolume) / prevTotalPoolVolume) * 100

      const feesGenerated = m.feesGenerated
      const prevFeesGenerated = index > 0 ? array[index - 1].feesGenerated : feesGenerated
      const feesGeneratedPercentageChange = ((feesGenerated - prevFeesGenerated) / prevFeesGenerated) * 100

      const relativeAPR = m.relativeAPR / m.count  // Keep this as an average
      const prevRelativeAPR = index > 0 ? array[index - 1].relativeAPR / array[index - 1].count : relativeAPR
      const relativeAPRPercentageChange = ((relativeAPR - prevRelativeAPR) / prevRelativeAPR) * 100

      const liquidityUtilizationRate = tvl > 0 ? (totalPoolVolume / tvl) * 100 : 0;
      const prevLiquidityUtilizationRate = index > 0 
        ? (array[index - 1].totalPoolVolume / array[index - 1].totalValueLocked) * 100 
        : liquidityUtilizationRate;
      const liquidityUtilizationRatePercentageChange = 
        ((liquidityUtilizationRate - prevLiquidityUtilizationRate) / prevLiquidityUtilizationRate) * 100;

      return {
        date: m.date,
        totalValueLocked: tvl,
        tvlPercentageChange: index === 0 ? 0 : tvlPercentageChange,
        totalPoolVolume: totalPoolVolume,
        totalPoolVolumePercentageChange: index === 0 ? 0 : totalPoolVolumePercentageChange,
        feesGenerated: feesGenerated,
        feesGeneratedPercentageChange: index === 0 ? 0 : feesGeneratedPercentageChange,
        relativeAPR: relativeAPR,
        relativeAPRPercentageChange: index === 0 ? 0 : relativeAPRPercentageChange,
        liquidityUtilizationRate,
        liquidityUtilizationRatePercentageChange: index === 0 ? 0 : liquidityUtilizationRatePercentageChange
      }
    })
  }, [filteredMetrics, aggregation])

  const tvlDomain = useMemo(() => {
    const values = processedMetrics.map(metric => metric.totalValueLocked)
    const minValue = Math.min(...values)
    const maxValue = Math.max(...values)
    const range = maxValue - minValue
    return [Math.max(0, minValue - range * 0.1), maxValue + range * 0.1]
  }, [processedMetrics])

  const totalPoolVolumeDomain = useMemo(() => {
    const values = processedMetrics.map(metric => metric.totalPoolVolume)
    const minValue = Math.min(...values)
    const maxValue = Math.max(...values)
    const range = maxValue - minValue
    return [Math.max(0, minValue - range * 0.1), maxValue + range * 0.1]
  }, [processedMetrics])

  const feesGeneratedDomain = useMemo(() => {
    const values = processedMetrics.map(metric => metric.feesGenerated)
    const minValue = Math.min(...values)
    const maxValue = Math.max(...values)
    const range = maxValue - minValue
    return [Math.max(0, minValue - range * 0.1), maxValue + range * 0.1]
  }, [processedMetrics])

  const relativeAPRDomain = useMemo(() => {
    const values = processedMetrics.map(metric => metric.relativeAPR)
    const minValue = Math.min(...values)
    const maxValue = Math.max(...values)
    const range = maxValue - minValue
    return [Math.max(0, minValue - range * 0.1), maxValue + range * 0.1]
  }, [processedMetrics])

  const renderChart = useCallback((chartType: string, dataKey: string, percentageDataKey: string, color: string, percentageColor: string, domain: number[]) => {
    const calculatePercentageChangeDomain = (dataKey: string) => {
      const values = processedMetrics.map(metric => metric[dataKey] as number)
      const minValue = Math.min(...values)
      const maxValue = Math.max(...values)
      const padding = Math.max(Math.abs(minValue), Math.abs(maxValue)) * 0.1
      return [-Math.max(Math.abs(minValue), Math.abs(maxValue)) - padding, Math.max(Math.abs(minValue), Math.abs(maxValue)) + padding]
    }

    const percentageChangeDomain = calculatePercentageChangeDomain(percentageDataKey)

    return (
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={processedMetrics} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.5} />
          <XAxis 
            dataKey="date" 
            stroke="#ffffff"
            tick={{ fill: '#ffffff', fontSize: 12 }}
            tickLine={{ stroke: '#ffffff' }}
            tickFormatter={(value) => formatDate(value, aggregation)}
            interval={'preserveStartEnd'}
          />
          <YAxis 
            yAxisId="left"
            stroke="#ffffff"
            tickFormatter={formatNumber}
            domain={domain}
            tick={{ fill: '#ffffff', fontSize: 12 }}
            tickLine={{ stroke: '#ffffff' }}
            width={50}
          />
          {showPercentageChange && (
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#ffffff"
              tickFormatter={(value) => `${value.toFixed(2)}%`}
              domain={percentageChangeDomain}
              tick={{ fill: '#ffffff', fontSize: 12 }}
              tickLine={{ stroke: '#ffffff' }}
              width={50}
            />
          )}
          <Tooltip 
            content={<CustomTooltip aggregation={aggregation} />}
            cursor={{ stroke: '#4B5563', strokeWidth: 1 }}
          />
          {showPercentageChange && <ReferenceLine y={0} yAxisId="right" stroke="#666" />}
          {chartType === 'line' ? (
            <Line
              yAxisId="left"
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 8, fill: color, stroke: '#ffffff', strokeWidth: 2 }}
            />
          ) : (
            <Bar
              yAxisId="left"
              dataKey={dataKey}
              fill={color}
              radius={[4, 4, 0, 0]}
            />
          )}
          {showPercentageChange && (
            percentageChartType === 'line' ? (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey={percentageDataKey}
                stroke={percentageColor}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 8, fill: percentageColor, stroke: '#ffffff', strokeWidth: 2 }}
              />
            ) : (
              <Bar
                yAxisId="right"
                dataKey={percentageDataKey}
                fill={percentageColor}
                radius={[4, 4, 0, 0]}
              />
            )
          )}
        </ComposedChart>
      </ResponsiveContainer>
    );
  }, [processedMetrics, aggregation, showPercentageChange, percentageChartType]);

  const renderSummaryStats = useCallback(() => {
    const lastMetric = filteredMetrics[filteredMetrics.length - 1];
    const prevMetric = filteredMetrics[filteredMetrics.length - 2];
    const initialMetric = filteredMetrics[0];

    const calculateChange = (current: number, previous: number) => {
      const change = ((current - previous) / previous) * 100;
      return change.toFixed(2);
    };

    const averages = {
      volume: filteredMetrics.reduce((sum, metric) => sum + metric.totalPoolVolume, 0) / filteredMetrics.length,
      fees: filteredMetrics.reduce((sum, metric) => sum + metric.feesGenerated, 0) / filteredMetrics.length,
      apr: filteredMetrics.reduce((sum, metric) => sum + metric.relativeAPR, 0) / filteredMetrics.length,
      utilizationRate: filteredMetrics.reduce((sum, metric) => sum + (metric.totalPoolVolume / metric.totalValueLocked) * 100, 0) / filteredMetrics.length,
      liquidity: filteredMetrics.reduce((sum, metric) => sum + metric.totalValueLocked, 0) / filteredMetrics.length,
    };

    const totals = {
      volume: filteredMetrics.reduce((sum, metric) => sum + metric.totalPoolVolume, 0),
      fees: filteredMetrics.reduce((sum, metric) => sum + metric.feesGenerated, 0),
    };

    const current = {
      volume: lastMetric.totalPoolVolume,
      tvl: lastMetric.totalValueLocked,
      fees: lastMetric.feesGenerated,
      apr: lastMetric.relativeAPR,
      utilizationRate: (lastMetric.totalPoolVolume / lastMetric.totalValueLocked) * 100,
    };

    const liquidityGrowth = current.tvl - initialMetric.totalValueLocked;
    const liquidityGrowthPercentage = ((liquidityGrowth / initialMetric.totalValueLocked) * 100).toFixed(2);

    const renderMetric = (label: string, value: number, change?: number) => (
      <div className="flex justify-between items-center py-1">
        <span className="text-sm text-gray-400">{label}</span>
        <div className="text-right">
          <span className="text-sm font-medium text-white">{formatNumber(value)}</span>
          {change !== undefined && (
            <span className={`ml-1 text-sm ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {change >= 0 ? <ArrowUpRight className="inline h-3 w-3" /> : <ArrowDownRight className="inline h-3 w-3" />}
              {Math.abs(change)}%
            </span>
          )}
        </div>
      </div>
    );

    return (
      <Card className="bg-transparent border-none">
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-white mb-1">Since Inception</h4>
              {renderMetric("Liquidity Growth", liquidityGrowth, parseFloat(liquidityGrowthPercentage))}
              {renderMetric("Asset A Growth", liquidityGrowth, parseFloat(liquidityGrowthPercentage))}
              {renderMetric("Asset B Growth", liquidityGrowth, parseFloat(liquidityGrowthPercentage))}
              
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-white mb-1">Today Performance</h4>
              {renderMetric("Value Locked", current.tvl, parseFloat(calculateChange(current.tvl, prevMetric.totalValueLocked)))}
              {renderMetric("Trading Volume", current.volume, parseFloat(calculateChange(current.volume, prevMetric.totalPoolVolume)))}
              {renderMetric("Daily Fees", current.fees, parseFloat(calculateChange(current.fees, prevMetric.feesGenerated)))}
              {renderMetric("Relative APR", current.apr, parseFloat(calculateChange(current.apr, prevMetric.relativeAPR)))}
              {renderMetric("Utilization Rate", current.utilizationRate, parseFloat(calculateChange(current.utilizationRate, (prevMetric.totalPoolVolume / prevMetric.totalValueLocked) * 100)))}
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-white mb-1">Daily Averages</h4>
              {renderMetric("Avg. Daily Volume", averages.volume)}
              {renderMetric("Avg. Daily Fees", averages.fees)}
              {renderMetric("Avg. Daily Liquidity", averages.liquidity)}
              {renderMetric("Avg. Relative APR", averages.apr)}
              {renderMetric("Avg. Utilization Rate", averages.utilizationRate)}
            </div>
            <div className="space-y-1">
            <h4 className="text-sm font-medium text-white mb-1">Pool Performance</h4>
              {renderMetric("Total Volume", totals.volume)}
              {renderMetric("Total Fees", totals.fees)}
              {renderMetric("Impermant Loss", averages.volume)}
              {renderMetric("Variance", averages.fees)}
              {renderMetric("Liquid Sentiment", averages.fees)}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }, [filteredMetrics]);


  const renderSwitches = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
      <div className="flex items-center space-x-2">
        <Switch
          id="show-tvl"
          checked={showTVL}
          onCheckedChange={setShowTVL}
          className="data-[state=checked]:bg-blue-500"
        />
        <Label htmlFor="show-tvl" className="text-sm text-gray-300">TVL</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="show-volume"
          checked={showTotalPoolVolume}
          onCheckedChange={setShowVolume}
          className="data-[state=checked]:bg-blue-500"
        />
        <Label htmlFor="show-volume" className="text-sm text-gray-300">Pool Volume</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="show-fees"
          checked={showFeesGenerated}
          onCheckedChange={setShowFeesGenerated}
          className="data-[state=checked]:bg-blue-500"
        />
        <Label htmlFor="show-fees" className="text-sm text-gray-300">Fees</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="show-apr"
          checked={showRelativeAPR}
          onCheckedChange={setShowRelativeAPR}
          className="data-[state=checked]:bg-blue-500"
        />
        <Label htmlFor="show-apr" className="text-sm text-gray-300">Relative APR</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="show-percentage"
          checked={showPercentageChange}
          onCheckedChange={setShowPercentageChange}
          className="data-[state=checked]:bg-blue-500"
        />
        <Label htmlFor="show-percentage" className="text-sm text-gray-300">% Change</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="show-utilization"
          checked={showLiquidityUtilizationRate}
          onCheckedChange={setShowLiquidityUtilizationRate}
          className="data-[state=checked]:bg-blue-500"
        />
        <Label htmlFor="show-utilization" className="text-sm text-gray-300">Utilization Rate</Label>
      </div>
    </div>
  )

  
  return (
    <div className="w-full bg-gradient-to-br from-gray-900 to-black border border-gray-800 shadow-lg rounded-xl overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Performance Metrics</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className={`text-white hover:text-gray-200 bg-gray-800/50 hover:bg-gray-700/60 border-gray-600 hover:border-gray-500 transition-all duration-200 backdrop-blur-sm ${
                isSettingsOpen ? 'bg-white/10 text-white' : ''
              }`}
            >
              Settings
              <ChevronDown className={`ml-2 h-4 w-4 transition-transform duration-200 ${isSettingsOpen ? 'rotate-180' : ''}`} />
            </Button>
          </div>

          <AnimatePresence>
            {isSettingsOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select 
                      value={timeRange} 
                      onValueChange={(value: "all" | "7d" | "30d" | "90d" | "180d" | "1y" | "5y") => setTimeRange(value)}
                    >
                      <SelectTrigger className="w-full bg-gray-800/50 text-white border-gray-600 hover:border-gray-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200 backdrop-blur-sm">
                        <SelectValue placeholder="Select time range" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800/90 text-white border-gray-600 backdrop-blur-sm">
                        <SelectItem value="all" className="hover:bg-gray-700">All Time</SelectItem>
                        <SelectItem value="7d" className="hover:bg-gray-700">Last 7 Days</SelectItem>
                        <SelectItem value="30d" className="hover:bg-gray-700">Last 30 Days</SelectItem>
                        <SelectItem value="90d" className="hover:bg-gray-700">Last 90 Days</SelectItem>
                        <SelectItem value="180d" className="hover:bg-gray-700">Last 180 Days</SelectItem>
                        <SelectItem value="1y" className="hover:bg-gray-700">Last Year</SelectItem>
                        <SelectItem value="5y" className="hover:bg-gray-700">Last 5 Years</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={aggregation} onValueChange={setAggregation}>
                      <SelectTrigger className="w-full bg-gray-800/50 text-white border-gray-600 hover:border-gray-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200 backdrop-blur-sm">
                        <SelectValue placeholder="Select view" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800/90 text-white border-gray-600 backdrop-blur-sm">
                        <SelectItem value="daily" className="hover:bg-gray-700">Daily</SelectItem>
                        <SelectItem value="weekly" className="hover:bg-gray-700">Weekly</SelectItem>
                        <SelectItem value="monthly" className="hover:bg-gray-700">Monthly</SelectItem>
                        <SelectItem value="quarterly" className="hover:bg-gray-700">Quarterly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="show-tvl"
                        checked={showTVL}
                        onCheckedChange={setShowTVL}
                        className="data-[state=checked]:bg-blue-500"
                      />
                      <Label htmlFor="show-tvl" className="text-sm text-gray-300">TVL</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="show-volume"
                        checked={showTotalPoolVolume}
                        onCheckedChange={setShowVolume}
                        className="data-[state=checked]:bg-blue-500"
                      />
                      <Label htmlFor="show-volume" className="text-sm text-gray-300">Volume</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="show-fees"
                        checked={showFeesGenerated}
                        onCheckedChange={setShowFeesGenerated}
                        className="data-[state=checked]:bg-blue-500"
                      />
                      <Label htmlFor="show-fees" className="text-sm text-gray-300">Fees</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="show-apr"
                        checked={showRelativeAPR}
                        onCheckedChange={setShowRelativeAPR}
                        className="data-[state=checked]:bg-blue-500"
                      />
                      <Label htmlFor="show-apr" className="text-sm text-gray-300">APR</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="show-percentage"
                        checked={showPercentageChange}
                        onCheckedChange={setShowPercentageChange}
                        className="data-[state=checked]:bg-blue-500"
                      />
                      <Label htmlFor="show-percentage" className="text-sm text-gray-300">% Change</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="show-utilization"
                        checked={showLiquidityUtilizationRate}
                        onCheckedChange={setShowLiquidityUtilizationRate}
                        className="data-[state=checked]:bg-blue-500"
                      />
                      <Label htmlFor="show-utilization" className="text-sm text-gray-300">Utilization</Label>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setChartLayout(chartLayout === 'stacked' ? 'sideBySide' : 'stacked')}
                      className={`text-white hover:text-gray-200 bg-gray-800/50 hover:bg-gray-700/60 border-gray-600 hover:border-gray-500 transition-all duration-200 backdrop-blur-sm ${
                        chartLayout === 'stacked' ? 'bg-white/10' : ''
                      }`}
                    >
                      {chartLayout === 'stacked' ? <Rows className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
                    </Button>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setTvlChartType('line');
                          setVolumeChartType('line');
                          setFeesGeneratedChartType('line');
                          setRelativeAPRChartType('line');
                          setLiquidityUtilizationRateChartType('line');
                        }}
                        className={`text-white hover:text-gray-200 bg-gray-800/50 hover:bg-gray-700/60 border-gray-600 hover:border-gray-500 transition-all duration-200 backdrop-blur-sm ${
                          tvlChartType === 'line' && totalPoolVolumeChartType === 'line' && feesGeneratedChartType === 'line' && relativeAPRChartType === 'line' && liquidityUtilizationRateChartType === 'line' ? 'bg-white/10' : ''
                        }`}
                      >
                        <LineChartIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setTvlChartType('bar');
                          setVolumeChartType('bar');
                          setFeesGeneratedChartType('bar');
                          setRelativeAPRChartType('bar');
                          setLiquidityUtilizationRateChartType('bar');
                        }}
                        className={`text-white hover:text-gray-200 bg-gray-800/50 hover:bg-gray-700/60 border-gray-600 hover:border-gray-500 transition-all duration-200 backdrop-blur-sm ${
                          tvlChartType === 'bar' && totalPoolVolumeChartType === 'bar' && feesGeneratedChartType === 'bar' && relativeAPRChartType === 'bar' && liquidityUtilizationRateChartType === 'bar' ? 'bg-white/10' : ''
                        }`}
                      >
                        <BarChartIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {renderSummaryStats()}

          <div className={`grid ${chartLayout === 'stacked' ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'} gap-6`}>
            {showTVL && (
              <div className="bg-transparent border border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Total Liquidity (TVL)</h3>
                {renderChart(tvlChartType, 'totalValueLocked', 'tvlPercentageChange', '#FF9500', '#007AFF', tvlDomain)}
              </div>
            )}
            {showTotalPoolVolume && (
              <div className="bg-transparent border border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Pool Volume and Activity</h3>
                {renderChart(totalPoolVolumeChartType, 'totalPoolVolume', 'totalPoolVolumePercentageChange', '#34C759', '#5856D6', totalPoolVolumeDomain)}
              </div>
            )}
            {showFeesGenerated && (
              <div className="bg-transparent border border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Fees Generated</h3>
                {renderChart(feesGeneratedChartType, 'feesGenerated', 'feesGeneratedPercentageChange', '#FF2D55', '#AF52DE', feesGeneratedDomain)}
              </div>
            )}
            {showRelativeAPR && (
              <div className="bg-transparent border border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Relative APR</h3>
                {renderChart(relativeAPRChartType, 'relativeAPR', 'relativeAPRPercentageChange', '#FF9500', '#FF3B30', relativeAPRDomain)}
              </div>
            )}
            {showLiquidityUtilizationRate && (
              <div className="bg-transparent border border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Liquidity Utilization Rate</h3>
                {renderChart(
                  liquidityUtilizationRateChartType,
                  'liquidityUtilizationRate',
                  'liquidityUtilizationRatePercentageChange',
                  '#FF9500',
                  '#FF3B30',
                  [0, 100]
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
