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
  const { getInfoTransactionWallet, signTransactionWallet, walletType, walletAddress } = walletContext;
  const [status, setStatus] = useState<string>('');
  const [uuid, setUuid] = useState<string | null>(null);
  const [png, setPng] = useState<string | null>(null);

  const handleTransaction = async () => {
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

      const signRequest = await signTransactionWallet(payload, 'http://localhost:3000/dashboard/overview?request_signature=123')
      if (walletType === 'xumm') {
        if (signRequest?.payload?.uuid)
          setUuid(signRequest?.payload?.uuid)
  
        if (signRequest?.payload?.refs?.qr_png) {
          setStatus('Scan this QR code to sign the transaction.')
          setPng(signRequest.payload.refs.qr_png)
        }
  
        if (signRequest?.payload?.refs?.websocket_status) {
            const ws = new WebSocket(signRequest.payload.refs.websocket_status);
  
            ws.onopen = () => {
                console.log('WebSocket connection opened')
            };
  
            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                // console.log('WebSocket message received:', data)
  
                if (data.pre_signed) {
                  setStatus('Transaction presigned')
                } else if (data.signed) {
                    setStatus('Transaction signed successfully')
                    onSuccess()
                    ws.close()
                } else if (data.rejected) {
                    setStatus('Transaction was rejected')
                    onError()
                    ws.close()
                }
            };
  
            ws.onerror = (error) => {
                console.error('WebSocket error:', error)
                setStatus('WebSocket error occurred')
                onError();
            };
  
            ws.onclose = () => {
                console.log('WebSocket connection closed')
            };
        }
      } else if(walletType === 'gemwallet') {
        setUuid(signRequest)
        setStatus('Transaction signed successfully')
      }      

    } catch (err) {
      setStatus('Failed to complete transaction: ' + (err as Error).message)
      console.error('Error completing transaction:', err)
      onError()
    }
  };

  return (
    <div>
      {(walletType && walletAddress) ? (
        <>
          <button onClick={() => handleTransaction()} className="bg-blue-500 text-white px-4 py-2 rounded">
            {transactionType === 'AMMDeposit' ? 'Add Liquidity' : 'Withdraw Liquidity'}
          </button>
          {png && (
            <div className="mt-4">
              <img src={png} alt="QR Code" className="w-32 h-32" />
            </div>
          )}
          {status && <p className="text-sm text-gray-500 mt-2">{status}</p>}
        </>
      ) : (
        <p className="text-sm text-gray-500 mt-2">Connect your wallet</p>
      )}
    </div>
  );
};

export default TransactionHandler;
