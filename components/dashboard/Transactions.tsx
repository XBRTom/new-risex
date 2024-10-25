'use client'

import React, { useEffect, useState } from 'react';
import { useWallet } from '@/providers/Wallet';
import TransactionsTable from './transactions/TransactionsTable';
import DashboardLayout from './layout/DashboardLayout';
import { Progress } from "@/components/ui/progress";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { fetchTransactions } from '@/libs/xrpl';

const Transactions: React.FC = () => {
  const { account } = useWallet();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getTransactions = async () => {
      if (account) {
        try {
          setLoading(true);
          const txs = await fetchTransactions(account);
          setTransactions(txs);
        } catch (error: any) {
          setError(error.message || 'Failed to fetch transactions');
        } finally {
          setLoading(false);
        }
      }
    };
    getTransactions();
  }, [account]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Loading...</h1>
          <br/>
          <Progress value={50} />
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (!account) {
    return <p>Please connect your wallet to view transactions.</p>;
  }

  return (
    <DashboardLayout>
      <div className="flex h-screen bg-black text-white">
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4 border-b border-gray-800">
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
          </header>
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
            <h3 className="text-2xl font-bold mb-4">Transactions</h3>
            <TransactionsTable transactions={transactions} />
          </main>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Transactions;
