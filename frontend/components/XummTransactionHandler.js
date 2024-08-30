import React, { useState } from 'react';
import { useWallet } from '@/providers/Wallet';
import { xrpToDrops } from '@/libs/xrpl';

const XummTransactionHandler = ({ transactionType, pool, amount1, amount2, onSuccess, onError, onCancel }) => {
  const { xumm, account, handleLogin, error: walletError } = useWallet();
  const [status, setStatus] = useState('');

  const handleTransaction = async () => {
    if (!account) {
      try {
        await handleLogin();
      } catch (error) {
        console.error(error);
        setStatus(walletError || 'Sign in was canceled.');
        if (onCancel) onCancel();
        return;
      }
    }

    try {
      setStatus('Creating transaction payload...');
      
      const payload = {
        TransactionType: transactionType,
        Account: account,
        Amount: pool.asset_currency === 'XRP' ? xrpToDrops(amount1) : amount1,
        Amount2: {
          currency: pool.asset2_currency,
          value: amount2,
          issuer: pool.asset2_issuer,
        },
        Asset: {
          currency: pool.asset_currency,
          issuer: pool.asset_currency === 'XRP' ? undefined : pool.asset_issuer,
        },
        Asset2: {
          currency: pool.asset2_currency,
          issuer: pool.asset2_issuer,
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

      if (!newPopup) {
        throw new Error('Failed to open popup window');
      }

      const interval = setInterval(async () => {
        if (newPopup && newPopup.closed) {  // Check if the popup is closed
          clearInterval(interval);  // Clear the interval
          const resolvedPayload = await createdPayload.resolved;
          console.log(resolvedPayload);
          if (resolvedPayload) {
            setStatus('Transaction successful!');
            onSuccess();
          } else {
            setStatus('Transaction was not signed.');
            onError();
          }
        }
      }, 1000);
    } catch (err) {
      setStatus('Failed to complete transaction: ' + err.message);
      console.error('Error completing transaction:', err);
      onError();
    }
  };

  return (
    <div>
      <button onClick={handleTransaction} className="bg-blue-500 text-white px-4 py-2 rounded">
        {transactionType === 'AMMDeposit' ? 'Add Liquidity' : 'Withdraw Liquidity'}
      </button>
      {status && <p className="text-sm text-gray-500 mt-2">{status}</p>}
    </div>
  );
};

export default XummTransactionHandler;

