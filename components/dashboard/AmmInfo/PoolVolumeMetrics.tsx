'use client'

import React, { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { PlusCircle, XCircle } from 'lucide-react'

interface Metric {
  date: string
  totalPoolVolume: string
  feesGenerated: string
  relativeAPR: string
  totalValueLocked: string
}

interface PoolVolumeMetricsProps {
  metrics: Metric[]
}

interface ChartType {
  label: string
  color: string
  type: 'line' | 'bar'
}

type ChartTypes = {
  [key: string]: ChartType
}

const chartTypes: ChartTypes = {
  totalPoolVolume: { label: "Total Pool Volume", color: "hsl(var(--chart-1))", type: "line" },
  feesGenerated: { label: "Fees Generated", color: "hsl(var(--chart-2))", type: "line" },
  relativeAPR: { label: "Relative APR", color: "hsl(var(--chart-3))", type: "line" },
  averageVolume: { label: "Average Volume", color: "hsl(var(--chart-4))", type: "line" },
  volumeGrowth: { label: "Volume Growth (%)", color: "hsl(var(--chart-5))", type: "bar" },
  totalValueLocked: { label: "Total Value Locked", color: "#FFD700", type: "line" }
}

export default function PoolVolumeMetrics({ metrics }: PoolVolumeMetricsProps) {
  const [selectedCharts, setSelectedCharts] = useState<string[]>(["totalPoolVolume", "totalValueLocked"])
  const [chartToAdd, setChartToAdd] = useState<string | null>(null)

  const processedMetrics = useMemo(() => {
    let cumulativeVolume = 0
    let cumulativeDays = 0
    return metrics.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((metric, index, array) => {
        const currentVolume = parseFloat(metric.totalPoolVolume)
        cumulativeVolume += currentVolume
        cumulativeDays += 1
        const previousVolume = index > 0 ? parseFloat(array[index - 1].totalPoolVolume) : currentVolume
        const volumeGrowth = ((currentVolume - previousVolume) / previousVolume) * 100

        return {
          date: new Date(metric.date).toLocaleDateString(),
          totalPoolVolume: currentVolume,
          feesGenerated: parseFloat(metric.feesGenerated),
          relativeAPR: parseFloat(metric.relativeAPR),
          averageVolume: cumulativeVolume / cumulativeDays,
          volumeGrowth: volumeGrowth,
          totalValueLocked: parseFloat(metric.totalValueLocked)
        }
      });
  }, [metrics]);

  const totalCumulatedVolume = processedMetrics[processedMetrics.length - 1]?.totalPoolVolume || 0;
  const averageDailyVolume = totalCumulatedVolume / processedMetrics.length;
  const highestVolumeEntry = processedMetrics.reduce((max, metric) => 
    metric.totalPoolVolume > max.totalPoolVolume ? metric : max,
    processedMetrics[0]
  );
  const latestTVL = processedMetrics[processedMetrics.length - 1]?.totalValueLocked || 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value)
  }

  const handleAddChart = () => {
    if (chartToAdd && !selectedCharts.includes(chartToAdd)) {
      setSelectedCharts([...selectedCharts, chartToAdd])
      setChartToAdd(null)
    }
  }

  const handleRemoveChart = (chart: string) => {
    setSelectedCharts(selectedCharts.filter(c => c !== chart))
  }

  return (
    <Card className="w-full bg-gradient-to-br from-gray-900 to-black border-gray-800 shadow-lg rounded-xl overflow-hidden">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white">Pool Volume Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/4 pr-4">
            <div className="space-y-4 mb-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-400">Total Cumulated Volume</p>
                  <p className="text-lg font-semibold text-white">{formatCurrency(totalCumulatedVolume)}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-400">Average Daily Volume</p>
                  <p className="text-lg font-semibold text-white">{formatCurrency(averageDailyVolume)}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-purple-500 rounded mr-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-400">Highest Volume</p>
                  <p className="text-lg font-semibold text-white">{formatCurrency(highestVolumeEntry.totalPoolVolume)}</p>
                  <p className="text-xs text-gray-500">on {highestVolumeEntry.date}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-400">Latest TVL</p>
                  <p className="text-lg font-semibold text-white">{formatCurrency(latestTVL)}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 mb-4">
              <Select value={chartToAdd || ''} onValueChange={setChartToAdd}>
                <SelectTrigger className="w-[180px] bg-gray-800 text-white border-gray-700">
                  <SelectValue placeholder="Add chart" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white border-gray-700">
                  {Object.entries(chartTypes).map(([key, { label }]) => (
                    <SelectItem key={key} value={key} className="hover:bg-gray-700">
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleAddChart} className="bg-blue-500 hover:bg-blue-600 text-white">
                <PlusCircle className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
            <div className="space-y-2">
              {selectedCharts.map(chart => (
                <div key={chart} className="flex items-center justify-between bg-gray-800 p-2 rounded">
                  <span className="text-white">{chartTypes[chart].label}</span>
                  <Button onClick={() => handleRemoveChart(chart)} variant="ghost" className="text-gray-400 hover:text-white">
                    <XCircle className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full md:w-3/4 mt-4 md:mt-0">
            <ChartContainer
              config={Object.fromEntries(
                selectedCharts.map(chart => [chart, chartTypes[chart]])
              )}
              className="h-[400px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={processedMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" stroke="#ffffff" />
                  <YAxis yAxisId="left" orientation="left" stroke="#ffffff" />
                  <YAxis yAxisId="right" orientation="right" stroke="#ffffff" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  {selectedCharts.map(chart => {
                    const chartConfig = chartTypes[chart]
                    if (chartConfig.type === 'line') {
                      return (
                        <Line
                          key={chart}
                          yAxisId="left"
                          type="monotone"
                          dataKey={chart}
                          stroke={chartConfig.color}
                          strokeWidth={2}
                          dot={false}
                          name={chartConfig.label}
                        />
                      )
                    } else if (chartConfig.type === 'bar') {
                      return (
                        <Bar
                          key={chart}
                          yAxisId="right"
                          dataKey={chart}
                          fill={chartConfig.color}
                          name={chartConfig.label}
                        />
                      )
                    }
                    return null
                  })}
                </ComposedChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}