'use client'

import React, { useEffect, useState, useCallback } from 'react';
import { useWallet } from "@/context"
import TransactionsTable from './transactions/TransactionsTable';
import DashboardLayout from './layout/DashboardLayout';
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";
import { fetchTransactions, Transaction } from '@/libs/xrpl';
import * as xrpl from 'xrpl';
  // Start of Selection

const Transactions: React.FC = () => {
  const walletContext = useWallet()
    if (!walletContext) {
        throw new Error("Wallet context is not available")
    }
  const { walletAddress, walletType, walletAppName } = walletContext
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debug logging
  console.log('=== TRANSACTIONS DEBUG ===');
  console.log('Wallet Address:', walletAddress);
  console.log('Wallet Type:', walletType);
  console.log('Wallet App Name:', walletAppName);
  console.log('Is Wallet Connected:', !!walletAddress);
  console.log('========================');

  const loadTransactions = useCallback(async () => {
    if (walletAddress) {
      setLoading(true);
      try {
        const txs = await fetchTransactions(walletAddress);
        console.log('Fetched transactions:', txs);
        setTransactions(txs);
        localStorage.setItem('cachedTransactions', JSON.stringify(txs));
      } catch (error: any) {
        console.error('Error fetching transactions:', error);
        setError(error.message || 'Failed to fetch transactions');
      } finally {
        setLoading(false);
      }
    } else {
      setTransactions([]);
      setLoading(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    if (walletAddress) {
      loadTransactions();

      const client = new xrpl.Client('wss://s1.ripple.com');
      client.connect().then(() => {
        client.request({
          command: 'subscribe',
          accounts: [walletAddress]
        });

        client.on('transaction', (tx) => {
          if (tx.transaction.Account === walletAddress) {
            loadTransactions();
          }
        });
      });

      return () => {
        client.disconnect();
      };
    } else {
      // Clear the cache when the wallet is disconnected
      localStorage.removeItem('cachedTransactions');
      setTransactions([]);
    }
  }, [walletAddress, loadTransactions]);

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
                onClick={loadTransactions}
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
            <TransactionsTable 
              transactions={transactions} 
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

export default Transactions;