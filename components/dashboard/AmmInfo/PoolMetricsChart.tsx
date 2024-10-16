'use client'

import React, { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, ComposedChart, Tooltip } from 'recharts'
import { ChartContainer } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { PlusCircle, XCircle } from 'lucide-react'

interface Metric {
  date: string
  totalPoolVolume: string
  feesGenerated: string
  relativeAPR: string
  totalValueLocked: string
  yield: string
}

interface PoolMetricsChartProps {
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
  totalPoolVolume: { label: "Total Pool Volume", color: "#3b82f6", type: "bar" },
  feesGenerated: { label: "Fees Generated", color: "#10b981", type: "line" },
  relativeAPR: { label: "Relative APR", color: "#f59e0b", type: "line" },
  averageVolume: { label: "Average Volume", color: "#6366f1", type: "line" },
  volumeGrowth: { label: "Volume Growth (%)", color: "#ef4444", type: "bar" },
  totalValueLocked: { label: "Total Value Locked", color: "#8b5cf6", type: "line" },
  yield: { label: "Pool Yield", color: "#ec4899", type: "line" }
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 p-4 rounded shadow-lg border border-gray-700">
        <p className="text-white font-bold mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {entry.name}: {entry.name === "Pool Yield" 
              ? `${entry.value?.toFixed(2) ?? 'N/A'}%` 
              : entry.value?.toLocaleString(undefined, { maximumFractionDigits: 2 }) ?? 'N/A'
            }
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function PoolMetricsChart({ metrics }: PoolMetricsChartProps) {
  const [selectedCharts, setSelectedCharts] = useState<string[]>(["yield", "totalValueLocked"])
  const [chartToAdd, setChartToAdd] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const processedMetrics = useMemo(() => {
    try {
      return metrics.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map((metric) => {
          const yieldValue = metric.yield ? parseFloat(metric.yield) : null
          if (yieldValue === null) {
            console.warn(`Missing yield value for date ${metric.date}`)
          } else if (isNaN(yieldValue)) {
            console.error(`Invalid yield value for date ${metric.date}: ${metric.yield}`)
          }
          return {
            date: new Date(metric.date).toLocaleDateString(),
            poolyield: parseFloat(metric.yield),
            totalPoolVolume: parseFloat(metric.totalPoolVolume),
            feesGenerated: parseFloat(metric.feesGenerated),
            relativeAPR: parseFloat(metric.relativeAPR),
            totalValueLocked: parseFloat(metric.totalValueLocked),
            averageVolume: parseFloat(metric.totalPoolVolume) / (new Date(metric.date).getDate()),
            volumeGrowth: 0 // This would need to be calculated if required
          }
        });
    } catch (err) {
      setError(`Error processing metrics: ${err instanceof Error ? err.message : String(err)}`)
      return []
    }
  }, [metrics]);

  const handleAddChart = () => {
    if (chartToAdd && !selectedCharts.includes(chartToAdd)) {
      setSelectedCharts([...selectedCharts, chartToAdd])
      setChartToAdd(null)
    }
  }

  const handleRemoveChart = (chart: string) => {
    setSelectedCharts(selectedCharts.filter(c => c !== chart))
  }

  const chartConfig = useMemo(() => {
    return Object.fromEntries(
      selectedCharts.map(chart => [chart, chartTypes[chart]])
    )
  }, [selectedCharts])

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <Card className="w-full bg-gradient-to-br from-gray-900 to-black border-gray-800 shadow-lg rounded-xl overflow-hidden">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white">Pool Yield Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-3/4 mt-4 md:mt-0">
            <ChartContainer config={chartConfig} className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={processedMetrics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#ffffff" />
                  <YAxis yAxisId="left" orientation="left" stroke="#ffffff" />
                  <YAxis yAxisId="right" orientation="right" stroke="#ffffff" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  {selectedCharts.map(chart => {
                    const chartConfig = chartTypes[chart]
                    if (chartConfig.type === 'line') {
                      return (
                        <Line
                          key={chart}
                          yAxisId={chart === "yield" ? "right" : "left"}
                          type="monotone"
                          dataKey={chart}
                          stroke={chartConfig.color}
                          strokeWidth={2}
                          dot={false}
                          name={chartConfig.label}
                          connectNulls={true}
                        />
                      )
                    } else if (chartConfig.type === 'bar') {
                      return (
                        <Bar
                          key={chart}
                          yAxisId="left"
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
          <div className="w-full md:w-1/4 pr-4">
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
        </div>
      </CardContent>
    </Card>
  )
}