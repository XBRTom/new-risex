import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowUpRight, ArrowDownRight, Wallet, BarChart3, Percent, Coins, Scale } from "lucide-react";

interface PoolInfoCardProps {
  amountCurrency: string;
  amount2Currency: string;
  ammInfo: {
    account: string;
    trading_fee: number;
  };
  latestMetrics: {
    totalValueLocked: number;
    totalPoolVolume: number;
    relativeAPR: number;
  };
  poolBalance1: number;
  poolBalance2: number;
  currentTokenAmount: number;
}

export default function PoolInfoCard({
  amountCurrency,
  amount2Currency,
  ammInfo,
  latestMetrics,
  poolBalance1,
  poolBalance2,
  currentTokenAmount
}: PoolInfoCardProps) {
  const isPositiveAPR = latestMetrics.relativeAPR >= 0;

  return (
    <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800 shadow-lg rounded-xl overflow-hidden w-full md:w-[480px]">
      <CardHeader className="border-b border-gray-800 pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold text-white">
            {amountCurrency}/{amount2Currency}
          </CardTitle>
          <Badge variant="outline" className="text-emerald-400 border-emerald-400">
            Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Wallet className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-400">Pool Address</span>
            </div>
            <span className="text-sm font-medium text-white">{ammInfo.account.slice(0, 8)}...{ammInfo.account.slice(-8)}</span>
          </div>
          <Separator className="bg-gray-800" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Value Locked</p>
              <p className="text-xl font-bold text-white">${latestMetrics?.totalValueLocked.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">24h Trading Volume</p>
              <p className="text-xl font-bold text-white">${latestMetrics?.totalPoolVolume.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
            </div>
          </div>
          <Separator className="bg-gray-800" />
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Percent className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-400">APR</span>
            </div>
            <div className={`flex items-center ${isPositiveAPR ? 'text-green-400' : 'text-red-400'}`}>
              {isPositiveAPR ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
              <span className="text-lg font-bold">{latestMetrics?.relativeAPR.toFixed(2)}%</span>
            </div>
          </div>
          <Separator className="bg-gray-800" />
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">Trading fees</span>
              <span className="text-sm font-medium text-white">{(ammInfo.trading_fee / 1000).toFixed(2)}%</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">Pool Balance ({amountCurrency})</span>
              <span className="text-sm font-medium text-white">{poolBalance1.toLocaleString(undefined, {minimumFractionDigits: 6, maximumFractionDigits: 6})}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Pool Balance ({amount2Currency})</span>
              <span className="text-sm font-medium text-white">{poolBalance2.toLocaleString(undefined, {minimumFractionDigits: 6, maximumFractionDigits: 6})}</span>
            </div>
          </div>
          <Separator className="bg-gray-800" />
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Coins className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-400">Your LP Tokens</span>
            </div>
            <span className="text-lg font-bold text-white">{currentTokenAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}