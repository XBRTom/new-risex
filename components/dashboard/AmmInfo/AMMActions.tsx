import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, MinusCircle, Vote } from "lucide-react";

interface AMMActionsProps {
  amountCurrency: string;
  amount2Currency: string;
  handleAddLiquidity: () => void;
  handleWithdraw: () => void;
  handleVote: () => void;
  currencyAmount1: string;
  currencyAmount2: string;
  tradingFeeVote: string;
  setCurrencyAmount1: (value: string) => void;
  setCurrencyAmount2: (value: string) => void;
  setTradingFeeVote: (value: string) => void;
  transactionStatus: string;
}

export default function AMMActions({
  amountCurrency,
  amount2Currency,
  handleAddLiquidity,
  handleWithdraw,
  handleVote,
  currencyAmount1,
  currencyAmount2,
  tradingFeeVote,
  setCurrencyAmount1,
  setCurrencyAmount2,
  setTradingFeeVote,
  transactionStatus
}: AMMActionsProps) {
  const [mode, setMode] = useState('addLiquidity');

  const handleModeChange = (newMode: string) => {
    setMode(newMode);
  };

  return (
    <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800 shadow-lg rounded-xl overflow-hidden w-full md:w-[480px]">
      <CardHeader className="border-b border-gray-800 pb-4">
        <CardTitle className="text-2xl font-bold text-white">AMM Actions</CardTitle>
      </CardHeader>
      <CardContent className="py-3">
        <div className="space-y-3">
          <div className="flex space-x-4">
            <ActionButton
              mode="addLiquidity"
              currentMode={mode}
              onClick={() => handleModeChange('addLiquidity')}
              icon={<PlusCircle className="h-4 w-4" />}
            >
              Add Liquidity
            </ActionButton>
            <ActionButton
              mode="withdrawLiquidity"
              currentMode={mode}
              onClick={() => handleModeChange('withdrawLiquidity')}
              icon={<MinusCircle className="h-4 w-4" />}
            >
              Withdraw
            </ActionButton>
            <ActionButton
              mode="vote"
              currentMode={mode}
              onClick={() => handleModeChange('vote')}
              icon={<Vote className="h-4 w-4" />}
            >
              Vote
            </ActionButton>
          </div>
          <Separator className="bg-gray-800" />
          {mode === 'addLiquidity' && (
            <LiquidityForm
              action="Add"
              amountCurrency={amountCurrency}
              amount2Currency={amount2Currency}
              currencyAmount1={currencyAmount1}
              currencyAmount2={currencyAmount2}
              setCurrencyAmount1={setCurrencyAmount1}
              setCurrencyAmount2={setCurrencyAmount2}
              handleAction={handleAddLiquidity}
            />
          )}
          {mode === 'withdrawLiquidity' && (
            <LiquidityForm
              action="Withdraw"
              amountCurrency={amountCurrency}
              amount2Currency={amount2Currency}
              currencyAmount1={currencyAmount1}
              currencyAmount2={currencyAmount2}
              setCurrencyAmount1={setCurrencyAmount1}
              setCurrencyAmount2={setCurrencyAmount2}
              handleAction={handleWithdraw}
            />
          )}
          {mode === 'vote' && (
            <VoteForm
              tradingFeeVote={tradingFeeVote}
              setTradingFeeVote={setTradingFeeVote}
              handleVote={handleVote}
            />
          )}
          {transactionStatus && (
            <p className="text-sm text-yellow-500">{transactionStatus}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ActionButton({ mode, currentMode, onClick, icon, children }) {
  return (
    <Button
      onClick={onClick}
      variant={currentMode === mode ? 'default' : 'outline'}
      className={`flex-1 text-xs py-1 ${
        currentMode === mode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-800 hover:bg-gray-700'
      }`}
    >
      {icon}
      <span className="ml-1">{children}</span>
    </Button>
  );
}

function LiquidityForm({
  action,
  amountCurrency,
  amount2Currency,
  currencyAmount1,
  currencyAmount2,
  setCurrencyAmount1,
  setCurrencyAmount2,
  handleAction
}) {
  return (
    <div className="space-y-2">
      <div>
        <Input
          id="amount1"
          type="text"
          value={currencyAmount1}
          onChange={(e) => setCurrencyAmount1(e.target.value)}
          placeholder={`Enter ${amountCurrency} Amount`}
          className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 text-sm py-1"
        />
      </div>
      <div>
        <Input
          id="amount2"
          type="text"
          value={currencyAmount2}
          onChange={(e) => setCurrencyAmount2(e.target.value)}
          placeholder={`Enter ${amount2Currency} Amount`}
          className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 text-sm py-1"
        />
      </div>
      <Button onClick={handleAction} className="w-full bg-blue-600 hover:bg-blue-700 text-sm py-1">
        {action} Liquidity
      </Button>
    </div>
  );
}

function VoteForm({ tradingFeeVote, setTradingFeeVote, handleVote }) {
  return (
    <div className="space-y-2">
      <div>
        <Input
          id="tradingFeeVote"
          type="text"
          value={tradingFeeVote}
          onChange={(e) => setTradingFeeVote(e.target.value)}
          placeholder="Enter Your Vote for Trading Fee"
          className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 text-sm py-1"
        />
      </div>
      <Button onClick={handleVote} className="w-full bg-blue-600 hover:bg-blue-700 text-sm py-1">
        Submit Vote
      </Button>
    </div>
  );
}