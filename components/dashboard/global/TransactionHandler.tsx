import React, { useState } from 'react';
import { useWallet } from "@/context";
import { xrpToDrops } from '@/libs/xrpl';

interface Pool {
  asset_currency: string;
  asset2_currency: string;
  asset_issuer?: string;
  asset2_issuer?: string;
}

interface TransactionHandlerProps {
  transactionType: 'AMMDeposit' | 'AMMWithdraw';
  pool: Pool;
  amount1: string;
  amount2: string;
  onSuccess: () => void;
  onError: () => void;
  onCancel: () => void;
}

const TransactionHandler: React.FC<TransactionHandlerProps> = ({
  transactionType,
  pool,
  amount1,
  amount2,
  onSuccess,
  onError,
  onCancel,
}) => {
  const walletContext = useWallet();
  if (!walletContext) {
      throw new Error("Wallet context is not available");
  }
  const { signTransactionWallet, walletType, walletAddress } = walletContext;
  const [status, setStatus] = useState<string>('');

  const handleTransaction = async () => {
    // Log the account and issuer values before constructing the payload
    console.log('Account:', walletAddress);  // Log the account to check if it's valid
    console.log('Pool:', pool);  // Log the issuer to check if it's valid
  
    try {
      setStatus('Creating transaction payload...');

      const payload = {
        TransactionType: transactionType,
        Account: walletAddress,
        Amount: pool.asset_currency === 'XRP' ? xrpToDrops(amount1) : {
          currency: pool.asset_currency,
          value: String(amount1),
          issuer: pool.asset_currency === 'XRP' ? undefined : pool.asset_issuer,
        },
        Amount2: {
          currency: pool.asset2_currency,
          value: String(amount2),
          issuer: pool.asset2_issuer || 'rExampleIssuerAddress',
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
      const signRequest = await signTransactionWallet(payload, 'http://localhost:3000/dashboard/overview?request_signature=123')
      console.log(signRequest)

      
    } catch (err) {
      setStatus('Failed to complete transaction: ' + (err as Error).message);
      console.error('Error completing transaction:', err);
      onError();
    }
  };

  return (
    <div>
      {(walletType && walletAddress) ? (
        <>
          <button onClick={handleTransaction} className="bg-blue-500 text-white px-4 py-2 rounded">
            {transactionType === 'AMMDeposit' ? 'Add Liquidity' : 'Withdraw Liquidity'}
          </button>
          {status && <p className="text-sm text-gray-500 mt-2">{status}</p>}
        </>
      ) : (
        <p>Connect your wallet</p>
      )}
    </div>
  );
};

export default TransactionHandler;
