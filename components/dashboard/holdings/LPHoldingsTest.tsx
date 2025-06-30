'use client'

import React, { useState } from 'react';
import { fetchWalletLPHoldings, LPHolding } from '@/libs/lpHoldings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Loader from '@/components/ui/Loader';

const LPHoldingsTest: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [holdings, setHoldings] = useState<LPHolding[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTest = async () => {
    if (!walletAddress.trim()) {
      setError('Please enter a wallet address');
      return;
    }

    setLoading(true);
    setError(null);
    setHoldings([]);

    try {
      console.log('Testing LP holdings for wallet:', walletAddress);
      const result = await fetchWalletLPHoldings(walletAddress.trim());
      console.log('Test result:', result);
      setHoldings(result);
    } catch (err: any) {
      console.error('Test error:', err);
      setError(err.message || 'Failed to fetch LP holdings');
    } finally {
      setLoading(false);
    }
  };

  const handleTestWithSample = () => {
    // Example wallet with AMM activity (this is a known wallet that should have LP positions)
    setWalletAddress('rK5j9n8baXfL4gzUoZsfxBvvsv97P5ofDG');
  };

  return (
    <div className="space-y-6">
      {/* Test Input */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">LP Holdings Test</CardTitle>
          <CardDescription className="text-gray-400">
            Test the LP holdings calculation functionality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="wallet-address" className="text-gray-300">
                Wallet Address
              </Label>
              <Input
                id="wallet-address"
                type="text"
                placeholder="Enter XRPL wallet address (e.g., rK5j9n8baXfL4gzUoZsfxBvvsv97P5ofDG)"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="mt-1 bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div className="flex space-x-2">
              <Button 
                onClick={handleTest} 
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <>
                    <Loader size={16} className="mr-2" />
                    Testing LP Holdings...
                  </>
                ) : (
                  'Test LP Holdings'
                )}
              </Button>
              <Button 
                onClick={handleTestWithSample} 
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Use Sample Address
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {error && (
        <Card className="bg-red-900/20 border-red-700">
          <CardHeader>
            <CardTitle className="text-red-400">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-300">{error}</p>
          </CardContent>
        </Card>
      )}

      {holdings.length > 0 && (
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Test Results</CardTitle>
            <CardDescription className="text-gray-400">
              Found {holdings.length} LP position(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {holdings.map((holding, index) => (
                <div key={holding.id} className="border border-gray-700 rounded-lg p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Pool</p>
                      <p className="text-white font-mono">
                        {holding.asset1_currency}/{holding.asset2_currency}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">LP Tokens</p>
                      <p className="text-white">{holding.lpTokenBalance.toFixed(6)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Share %</p>
                      <p className="text-white">{holding.sharePercentage.toFixed(4)}%</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Pool Account</p>
                      <p className="text-xs text-gray-300 font-mono">
                        {holding.poolAccount.slice(0, 8)}...
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Total Deposits</p>
                      <p className="text-green-400">{holding.totalDeposits.toFixed(6)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Total Withdrawals</p>
                      <p className="text-red-400">{holding.totalWithdrawals.toFixed(6)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">First Deposit</p>
                      <p className="text-gray-300">{new Date(holding.firstDepositDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Last Activity</p>
                      <p className="text-gray-300">{new Date(holding.lastActivityDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && !error && holdings.length === 0 && walletAddress && (
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-gray-400">No LP positions found for this wallet</p>
              <p className="text-sm text-gray-500 mt-2">
                This wallet either has no AMM activity or all positions have been withdrawn
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LPHoldingsTest;
