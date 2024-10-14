'use client'

import React, { useEffect, useState } from 'react'
import PoolInfoCard from './AmmInfo/PoolInfoCard'
import AMMActions from './AmmInfo/AMMActions'
import GlobalPoolMetricsTable from './AmmInfo/GlobalPoolMetricsTable'
import PoolVolumeMetrics from './AmmInfo/PoolVolumeMetrics'
import GlobalPoolMetricsChart from './pool-details/GlobalPoolMetricsChart'
import apiClient from '@/libs/api'
// import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useWallet } from '@/providers/Wallet'
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
import VoteSlotsGauge from './pool-details/VoteSlotsGauge'
import AmmInfoTable from './pool-details/AmmInfoTable'
import WalletPoolHoldingTable from './pool-details/WalletPoolHoldingTable'
// import TransactionTable from './pool-details/TransactionTable'
import DashboardLayout from './Layout/DashboardLayout'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// const timeRanges = [
//   { value: '15days', label: 'Last 15 Days' },
//   { value: 'month', label: 'Current Month' },
//   { value: '3months', label: 'Last 3 Months' },
//   { value: 'alltime', label: 'All Time' },
// ]

interface LatestMetrics {
  totalValueLocked: number
  totalPoolVolume: number
  relativeAPR: number
  feesGenerated: number
}

interface ExchangeRatesResponse {
  exchangeRates: any; // Replace `any` with the actual type if available
}

