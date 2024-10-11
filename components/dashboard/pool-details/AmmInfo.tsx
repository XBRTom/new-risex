'use client'

import React, { useEffect, useState } from 'react'
import GlobalPoolMetricsTable from './pool-details/GlobalPoolMetricsTable'
import GlobalPoolMetricsChart from './pool-details/GlobalPoolMetricsChart'
import apiClient from '@/libs/api'
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Package2, LayoutDashboard, Wallet, History, LogOut, Settings, File, Database, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useWallet } from '@/providers/Wallet'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import VoteSlotsGauge from './pool-details/VoteSlotsGauge'
import AmmInfoTable from './pool-details/AmmInfoTable'
import WalletPoolHoldingTable from './pool-details/WalletPoolHoldingTable'
import TransactionTable from './pool-details/TransactionTable'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const timeRanges = [
  { value: '15days', label: 'Last 15 Days' },
  { value: 'month', label: 'Current Month' },
  { value: '3months', label: 'Last 3 Months' },
  { value: 'alltime', label: 'All Time' },
]

interface LatestMetrics {
  totalValueLocked: number
  totalPoolVolume: number
  relativeAPR: number
  feesGenerated: number
}

export default function Component({ account, ammInfo }: { account: string, ammInfo: any }) {
  const [loading, setLoading] = useState(true)
  const [latestMetrics, setLatestMetrics] = useState<LatestMetrics | null>(null)
  const [historicalMetrics, setHistoricalMetrics] = useState<any[]>([])
  const [filteredMetrics, setFilteredMetrics] = useState<any[]>([])
  const [timeRange, setTimeRange] = useState('15days')
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState('addLiquidity')
  const [currencyAmount1, setCurrencyAmount1] = useState('')
  const [currencyAmount2, setCurrencyAmount2] = useState('')
  const [tradingFeeVote, setTradingFeeVote] = useState('')
  const { lpTokenDetails, xumm, fetchLpTokenDetails, transactions } = useWallet()
  const [currentTokenAmount, setCurrentTokenAmount] = useState('-')
  const [transactionStatus, setTransactionStatus] = useState('')
  const [baseExchangeRate, setBaseExchangeRate] = useState<number | null>(null)
  const [counterExchangeRate, setCounterExchangeRate] = useState<number | null>(null)
  const [baseCurrency, setBaseCurrency] = useState<string | null>(null)
  const [counterCurrency, setCounterCurrency] = useState<string | null>(null)

  useEffect(() => {
    const fetchAmmInfo = async () => {
      try {
        console.log(`Fetching latest metrics for poolId: ${ammInfo.poolId}`)
        const metricsResponse: any = await apiClient.get(`/latest-metrics?poolId=${ammInfo.poolId}`)
        console.log('Fetched Latest Metrics:', metricsResponse)

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

        console.log(`Fetching historical metrics for poolId: ${ammInfo.poolId}`)
        const historicalResponse: any = await apiClient.get(`/historical-metrics?poolId=${ammInfo.poolId}`)
        console.log('Fetched Historical Metrics:', historicalResponse)
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
      const now = new Date()
      let filteredData: any[] = []

      switch (timeRange) {
        case '15days':
          filteredData = historicalMetrics.filter((metric) => {
            const metricDate = new Date(metric.date)
            const daysDifference = Math.floor((now.getTime() - metricDate.getTime()) / (1000 * 60 * 60 * 24))
            return daysDifference <= 15
          })
          break
        case 'month':
          filteredData = historicalMetrics.filter((metric) => {
            const metricDate = new Date(metric.date)
            return metricDate.getMonth() === now.getMonth() && metricDate.getFullYear() === now.getFullYear()
          })
          break
        case '3months':
        case 'alltime':
          const metricsByMonth: { [key: string]: any } = {}

          historicalMetrics.forEach((metric) => {
            const metricDate = new Date(metric.date)
            const yearMonth = `${metricDate.getFullYear()}-${metricDate.getMonth() + 1}`

            if (!metricsByMonth[yearMonth]) {
              metricsByMonth[yearMonth] = {
                totalValueLocked: 0,
                totalPoolVolume: 0,
                poolYield: 0,
                relativeAPR: 0,
                feesGenerated: 0,
                count: 0,
              }
            }

            metricsByMonth[yearMonth].totalValueLocked += parseFloat(metric.totalValueLocked)
            metricsByMonth[yearMonth].totalPoolVolume += parseFloat(metric.totalPoolVolume)
            metricsByMonth[yearMonth].poolYield += parseFloat(metric.poolYield)
            metricsByMonth[yearMonth].relativeAPR += parseFloat(metric.relativeAPR)
            metricsByMonth[yearMonth].feesGenerated += parseFloat(metric.feesGenerated)
            metricsByMonth[yearMonth].count += 1
          })

          for (let [key, value] of Object.entries(metricsByMonth)) {
            const avgTotalValueLocked = value.totalValueLocked / value.count
            const avgTotalPoolVolume = value.totalPoolVolume / value.count
            const avgPoolYield = value.poolYield / value.count
            const avgRelativeAPR = value.relativeAPR / value.count
            const totalFeesGenerated = value.feesGenerated

            filteredData.push({
              date: `${key}-01`,
              totalValueLocked: avgTotalValueLocked,
              totalPoolVolume: avgTotalPoolVolume,
              poolYield: avgPoolYield,
              relativeAPR: avgRelativeAPR,
              feesGenerated: totalFeesGenerated,
            })
          }

          filteredData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          if (timeRange === '3months') {
            filteredData = filteredData.slice(-3)
          }
          break
        default:
          break
      }

      setFilteredMetrics(filteredData)
    }
  }, [timeRange, historicalMetrics])

  useEffect(() => {
    const updateCurrentTokenAmount = () => {
      let poolDetails
      if (lpTokenDetails) {
        poolDetails = lpTokenDetails.find(detail => detail.poolAddress === ammInfo.poolId)
      }
      if (poolDetails) {
        setCurrentTokenAmount(poolDetails.current)
      } else {
        setCurrentTokenAmount('-')
      }
    }

    updateCurrentTokenAmount()
  }, [ammInfo.poolId, lpTokenDetails])

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const { exchangeRates } = await apiClient.get('/fetch-exchange-rates-from-db')
        console.log('exchangeRates:', exchangeRates)

        const base = ammInfo.amount_currency || 'XRP'
        const counter = ammInfo.amount2_currency || 'XRP'

        const baseCurrency = base === 'XRP' ? 'XRP' : (base.includes('_') ? base.split('_')[1] : base)
        const baseIssuer = base === 'XRP' ? null : (base.includes('_') ? base.split('_')[0] : null)

        const counterCurrency = counter === 'XRP' ? 'XRP' : (counter.includes('_') ? counter.split('_')[1] : counter)
        const counterIssuer = counter === 'XRP' ? null : (counter.includes('_') ? counter.split('_')[0] : null)

        const baseRate = baseIssuer && exchangeRates[baseIssuer]
          ? exchangeRates[baseIssuer][baseCurrency]
          : (baseCurrency === 'XRP' ? 1 : null)
        
        const counterRate = counterIssuer && exchangeRates[counterIssuer]
          ? exchangeRates[counterIssuer][counterCurrency]
          : (counterCurrency === 'XRP' ? 1 : null)

        setBaseExchangeRate(baseRate || null)
        setCounterExchangeRate(counterRate || null)
        setBaseCurrency(baseCurrency)
        setCounterCurrency(counterCurrency)
      } catch (error) {
        console.error('Error fetching exchange rates:', error)
      }
    }

    fetchExchangeRates()
  }, [ammInfo.amount_currency, ammInfo.amount2_currency])

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

  const handleAddLiquidity = async () => {
    if (!account) {
      setTransactionStatus('Account information not available')
      return
    }

    try {
      setTransactionStatus('Creating add liquidity transaction...')
      const formattedAmount1 = convertToProperFormat(currencyAmount1, ammInfo.amount_currency)
      const formattedAmount2 = convertToProperFormat(currencyAmount2, ammInfo.amount2_currency)

      const payload = {
        TransactionType: 'AMMDeposit',
        Account: account,
        Amount: formattedAmount1,
        Amount2: {
          currency: ammInfo.amount2_currency,
          value: formattedAmount2,
          issuer: ammInfo.amount2_issuer,
        },
        Asset: {
          currency: ammInfo.amount_currency,
          issuer: ammInfo.amount_currency === 'XRP' ? undefined : ammInfo.amount_issuer,
        },
        Asset2: {
          currency: ammInfo.amount2_currency,
          issuer: ammInfo.amount2_issuer,
        },
        Flags: 1048576,
      }

      const createdPayload = await xumm.payload.createAndSubscribe(payload, event => {
        if (event.data.signed) {
          setTransactionStatus('Liquidity added successfully!')
          setCurrencyAmount1('')
          setCurrencyAmount2('')
          fetchLpTokenDetails()
          return true
        }
        return false
      })

      const payloadUUID = createdPayload?.created?.uuid

      if (!payloadUUID) {
        throw new Error('Failed to create payload')
      }

      const payloadURL = `https://xumm.app/sign/${payloadUUID}`
      const newPopup = window.open(payloadURL, 'XummSign', 'width=500,height=600')

      if (!newPopup) {
        throw new Error('Failed to open popup window')
      }

      const interval = setInterval(async () => {
        if (newPopup && newPopup.closed) {
          clearInterval(interval)
          const resolvedPayload = await createdPayload.resolved
          if (resolvedPayload.signed) {
            setTransactionStatus('Liquidity added successfully!')
            setCurrencyAmount1('')
            setCurrencyAmount2('')
            fetchLpTokenDetails()
          } else if (transactionStatus !== 'Liquidity added successfully!') {
            setTransactionStatus('Transaction was not signed.')
          }
        }
      }, 1000)
    } catch (error) {
      setTransactionStatus(`Failed to add liquidity: ${error.message}`)
    }
  }

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

    if (currentTokenAmount ===   '-' || lpTokenValue === 0) {
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
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar */}
      <div className="w-16 md:w-64 bg-gray-900 border-r border-gray-800 flex flex-col py-4 pb-12">
        <div className="flex-grow space-y-2 px-2 md:px-4">
          <Button variant="ghost" className="w-full justify-start p-2 md:p-3">
            <LayoutDashboard className="h-5 w-5 md:mr-2" />
            <span className="hidden md:inline">Overview</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start p-2 md:p-3">
            <Package2 className="h-5 w-5 md:mr-2" />
            <span className="hidden md:inline">Pools</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start p-2 md:p-3">
            <Wallet className="h-5 w-5 md:mr-2" />
            <span className="hidden md:inline">Holdings</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start p-2 md:p-3">
            <History className="h-5 w-5 md:mr-2" />
            <span className="hidden md:inline">Transactions</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start p-2 md:p-3">
            <Database className="h-5 w-5 md:mr-2" />
            <span className="hidden md:inline">Staking</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start p-2 md:p-3">
            <Settings className="h-5 w-5 md:mr-2" />
            <span className="hidden md:inline">APIs</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start p-2 md:p-3">
            <File className="h-5 w-5 md:mr-2" />
            <span className="hidden md:inline">Documentation</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start p-2 md:p-3">
            <User className="h-5 w-5 md:mr-2" />
            <span className="hidden md:inline">Account</span>
          </Button>
        </div>
        <div className="mt-auto px-2 md:px-4">
          <Separator className="my-2" />
          <Button variant="ghost" className="w-full justify-start p-2 md:p-3">
            <LogOut className="h-5 w-5 md:mr-2" />
            <span className="hidden md:inline">Logout</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="bg-gray-800">
                <CardHeader>
                  <CardTitle>Total Value Locked</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    ${latestMetrics?.totalValueLocked.toFixed(2) || '0.00'}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-gray-800">
                <CardHeader>
                  <CardTitle>24h Volume</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    ${latestMetrics?.totalPoolVolume.toFixed(2) || '0.00'}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-gray-800">
                <CardHeader>
                  <CardTitle>APR</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {latestMetrics?.relativeAPR.toFixed(2) || '0.00'}%
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-800 mb-6">
              <CardHeader>
                <CardTitle>Pool Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Pool Address</p>
                    <p className="font-medium">{ammInfo.account}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Trading Fee</p>
                    <p className="font-medium">{(ammInfo.trading_fee / 1000).toFixed(2)}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Pool Balance ({amountCurrency})</p>
                    <p className="font-medium">{poolBalance1.toFixed(6)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Pool Balance ({amount2Currency})</p>
                    <p className="font-medium">{poolBalance2.toFixed(6)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Your LP Tokens</p>
                    <p className="font-medium">{currentTokenAmount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AMM Actions */}
            <Card className="bg-gray-800 mb-6">
              <CardHeader>
                <CardTitle>AMM Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  <div className="flex space-x-4">
                    <Button onClick={() => handleModeChange('addLiquidity')} variant={mode === 'addLiquidity' ? 'default' : 'outline'}>
                      Add Liquidity
                    </Button>
                    <Button onClick={() => handleModeChange('withdrawLiquidity')} variant={mode === 'withdrawLiquidity' ? 'default' : 'outline'}>
                      Withdraw Liquidity
                    </Button>
                    <Button onClick={() => handleModeChange('vote')} variant={mode === 'vote' ? 'default' : 'outline'}>
                      Vote
                    </Button>
                  </div>
                  {mode === 'addLiquidity' && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="amount1">{amountCurrency} Amount</Label>
                        <Input
                          id="amount1"
                          type="text"
                          value={currencyAmount1}
                          onChange={(e) => setCurrencyAmount1(e.target.value)}
                          placeholder={`Enter ${amountCurrency} Amount`}
                        />
                      </div>
                      <div>
                        <Label htmlFor="amount2">{amount2Currency} Amount</Label>
                        <Input
                          id="amount2"
                          type="text"
                          value={currencyAmount2}
                          onChange={(e) => setCurrencyAmount2(e.target.value)}
                          placeholder={`Enter ${amount2Currency} Amount`}
                        />
                      </div>
                      <Button onClick={handleAddLiquidity} className="w-full">
                        Add Liquidity
                      </Button>
                    </div>
                  )}
                  {mode === 'withdrawLiquidity' && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="withdrawAmount1">{amountCurrency} Amount to Withdraw</Label>
                        <Input
                          id="withdrawAmount1"
                          type="text"
                          value={currencyAmount1}
                          onChange={(e) => setCurrencyAmount1(e.target.value)}
                          placeholder={`Enter ${amountCurrency} Amount to Withdraw`}
                        />
                      </div>
                      <div>
                        <Label htmlFor="withdrawAmount2">{amount2Currency} Amount to Withdraw</Label>
                        <Input
                          id="withdrawAmount2"
                          type="text"
                          value={currencyAmount2}
                          onChange={(e) => setCurrencyAmount2(e.target.value)}
                          placeholder={`Enter ${amount2Currency} Amount to Withdraw`}
                        />
                      </div>
                      <Button onClick={handleWithdraw} className="w-full">
                        Withdraw Liquidity
                      </Button>
                    </div>
                  )}
                  {mode === 'vote' && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="tradingFeeVote">Trading Fee Vote</Label>
                        <Input
                          id="tradingFeeVote"
                          type="text"
                          value={tradingFeeVote}
                          onChange={(e) => setTradingFeeVote(e.target.value)}
                          placeholder="Enter Your Vote for Trading Fee"
                        />
                      </div>
                      <Button onClick={handleVote} className="w-full">
                        Vote
                      </Button>
                    </div>
                  )}
                  {transactionStatus && (
                    <p className="text-sm text-yellow-500">{transactionStatus}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Wallet Pool Holdings */}
            <Card className="bg-gray-800 mb-6">
              <CardHeader>
                <CardTitle>Your Holdings</CardTitle>
              </CardHeader>
              <CardContent>
                <WalletPoolHoldingTable holdings={holdings} />
              </CardContent>
            </Card>

            {/* Vote Slots */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card className="bg-gray-800">
                <CardHeader>
                  <CardTitle>Vote Slots Gauge</CardTitle>
                </CardHeader>
                <CardContent>
                  <VoteSlotsGauge voteSlotsData={ammInfo.pool.voteSlots} />
                </CardContent>
              </Card>
              <Card className="bg-gray-800">
                <CardHeader>
                  <CardTitle>Vote Slots Table</CardTitle>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>
            </div>

            {/* Transaction Table */}
            <Card className="bg-gray-800 mb-6">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <TransactionTable transactions={transactions} />
              </CardContent>
            </Card>

            <div className="mt-6 mb-4">
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
            </div>
            <GlobalPoolMetricsTable metrics={filteredMetrics} timeRange={timeRange} />
            <GlobalPoolMetricsChart metrics={filteredMetrics} />
          </div>
        </main>
      </div>
    </div>
  )
}