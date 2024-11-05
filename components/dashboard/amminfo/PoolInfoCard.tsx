import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowUpRight, ArrowDownRight, Wallet, BarChart3, Percent, Coins, Info, ArrowLeftRight, CircleDollarSign, DollarSign, TrendingUp, ChevronUp, ChevronDown, ArrowUpDown } from "lucide-react";
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


const calculateCrossRate = (
  baseRate: number,
  counterRate: number,
  baseCurrency: string,
  counterCurrency: string
): { rate: number; baseCurrency: string; counterCurrency: string } => {
  // Handle XRP rates
  if (baseCurrency === 'XRP' && baseRate === 0) baseRate = 1;
  if (counterCurrency === 'XRP' && counterRate === 0) counterRate = 1;
  if (baseRate && counterRate) {
    const rate = counterRate / baseRate;
    return {
      rate,
      baseCurrency,
      counterCurrency,
    };
  }
  return { rate: 0, baseCurrency: '', counterCurrency: '' };
};

const XRPBalanceBar: React.FC<{ 
  balance1: number; 
  balance2: number; 
  currency1: string; 
  currency2: string; 
  rate1: number; 
  rate2: number 
}> = ({ balance1, balance2, currency1, currency2, rate1, rate2 }) => {
  console.log('XRPBalanceBar input values:', { balance1, balance2, currency1, currency2, rate1, rate2 });

  let xrpBalance1: number;
  let xrpBalance2: number;

  if (currency1 === 'XRP') {
    xrpBalance1 = balance1;
    xrpBalance2 = balance2 / rate2;
  } else if (currency2 === 'XRP') {
    xrpBalance1 = balance1 / rate1;
    xrpBalance2 = balance2;
  } else {
    xrpBalance1 = balance1 / rate1;
    xrpBalance2 = balance2 / rate2;
  }

  const totalXRP = xrpBalance1 + xrpBalance2;
  const percentage1 = (xrpBalance1 / totalXRP) * 100;
  const percentage2 = 100 - percentage1;

  console.log('Calculated XRP values:', { xrpBalance1, xrpBalance2, totalXRP, percentage1, percentage2 });

  return (
    <TooltipProvider>
      <div className="mt-6 mb-6 relative">
        <div className="h-16 bg-gray-800 rounded-lg overflow-hidden relative">
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 relative cursor-help"
                style={{ width: `${percentage1}%` }}
              >
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                  {percentage1.toFixed(2)}% {currency1}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-gray-900 border-gray-800 text-white p-3 rounded-lg shadow-lg">
              <div className="space-y-1">
                <p className="font-semibold">{currency1} Details:</p>
                <p>Balance: {balance1.toFixed(2)} {currency1}</p>
                <p>XRP Equivalent: {xrpBalance1.toFixed(2)} XRP</p>
                <p>Rate: 1 {currency1} = {rate1.toFixed(6)} XRP</p>
                <p>Pool Share: {percentage1.toFixed(2)}%</p>
              </div>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="absolute top-0 right-0 h-full bg-gradient-to-r from-indigo-600 to-purple-600 cursor-help"
                style={{ width: `${percentage2}%` }}
              >
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                  {percentage2.toFixed(2)}% {currency2}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-gray-900 border-gray-800 text-white p-3 rounded-lg shadow-lg">
              <div className="space-y-1">
                <p className="font-semibold">{currency2} Details:</p>
                <p>Balance: {balance2.toFixed(2)} {currency2}</p>
                <p>XRP Equivalent: {xrpBalance2.toFixed(2)} XRP</p>
                <p>Rate: 1 {currency2} = {rate2.toFixed(6)} XRP</p>
                <p>Pool Share: {percentage2.toFixed(2)}%</p>
              </div>
            </TooltipContent>
          </Tooltip>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-full flex flex-col justify-center items-center pointer-events-none">
            <div className="w-px h-full bg-gradient-to-b from-transparent via-white to-transparent opacity-50"></div>
            <div className="absolute top-1/2 -translate-y-1/2 bg-white rounded-full p-1 shadow-lg">
              <ArrowUpDown className="text-gray-800" size={16} />
            </div>
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>{currency1}</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-purple-600"></div>
            <span>{currency2}</span>
          </div>
        </div>
      </div>
    </TooltipProvider>
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
  const crossRate = calculateCrossRate(
    baseExchangeRate ?? ammInfo.pool.lastRate1,
    counterExchangeRate ?? ammInfo.pool.lastRate2,
    baseCurrency ?? amountCurrency,
    counterCurrency ?? amount2Currency
  );
  let xrpRate1 = baseExchangeRate ?? ammInfo.pool.lastRate1;
  let xrpRate2 = counterExchangeRate ?? ammInfo.pool.lastRate2;

  // Adjust rates if XRP is one of the currencies
  if (amountCurrency === 'XRP') {
    xrpRate1 = 1;
    xrpRate2 = xrpRate2 === 0 ? 1 : xrpRate2;
  } else if (amount2Currency === 'XRP') {
    xrpRate1 = xrpRate1 === 0 ? 1 : xrpRate1;
    xrpRate2 = 1;
  }

  console.log('Adjusted XRP rates:');
  console.log('XRP Rate 1:', xrpRate1, 'for', amountCurrency);
  console.log('XRP Rate 2:', xrpRate2, 'for', amount2Currency);


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
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ArrowLeftRight className="h-4 w-4 text-blue-400 mr-2" />
                <span className="text-xs text-gray-400">Exchange Rate {crossRate.counterCurrency}</span>
              </div>
              <span className="text-sm font-medium text-white">
               {(1 / crossRate.rate).toFixed(6)} {crossRate.baseCurrency}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ArrowLeftRight className="h-4 w-4 text-green-400 mr-2" />
                <span className="text-xs text-gray-400">Exchange Rate {crossRate.baseCurrency}</span>
              </div>
              <span className="text-sm font-medium text-white">
                {crossRate.rate.toFixed(6)} {crossRate.counterCurrency}
              </span>
            </div>
          </div>
          <Separator className="bg-gray-800" />

          <XRPBalanceBar
            balance1={poolBalance1}
            balance2={poolBalance2}
            currency1={amountCurrency}
            currency2={amount2Currency}
            rate1={xrpRate1}
            rate2={xrpRate2}
          />
           <div className="space-y-4">
            <TooltipProvider>
              <div className="flex items-center justify-between">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center cursor-help">
                      <DollarSign className="h-4 w-4 text-blue-400 mr-2" />
                      <span className="text-xs text-gray-400">Total Value Locked</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>The total value of all assets currently held in this liquidity pool, expressed in XRP.</p>
                  </TooltipContent>
                </Tooltip>
                <span className="text-sm font-medium text-white">
                  {latestMetrics.totalValueLocked.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} XRP
                </span>
              </div>
              <div className="flex items-center justify-between">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center cursor-help">
                      <BarChart3 className="h-4 w-4 text-green-400 mr-2" />
                      <span className="text-xs text-gray-400">24h Trading Volume</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>The total value of all trades executed in this pool over the last 24 hours, expressed in XRP.</p>
                  </TooltipContent>
                </Tooltip>
                <span className="text-sm font-medium text-white">
                  {latestMetrics.totalPoolVolume.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} XRP
                </span>
              </div>
              <div className="flex items-center justify-between">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center cursor-help">
                      <TrendingUp className="h-4 w-4 text-purple-400 mr-2" />
                      <span className="text-xs text-gray-400">APR</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Annual Percentage Rate: The projected yearly return for liquidity providers based on current trading volume and fees.</p>
                  </TooltipContent>
                </Tooltip>
                <span className={`text-sm font-medium ${isPositiveAPR ? 'text-green-400' : 'text-red-400'}`}>
                  {isPositiveAPR ? <ArrowUpRight className="h-4 w-4 inline mr-1" /> : <ArrowDownRight className="h-4 w-4 inline mr-1" />}
                  {latestMetrics.relativeAPR.toFixed(2)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center cursor-help">
                      <Percent className="h-4 w-4 text-yellow-400 mr-2" />
                      <span className="text-xs text-gray-400">Trading Fee</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>The fee charged on each trade in this pool, contributing to liquidity provider returns.</p>
                  </TooltipContent>
                </Tooltip>
                <span className="text-sm font-medium text-white">{tradingFeePercentage}</span>
              </div>
            </TooltipProvider>
          </div>
          <Separator className="bg-gray-800" />
          <TooltipProvider>
            <div className="flex justify-between items-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center space-x-2 cursor-help">
                    <Coins className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-400">Your LP Tokens</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>The number of Liquidity Provider tokens you own, representing your share of the pool.</p>
                </TooltipContent>
              </Tooltip>
              <span className="text-lg font-bold text-white">{currentTokenAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
}