export default function Component({ account, ammInfo }: { account: string, ammInfo: any }) {
  const [loading, setLoading] = useState(true)
  const [latestMetrics, setLatestMetrics] = useState<LatestMetrics | null>(null)
  const [historicalMetrics, setHistoricalMetrics] = useState<any[]>([])
  const [filteredMetrics, setFilteredMetrics] = useState<any[]>([])
  const [timeRange, setTimeRange] = useState('alltime')
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState('addLiquidity')
  const [currencyAmount1, setCurrencyAmount1] = useState('')
  const [currencyAmount2, setCurrencyAmount2] = useState('')
  const [tradingFeeVote, setTradingFeeVote] = useState('')
  // const { lpTokenDetails, xumm, fetchLpTokenDetails, transactions } = useWallet()
  const [currentTokenAmount, setCurrentTokenAmount] = useState('-')
  const [transactionStatus, setTransactionStatus] = useState('')
  const [baseExchangeRate, setBaseExchangeRate] = useState<number | null>(null)
  const [counterExchangeRate, setCounterExchangeRate] = useState<number | null>(null)
  const [baseCurrency, setBaseCurrency] = useState<string | null>(null)
  const [counterCurrency, setCounterCurrency] = useState<string | null>(null)

  useEffect(() => {
    const fetchAmmInfo = async () => {
      try {
        const metricsResponse: any = await apiClient.get(`/latest-metrics?poolId=${ammInfo.poolId}`)
        const currentPoolMetrics = metricsResponse.find((metric: any) => metric.poolId === ammInfo.poolId)
        if (currentPoolMetrics) {
          setLatestMetrics({
            totalValueLocked: parseFloat(currentPoolMetrics.totalValueLocked) || 0,
            totalPoolVolume: parseFloat(currentPoolMetrics.totalPoolVolume) || 0,
            relativeAPR: parseFloat(currentPoolMetrics.relativeAPR) || 0,
            feesGenerated: parseFloat(currentPoolMetrics.feesGenerated) || 0,
          })
        } else {
          console.error('No metrics found for the current poolId')
          setLatestMetrics(null)
        }

        const historicalResponse: any = await apiClient.get(`/historical-metrics?poolId=${ammInfo.poolId}`)
        console.log('Historical Metrics:', historicalResponse) // Log the historical metrics response
        setHistoricalMetrics(historicalResponse)

        setLoading(false)
      } catch (err) {
        console.error('Error fetching AMM info or latest metrics:', err)
        setError('Failed to fetch AMM info')
        setLoading(false)
      }
    }

    if (account) {
      fetchAmmInfo()
    }
  }, [account, ammInfo.poolId])

  useEffect(() => {
    if (historicalMetrics.length > 0) {
      setFilteredMetrics(filterMetricsByTimeRange(historicalMetrics, timeRange))
    }
  }, [timeRange, historicalMetrics])

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await apiClient.get(`/fetch-exchange-rates-from-db`)
        if (response && response.data) {
          const { exchangeRates } = response.data
          const base = ammInfo.amount_currency || 'XRP'
          const counter = ammInfo.amount2_currency || 'XRP'

          const baseCurrency = base === 'XRP' ? 'XRP' : (base.includes('_') ? base.split('_')[1] : base)
          const baseIssuer = base === 'XRP' ? null : (base.includes('_') ? base.split('_')[0] : null)

          const counterCurrency = counter === 'XRP' ? 'XRP' : (counter.includes('_') ? counter.split('_')[1] : counter)
          const counterIssuer = counter === 'XRP' ? null : (counter.includes('_') ? counter.split('_')[0] : null)

          const baseRate = baseIssuer && exchangeRates && exchangeRates[baseIssuer]
            ? exchangeRates[baseIssuer][baseCurrency]
            : (baseCurrency === 'XRP' ? 1 : null)

          const counterRate = counterIssuer && exchangeRates && exchangeRates[counterIssuer]
            ? exchangeRates[counterIssuer][counterCurrency]
            : (counterCurrency === 'XRP' ? 1 : null)

          setBaseExchangeRate(baseRate || null)
          setCounterExchangeRate(counterRate || null)
          setBaseCurrency(baseCurrency)
          setCounterCurrency(counterCurrency)
        } else {
          console.error('Error: Response data is undefined or invalid.')
        }
      } catch (error) {
        console.error('Error fetching exchange rates:', error)
      }
    }

    fetchExchangeRates()
  }, [ammInfo.amount_currency, ammInfo.amount2_currency])

  const filterMetricsByTimeRange = (metrics: any[], range: string) => {
    const now = new Date()
    let filteredData: any[] = []

    switch (range) {
      case '7days':
        filteredData = metrics.filter((metric) => {
          const metricDate = new Date(metric.date)
          const daysDifference = Math.floor((now.getTime() - metricDate.getTime()) / (1000 * 60 * 60 * 24))
          return daysDifference <= 7
        })
        break
      case '15days':
        filteredData = metrics.filter((metric) => {
          const metricDate = new Date(metric.date)
          const daysDifference = Math.floor((now.getTime() - metricDate.getTime()) / (1000 * 60 * 60 * 24))
          return daysDifference <= 15
        })
        break
      case 'month':
        filteredData = metrics.filter((metric) => {
          const metricDate = new Date(metric.date)
          return metricDate.getMonth() === now.getMonth() && metricDate.getFullYear() === now.getFullYear()
        })
        break
      case '3months':
        filteredData = metrics.filter((metric) => {
          const metricDate = new Date(metric.date)
          const threeMonthsAgo = new Date()
          threeMonthsAgo.setMonth(now.getMonth() - 3)
          return metricDate >= threeMonthsAgo && metricDate <= now
        })
        break
      case '6months':
        filteredData = metrics.filter((metric) => {
          const metricDate = new Date(metric.date)
          const sixMonthsAgo = new Date()
          sixMonthsAgo.setMonth(now.getMonth() - 6)
          return metricDate >= sixMonthsAgo && metricDate <= now
        })
        break
      case 'year':
        filteredData = metrics.filter((metric) => {
          const metricDate = new Date(metric.date)
          const oneYearAgo = new Date()
          oneYearAgo.setFullYear(now.getFullYear() - 1)
          return metricDate >= oneYearAgo && metricDate <= now
        })
        break
      case 'alltime':
        filteredData = metrics
        break
      default:
        break
    }

    return filteredData
}

  // const aggregateMetricsByMonth = (metrics: any[]) => {
  //   const metricsByMonth: { [key: string]: any } = {}

  //   metrics.forEach((metric) => {
  //     const metricDate = new Date(metric.date)
  //     const yearMonth = `${metricDate.getFullYear()}-${metricDate.getMonth() + 1}`

  //     if (!metricsByMonth[yearMonth]) {
  //       metricsByMonth[yearMonth] = {
  //         totalValueLocked: 0,
  //         totalPoolVolume: 0,
  //         poolYield: 0,
  //         relativeAPR: 0,
  //         feesGenerated: 0,
  //         count: 0,
  //       }
  //     }

  //     metricsByMonth[yearMonth].totalValueLocked += parseFloat(metric.totalValueLocked)
  //     metricsByMonth[yearMonth].totalPoolVolume += parseFloat(metric.totalPoolVolume)
  //     metricsByMonth[yearMonth].poolYield += parseFloat(metric.poolYield)
  //     metricsByMonth[yearMonth].relativeAPR += parseFloat(metric.relativeAPR)
  //     metricsByMonth[yearMonth].feesGenerated += parseFloat(metric.feesGenerated)
  //     metricsByMonth[yearMonth].count += 1
  //   })

  //   return Object.entries(metricsByMonth).map(([key, value]) => ({
  //     date: `${key}-01`,
  //     totalValueLocked: value.totalValueLocked / value.count,
  //     totalPoolVolume: value.totalPoolVolume / value.count,
  //     poolYield: value.poolYield / value.count,
  //     relativeAPR: value.relativeAPR / value.count,
  //     feesGenerated: value.feesGenerated,
  //   })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  // }

  const handleModeChange = (newMode: string) => {
    setMode(newMode)
    setCurrencyAmount1('')
    setCurrencyAmount2('')
    setTradingFeeVote('')
    setTransactionStatus('')
  }

  const convertToProperFormat = (amount: string, currency: string) => {
    if (currency === 'XRP') {
      return (parseFloat(amount) * 1000000).toString()
    }
    return amount
  }

  // const handleAddLiquidity = async () => {
  //   // Implementation commented out
  // }

  const handleWithdraw = async () => {
    // Implement withdraw logic similar to handleAddLiquidity
    setTransactionStatus('Withdraw functionality not implemented yet')
  }

  const handleVote = () => {
    // Implement vote logic
    setTransactionStatus('Voting functionality not implemented yet')
  }

  if (loading) {
    return <div className="text-white text-sm">Loading...</div>
  }

  if (error) {
    return <div className="text-red-500 text-sm">{error}</div>
  }

  if (!ammInfo) {
    return <div className="text-white text-sm">No AMM info available</div>
  }

  const getAmountValue = (amount: number) => {
    if (typeof amount === 'number') {
      return amount / 1_000_000
    }
    return 0
  }

  const poolBalance1 = getAmountValue(ammInfo.amount)
  const poolBalance2 = ammInfo.amount2_value

  const amountCurrency = ammInfo.amount_currency || 'XRP'
  const amount2Currency = ammInfo.amount2_currency

  const calculateYourAssets = () => {
    const lpTokenValue = ammInfo.lpToken?.length > 0 ? ammInfo.lpToken[0].value : 0

    if (currentTokenAmount === '-' || lpTokenValue === 0) {
      return { asset1: '-', asset2: '-' }
    }

    const yourAsset1Share = (parseFloat(currentTokenAmount) / lpTokenValue) * poolBalance1
    const yourAsset2Share = (parseFloat(currentTokenAmount) / lpTokenValue) * poolBalance2

    return { asset1: yourAsset1Share, asset2: yourAsset2Share }
  }

  const { asset1: yourAsset1Share, asset2: yourAsset2Share } = calculateYourAssets()

  const holdings = [
    { description: 'Number of LP Tokens', value: currentTokenAmount },
    { description: `Asset1 Share (${amountCurrency})`, value: `${yourAsset1Share} ${amountCurrency}` },
    { description: `Asset2 Share (${amount2Currency})`, value: `${yourAsset2Share} ${amount2Currency}` },
  ]

  return (
    <DashboardLayout>
      <div className="flex h-screen bg-black text-white">
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4 border-b border-gray-800">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/liquidity">Liquidity Pools</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
            <div className="max-w-full mx-auto px-4 md:px-6 lg:px-8">
              <div className="flex flex-wrap gap-4 mb-6">
                <PoolInfoCard
                  amountCurrency={amountCurrency}
                  amount2Currency={amount2Currency}
                  ammInfo={ammInfo}
                  latestMetrics={latestMetrics || {
                    totalValueLocked: 0,
                    totalPoolVolume: 0,
                    relativeAPR: 0,
                    feesGenerated: 0,
                  }}
                  poolBalance1={poolBalance1}
                  poolBalance2={poolBalance2}
                  currentTokenAmount={0}
                  baseCurrency={baseCurrency}
                  counterCurrency={counterCurrency}
                  baseExchangeRate={baseExchangeRate}
                  counterExchangeRate={counterExchangeRate}
                />
                <AMMActions
                  amountCurrency={amountCurrency}
                  amount2Currency={amount2Currency}
                  handleAddLiquidity={() => {}}
                  handleWithdraw={handleWithdraw}
                  handleVote={handleVote}
                  currencyAmount1={currencyAmount1}
                  currencyAmount2={currencyAmount2}
                  
                  tradingFeeVote={tradingFeeVote}
                  setCurrencyAmount1={setCurrencyAmount1}
                  setCurrencyAmount2={setCurrencyAmount2}
                  setTradingFeeVote={setTradingFeeVote}
                  transactionStatus={transactionStatus}
                />
                <Card className="bg-black mb-6 w-full md:w-1/4">
                  <CardHeader>
                    <CardTitle>Your Holdings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <WalletPoolHoldingTable holdings={holdings} />
                  </CardContent>
                </Card>
                <div className="bg-black mb-6 w-full md:w-1/3">
                  <VoteSlotsGauge voteSlotsData={ammInfo.pool.voteSlots} />
                </div>
                <div className="bg-black mb-6 w-full md:w-1/3">
                  <p>Vote Slots Table</p>
                  <AmmInfoTable 
                    headers={[
                      { key: 'account', label: 'Account' },
                      { key: 'trading_fee', label: 'Trading Fee' },
                      { key: 'vote_weight', label: 'Vote Weight' },
                    ]} 
                    data={ammInfo.pool.voteSlots.map((vote: any) => ({
                      account: vote.account,
                      trading_fee: `${vote.tradingFee / 1000}%`,
                      vote_weight: vote.voteWeight,
                    }))}
                  />
                </div>
                <Card className="bg-black mb-6 w-full md:w-1/4">
                  <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* <TransactionTable transactions={transactions} /> */}
                  </CardContent>
                </Card>
              </div>
              {/* <div className="mt-6 mb-4">
                <Label htmlFor="timeRange" className="mr-2">
                  Select Time Range:
                </Label>
                <select
                  id="timeRange"
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="bg-gray-800 text-white p-2 rounded"
                >
                  {timeRanges.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div> */}
              <div className="mt-6 mb-4">
                <PoolVolumeMetrics metrics={historicalMetrics} />
              </div>
              <GlobalPoolMetricsTable metrics={filteredMetrics} initialTimeRange={timeRange} />
              <GlobalPoolMetricsChart metrics={filteredMetrics} />
            </div>
          </main>
        </div>
      </div>
    </DashboardLayout>
  )
}