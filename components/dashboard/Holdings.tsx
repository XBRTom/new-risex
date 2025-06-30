'use client'

import React, { useEffect, useState, useCallback } from 'react';
import { useWallet } from "@/context"
import HoldingsTable from './holdings/HoldingsTable';
import DashboardLayout from './layout/DashboardLayout';
import { fetchWalletLPHoldings, LPHolding } from '@/libs/lpHoldings';

const Holdings: React.FC = () => {
  const walletContext = useWallet()
    if (!walletContext) {
        throw new Error("Wallet context is not available")
    }
  const { walletAddress, walletType, walletAppName } = walletContext
  const [holdings, setHoldings] = useState<LPHolding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debug logging
  console.log('=== HOLDINGS DEBUG ===');
  console.log('Wallet Address:', walletAddress);
  console.log('Wallet Type:', walletType);
  console.log('Wallet App Name:', walletAppName);
  console.log('Is Wallet Connected:', !!walletAddress);
  console.log('======================');

  const loadHoldings = useCallback(async () => {
    if (walletAddress) {
      setLoading(true);
      try {
        const lpHoldings = await fetchWalletLPHoldings(walletAddress);
        console.log('Fetched LP holdings:', lpHoldings);
        setHoldings(lpHoldings);
        localStorage.setItem('cachedHoldings', JSON.stringify(lpHoldings));
      } catch (error: any) {
        console.error('Error fetching LP holdings:', error);
        setError(error.message || 'Failed to fetch LP holdings');
      } finally {
        setLoading(false);
      }
    } else {
      setHoldings([]);
      setLoading(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    if (walletAddress) {
      loadHoldings();
    } else {
      // Clear the cache when the wallet is disconnected
      localStorage.removeItem('cachedHoldings');
      setHoldings([]);
    }
  }, [walletAddress, loadHoldings]);

  return (
    <DashboardLayout>
      <div className="flex h-screen bg-black text-white">
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Wallet Info Header */}
          {walletAddress && (
            <header className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4 border-b border-gray-800">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-400">Connected to {walletAppName || walletType}</span>
                </div>
                <div className="text-sm text-gray-500">
                  {walletAddress.slice(0, 8)}...{walletAddress.slice(-6)}
                </div>
              </div>
              <button
                onClick={loadHoldings}
                disabled={loading}
                className="flex items-center space-x-2 px-3 py-1 text-sm bg-gray-800 hover:bg-gray-700 rounded-md transition-colors disabled:opacity-50"
              >
                <span className={loading ? 'animate-spin' : ''}>
                  🔄
                </span>
                <span>Refresh</span>
              </button>
            </header>
          )}
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
            <HoldingsTable 
              holdings={holdings} 
              loading={loading} 
              error={error} 
              isWalletConnected={!!walletAddress}
            />
          </main>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Holdings;
