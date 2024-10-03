'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { xrpToDrops } from 'xrpl';

const ProvideLiquidity = ({ account, xumm, selectedPool }) => {
  const [pools, setPools] = useState([]);
  const [pool, setPool] = useState(selectedPool || '');
  const [asset1, setAsset1] = useState('');
  const [amount1, setAmount1] = useState('');
  const [asset2, setAsset2] = useState('');
  const [amount2, setAmount2] = useState('');
  const [issuer1, setIssuer1] = useState('');
  const [issuer2, setIssuer2] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchPools = async () => {
      try {
        const response = await axios.get('/ammPools.json');
        const detailedPools = response.data.map(pool => ({
          ...pool,
          asset1CurrencyName: pool.Asset.currency,
          asset2CurrencyName: pool.Asset2.currency,
          issuer1: pool.Asset.issuer,
          issuer2: pool.Asset2.issuer,
        }));
        setPools(detailedPools);
      } catch (error) {
        setStatus('Failed to fetch pools');
        console.error('Error fetching pools:', error);
      }
    };

    fetchPools();
  }, []);

  useEffect(() => {
    if (pool) {
      const selectedPoolDetails = pools.find(p => p.Account === pool);
      if (selectedPoolDetails) {
        setAsset1(selectedPoolDetails.asset1CurrencyName);
        setAsset2(selectedPoolDetails.asset2CurrencyName);
        setIssuer1(selectedPoolDetails.issuer1);
        setIssuer2(selectedPoolDetails.issuer2);
      }
    }
  }, [pool, pools]);

  const handleAddLiquidity = async () => {
    try {
      setStatus('Creating liquidity payload...');
      const payload = {
        TransactionType: 'AMMDeposit',
        Account: account,
        Amount: asset1 === 'XRP' ? xrpToDrops(amount1) : amount1,
        Amount2: {
          currency: asset2,
          value: amount2,
          issuer: issuer2,
        },
        Asset: {
          currency: asset1,
          issuer: asset1 === 'XRP' ? undefined : issuer1,
        },
        Asset2: {
          currency: asset2,
          issuer: issuer2,
        },
        Flags: 1048576,
      };

      console.log('Payload:', JSON.stringify(payload, null, 2)); // For debugging

      const createdPayload = await xumm.payload.createAndSubscribe(payload, event => {
        if (event.data.signed) {
          return true;
        }
      });

      const payloadUUID = createdPayload?.created?.uuid;

      if (!payloadUUID) {
        throw new Error('Failed to create payload');
      }

      const payloadURL = `https://xumm.app/sign/${payloadUUID}`;
      const newPopup = window.open(payloadURL, 'XummSign', 'width=500,height=600');

      const interval = setInterval(async () => {
        if (newPopup.closed) {
          clearInterval(interval);
          const resolvedPayload = await createdPayload.resolved;
          if (resolvedPayload?.signed) {
            setStatus('Liquidity added successfully!');
            window.location.reload(); // Refresh the page
          } else {
            setStatus('Transaction was not signed.');
          }
        }
      }, 1000);
    } catch (err) {
      setStatus('Failed to add liquidity: ' + err.message);
      console.error('Error adding liquidity:', err);
    }
  };

  return (
    <div>
      <h3>Provide Liquidity</h3>
      <div>
        <label>
          Select Pool:
          <select value={pool} onChange={(e) => setPool(e.target.value)} disabled={!!selectedPool}>
            <option value="" disabled>Select a pool</option>
            {pools.map((pool) => (
              <option key={pool.Account} value={pool.Account}>
                {pool.Account} - {pool.asset1CurrencyName} / {pool.asset2CurrencyName}
              </option>
            ))}
          </select>
        </label>
      </div>
      {pool && (
        <>
          <div>
            <label>
              Asset 1: {asset1}
            </label>
          </div>
          <div>
            <label>
              Amount 1:
              <input type="text" value={amount1} onChange={(e) => setAmount1(e.target.value)} />
            </label>
          </div>
          <div>
            <label>
              Asset 2: {asset2}
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
      <button onClick={handleAddLiquidity}>Add Liquidity</button>
      <p>{status}</p>
    </div>
  );
};

export default ProvideLiquidity;