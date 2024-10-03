import React, { useState, useEffect } from 'react';
import { fetchTransactions } from '../xrpl';
import { useWallet } from './WalletContext';

const WithdrawLiquidity = ({ xumm }) => {
  const { account } = useWallet();
  const [pools, setPools] = useState([]);
  const [pool, setPool] = useState('');
  const [amount1, setAmount1] = useState('');
  const [amount2, setAmount2] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchPools = async () => {
      if (account) {
        try {
          const transactions = await fetchTransactions(account);
          const ammDeposits = transactions.filter(tx => tx.type === 'AMMDeposit');
          const uniquePools = Array.from(new Set(ammDeposits.map(tx => tx.recipient.split(' ')[2].slice(1, -1))))
            .map(ammAccount => {
              const tx = ammDeposits.find(tx => tx.recipient.includes(ammAccount));
              const asset1Details = tx.amount.split(', ')[0].split(' ');
              const asset2Details = tx.amount.split(', ')[1].split(' ');

              return {
                account: ammAccount,
                asset1CurrencyName: asset1Details[1],
                asset1Issuer: tx.issuer1,
                asset2CurrencyName: asset2Details[1],
                asset2Issuer: tx.issuer2,
              };
            });
          setPools(uniquePools);
        } catch (error) {
          setStatus('Failed to fetch pools');
          console.error('Error fetching pools:', error);
        }
      }
    };

    fetchPools();
  }, [account]);

  const handleWithdrawLiquidity = async () => {
    try {
      setStatus('Creating withdrawal payload...');
      const selectedPoolDetails = pools.find(p => p.account === pool);
      if (!selectedPoolDetails) {
        throw new Error('Selected pool details not found');
      }

      const amount1Value = selectedPoolDetails.asset1CurrencyName === 'XRP' ? (parseFloat(amount1) * 1000000).toString() : amount1;
      const asset1 = {
        currency: selectedPoolDetails.asset1CurrencyName,
      };
      if (selectedPoolDetails.asset1CurrencyName !== 'XRP') {
        asset1.issuer = selectedPoolDetails.asset1Issuer;
      }

      const payload = {
        TransactionType: 'AMMWithdraw',
        Account: account,
        Amount: amount1Value,
        Amount2: {
          currency: selectedPoolDetails.asset2CurrencyName,
          value: amount2,
          issuer: selectedPoolDetails.asset2Issuer,
        },
        Asset: asset1,
        Asset2: {
          currency: selectedPoolDetails.asset2CurrencyName,
          issuer: selectedPoolDetails.asset2Issuer,
        },
        Flags: 1048576, // Assuming this flag is needed based on the documentation
      };

      console.log('Payload:', JSON.stringify(payload, null, 2)); // For debugging

      if (!xumm || !xumm.payload || typeof xumm.payload.createAndSubscribe !== 'function') {
        throw new Error('Xumm SDK is not properly initialized');
      }

      const createdPayload = await xumm.payload.createAndSubscribe(payload, event => {
        console.log('Event:', event); // Additional debug information
        if (event.data.signed) {
          return true;
        }
      });

      console.log('Created Payload:', createdPayload); // Debugging statement

      if (!createdPayload || !createdPayload.created || !createdPayload.created.uuid) {
        throw new Error('Failed to create payload');
      }

      const payloadUUID = createdPayload.created.uuid;
      const payloadURL = `https://xumm.app/sign/${payloadUUID}`;
      const newPopup = window.open(payloadURL, 'XummSign', 'width=500,height=600');

      const interval = setInterval(async () => {
        if (newPopup.closed) {
          clearInterval(interval);
          const resolvedPayload = await createdPayload.resolved;
          console.log('Resolved Payload:', resolvedPayload); // Debugging statement
          if (resolvedPayload?.signed) {
            setStatus('Liquidity withdrawn successfully!');
            window.location.reload();
          } else {
            setStatus('Transaction was not signed.');
          }
        }
      }, 1000);
    } catch (err) {
      setStatus('Failed to withdraw liquidity: ' + err.message);
      console.error('Error withdrawing liquidity:', err);
    }
  };

  return (
    <div>
      <h3>Withdraw Liquidity</h3>
      <div>
        <label>
          Select Pool:
          <select value={pool} onChange={(e) => setPool(e.target.value)}>
            <option value="" disabled>Select a pool</option>
            {pools.map((pool) => (
              <option key={pool.account} value={pool.account}>
                {pool.account} - {pool.asset1CurrencyName} / {pool.asset2CurrencyName}
              </option>
            ))}
          </select>
        </label>
      </div>
      {pool && (
        <>
          <div>
            <label>
              Amount 1:
              <input type="text" value={amount1} onChange={(e) => setAmount1(e.target.value)} />
            </label>
          </div>
          <div>
            <label>
              Amount 2:
              <input type="text" value={amount2} onChange={(e) => setAmount2(e.target.value)} />
            </label>
          </div>
        </>
      )}
      <button onClick={handleWithdrawLiquidity}>Withdraw Liquidity</button>
      <p>{status}</p>
    </div>
  );
};

export default WithdrawLiquidity;
