'use client';

import React, { useEffect, useState } from 'react';
import { fetchTransactions } from '@/libs/xrpl';
import { Link } from 'next/link';
import { useWallet } from '@/providers/Wallet';

const Transactions = () => {
  const { account } = useWallet();
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);

  console.log('account:', account);

  

  useEffect(() => {
    const getTransactions = async () => {
      if (account) {
        try {
          const txs = await fetchTransactions(account);
          setTransactions(txs);
        } catch (error) {
          setError(error.message || 'Failed to fetch transactions');
        }
      }
    };
    getTransactions();
  }, [account]);

  if (!account) {
    return <p>Please connect your wallet to view transactions.</p>;
  }

  return (
    <div>
      <h3>Transactions</h3>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <table style={{ margin: '0 auto', borderCollapse: 'collapse', width: '80%' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid black', padding: '8px' }}>Date</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Type</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Sender</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Recipient</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Amount</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>LP Tokens</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>AMM Ownership (%)</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(tx => {
              console.log('tx:', tx);
              console.log('tx.recipient:', tx.recipient);
              return (
              <tr key={tx.id}>
                <td style={{ border: '1px solid black', padding: '8px' }}>{tx.date}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{tx.type}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{tx.sender}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>
                  {/* {(tx.type === 'AMMDeposit' || tx.type === 'AMMWithdraw') && tx.recipient ? (
                    <Link to={`/pool/${tx.recipient}`}>{tx.recipient}</Link>
                  ) : (
                    tx.recipient
                  )} */}
                </td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{tx.amount}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{tx.lpTokens}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{tx.ammOwnership}</td>
              </tr>
            )})}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Transactions;
