import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowUpRight, ArrowDownRight, Wallet, BarChart3, Percent, Coins, Info, ArrowLeftRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PoolInfoCardProps {
  amountCurrency: string;
  amount2Currency: string;
  ammInfo: {
    account: string;
    pool: {
      tradingFee: number;
      asset_currency: number;
      asset2_currency: number;
      lastRate1: number;
      lastRate2: number;
    };
  };
  latestMetrics: {
    totalValueLocked: number;
    totalPoolVolume: number;
    relativeAPR: number;
  };
  poolBalance1: number;
  poolBalance2: number;
  currentTokenAmount: number;
  baseCurrency: string | null;
  counterCurrency: string | null;
  baseExchangeRate: number | null;
  counterExchangeRate: number | null;
}

const convertTradingFeeToPercentage = (tradingFee: number): string => {
  return (tradingFee / 1000).toFixed(2) + '%';
};

const AssetBalanceBar: React.FC<{ balance1: number; balance2: number; currency1: string; currency2: string }> = ({ balance1, balance2, currency1, currency2 }) => {
  const total = balance1 + balance2;
  const percentage1 = (balance1 / total) * 100;
  const percentage2 = 100 - percentage1;

  return (
    <div className="mt-4">
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>{currency1}</span>
        <span>{currency2}</span>
      </div>
      <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-green-500"
          style={{ width: `${percentage1}%` }}
          role="progressbar"
          aria-valuenow={percentage1}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span className="sr-only">{`${percentage1.toFixed(2)}% ${currency1}`}</span>
        </div>
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{percentage1.toFixed(2)}%</span>
        <span>{percentage2.toFixed(2)}%</span>
      </div>
    </div>
  );
};

export default function Component({
  amountCurrency,
  amount2Currency,
  ammInfo,
  latestMetrics,
  poolBalance1,
  poolBalance2,
  currentTokenAmount,
  baseCurrency,
  counterCurrency,
  baseExchangeRate,
  counterExchangeRate
}: PoolInfoCardProps) {
  const isPositiveAPR = latestMetrics.relativeAPR >= 0;
  const tradingFeePercentage = convertTradingFeeToPercentage(ammInfo.pool.tradingFee);

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
              <p className="text-xl font-bold text-white">${latestMetrics.totalValueLocked.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">24h Trading Volume</p>
              <p className="text-xl font-bold text-white">${latestMetrics.totalPoolVolume.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">APR</p>
              <p className={`flex items-center ${isPositiveAPR ? 'text-green-400' : 'text-red-400'}`}>
                {isPositiveAPR ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
                <span className="text-lg font-bold">{latestMetrics.relativeAPR.toFixed(2)}%</span>
              </p>
            </div>
            <div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-sm text-gray-400 mb-1 flex items-center cursor-help">
                      Trading Fee <Info className="h-4 w-4 ml-1" />
                    </p>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>The fee charged on each trade in this pool.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <p className="text-lg font-bold text-white flex items-center">
                <Percent className="h-4 w-4 mr-1 text-gray-400" />
                {tradingFeePercentage}
              </p>
            </div>
          </div>
          <Separator className="bg-gray-800" />
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ArrowLeftRight className="h-4 w-4 text-blue-400 mr-2" />
                <span className="text-xs text-gray-400">Exchange Rate</span>
              </div>
              <span className="text-sm font-medium text-blue-400">
                1 {amount2Currency} = {(1 / ammInfo.pool.lastRate2).toFixed(6)} {amountCurrency}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ArrowLeftRight className="h-4 w-4 text-green-400 mr-2" />
                <span className="text-xs text-gray-400">Exchange Rate</span>
              </div>
              <span className="text-sm font-medium text-green-400">
                1 {amountCurrency} = {ammInfo.pool.lastRate2.toFixed(6)} {amount2Currency}
              </span>
            </div>
          </div>
          <Separator className="bg-gray-800" />
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">Pool Balance ({amountCurrency})</span>
              <span className="text-sm font-medium text-white">{poolBalance1.toLocaleString(undefined, {minimumFractionDigits: 6, maximumFractionDigits: 6})}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Pool Balance ({amount2Currency})</span>
              <span className="text-sm font-medium text-white">{poolBalance2.toLocaleString(undefined, {minimumFractionDigits: 6, maximumFractionDigits: 6})}</span>
            </div>
            <AssetBalanceBar
              balance1={poolBalance1}
              balance2={poolBalance2}
              currency1={amountCurrency}
              currency2={amount2Currency}
            />
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