'use client'

import React, { useEffect, useState, useCallback } from 'react';
import { useWallet } from '@/providers/Wallet';
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
  const wallet = useWallet();
  const account = wallet ? wallet.account : null;
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTransactions = useCallback(async () => {
    if (account) {
      setLoading(true);
      try {
        const txs = await fetchTransactions(account);
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
  }, [account]);

  useEffect(() => {
    if (account) {
      loadTransactions();

      const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
      client.connect().then(() => {
        client.request({
          command: 'subscribe',
          accounts: [account]
        });

        client.on('transaction', (tx) => {
          if (tx.transaction.Account === account) {
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
  }, [account, loadTransactions]);

  return (
    <DashboardLayout>
      <div className="flex h-screen bg-black text-white">
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* <header className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4 border-b border-gray-800">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/transactions">Transactions</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header> */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
            {/* <h3 className="text-2xl font-bold mb-4">Transactions</h3> */}
            <TransactionsTable 
              transactions={transactions} 
              loading={loading} 
              error={error} 
              isWalletConnected={!!account}
            />
          </main>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Transactions;