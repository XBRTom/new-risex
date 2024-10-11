import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PoolSummaryCardProps {
  poolPair: string
  poolAddress: string
  totalValueLocked: number
  tradingVolume24h: number
  apr: number
  poolBalanceA: number
  poolBalanceB: number
  assetA: string
  assetB: string
}

const PoolSummaryCard: React.FC<PoolSummaryCardProps> = ({
  poolPair,
  poolAddress,
  totalValueLocked,
  tradingVolume24h,
  apr,
  poolBalanceA,
  poolBalanceB,
  assetA,
  assetB
}) => {
  return (
    <Card className="bg-gray-800 mb-6">
      <CardHeader>
        <CardTitle>{poolPair}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400">Pool Address</p>
            <p className="font-medium break-words">{poolAddress}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Total Value Locked</p>
            <p className="font-medium">${totalValueLocked}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">24h Trading Volume</p>
            <p className="font-medium">${tradingVolume24h}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">APR</p>
            <p className="font-medium">{apr}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Pool Balance ({assetA})</p>
            <p className="font-medium">{poolBalanceA}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Pool Balance ({assetB})</p>
            <p className="font-medium">{poolBalanceB}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default PoolSummaryCard