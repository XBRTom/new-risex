import React, { useState, useEffect } from 'react';
import { useWallet } from '@/providers/Wallet';

const AmmActions = ({
  poolAddress,
  poolBalance1 = 0,
  poolBalance2 = 0,
  totalContributors = 0,
  voteWeight = 0,
  asset1,
  asset2,
  account,
  lpTokenValue = 0,
  baseCurrency,
  counterCurrency,
  baseExchangeRate, 
  counterExchangeRate,
  latestDailyTradingFee,
  totalVolume,
  feesGenerated,
  relativeAPR,
  onVote,
}) => {
  const [mode, setMode] = useState('addLiquidity');
  const [currencyAmount1, setCurrencyAmount1] = useState('');
  const [currencyAmount2, setCurrencyAmount2] = useState('');
  const [tradingFeeVote, setTradingFeeVote] = useState('');
  const { lpTokenDetails, xumm, fetchLpTokenDetails } = useWallet();
  const [currentTokenAmount, setCurrentTokenAmount] = useState('-');
  // const { account: walletAccount, handleLogin, error: walletError } = useWallet();
  const [transactionStatus, setTransactionStatus] = useState('');

  const displayedTradingFee = latestDailyTradingFee?.tradingFee || latestDailyTradingFee || 0;
  const safeToFixed = (value, digits = 2) => (typeof value === 'number' ? value.toFixed(digits) : '-');
  // const apr = displayedTradingFee ? (displayedTradingFee / 1000) * 365 : 0;
  console.log('Props received in AmmActions:', {
    totalVolume,
    feesGenerated,
    relativeAPR,
  }); // Add this log to verify received props

  useEffect(() => {
    const updateCurrentTokenAmount = () => {
      let poolDetails;
      if (lpTokenDetails) {
        poolDetails = lpTokenDetails.find(detail => detail.poolAddress === poolAddress);
      }
      if (poolDetails) {
        setCurrentTokenAmount(poolDetails.current);
      } else {
        setCurrentTokenAmount('-');
      }
    };

    updateCurrentTokenAmount();
  }, [poolAddress, lpTokenDetails]);

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setCurrencyAmount1('');
    setCurrencyAmount2('');
    setTradingFeeVote('');
    setTransactionStatus('');
  };

  const convertToProperFormat = (amount, currency) => {
    if (currency === 'XRP') {
      return (parseFloat(amount) * 1000000).toString(); // Convert XRP to drops
    }
    return amount;
  };

  const handleAddLiquidity = async () => {
    if (!account) {
      setTransactionStatus('Account information not available');
      return;
    }

    try {
      setTransactionStatus('Creating add liquidity transaction...');
      const formattedAmount1 = convertToProperFormat(currencyAmount1, asset1.currency);
      const formattedAmount2 = convertToProperFormat(currencyAmount2, asset2.currency);

      const payload = {
        TransactionType: 'AMMDeposit',
        Account: account,
        Amount: formattedAmount1,
        Amount2: {
          currency: asset2.currency,
          value: formattedAmount2,
          issuer: asset2.issuer,
        },
        Asset: {
          currency: asset1.currency,
          issuer: asset1.currency === 'XRP' ? undefined : asset1.issuer,
        },
        Asset2: {
          currency: asset2.currency,
          issuer: asset2.issuer,
        },
        Flags: 1048576,
      };

      const createdPayload = await xumm.payload.createAndSubscribe(payload, event => {
        if (event.data.signed) {
          setTransactionStatus('Liquidity added successfully!');
          setCurrencyAmount1('');
          setCurrencyAmount2('');
          fetchLpTokenDetails();
          return true;
        }
        return false;
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
        if (newPopup && newPopup.closed) {
          clearInterval(interval);
          const resolvedPayload = await createdPayload.resolved;
          if (resolvedPayload.signed) {
            setTransactionStatus('Liquidity added successfully!');
            setCurrencyAmount1('');
            setCurrencyAmount2('');
            fetchLpTokenDetails();
          } else if (transactionStatus !== 'Liquidity added successfully!') {
            setTransactionStatus('Transaction was not signed.');
          }
        }
      }, 1000);
    } catch (error) {
      setTransactionStatus(`Failed to add liquidity: ${error.message}`);
    }
  };

  const handleWithdraw = async () => {
    if (!account) {
      setTransactionStatus('Account information not available');
      return;
    }

    try {
      setTransactionStatus('Creating withdraw liquidity transaction...');
      const formattedAmount1 = convertToProperFormat(currencyAmount1, asset1.currency);
      const formattedAmount2 = convertToProperFormat(currencyAmount2, asset2.currency);

      const payload = {
        TransactionType: 'AMMWithdraw',
        Account: account,
        Amount: formattedAmount1,
        Amount2: {
          currency: asset2.currency,
          value: formattedAmount2,
          issuer: asset2.issuer,
        },
        Asset: {
          currency: asset1.currency,
          issuer: asset1.currency === 'XRP' ? undefined : asset1.issuer,
        },
        Asset2: {
          currency: asset2.currency,
          issuer: asset2.issuer,
        },
        Flags: 1048576,
      };

      const createdPayload = await xumm.payload.createAndSubscribe(payload, event => {
        if (event.data.signed) {
          setTransactionStatus('Liquidity withdrawn successfully!');
          setCurrencyAmount1('');
          setCurrencyAmount2('');
          fetchLpTokenDetails();
          return true;
        }
        return false;
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
        if (newPopup && newPopup.closed) {
          clearInterval(interval);
          const resolvedPayload = await createdPayload.resolved;
          if (resolvedPayload.signed) {
            setTransactionStatus('Liquidity withdrawn successfully!');
            setCurrencyAmount1('');
            setCurrencyAmount2('');
            fetchLpTokenDetails();
          } else if (transactionStatus !== 'Liquidity withdrawn successfully!') {
            setTransactionStatus('Transaction was not signed.');
          }
        }
      }, 1000);
    } catch (error) {
      setTransactionStatus(`Failed to withdraw liquidity: ${error.message}`);
    }
  };

  const handleVote = () => {
    onVote(tradingFeeVote);
  };

  const walletShare = currentTokenAmount !== '-' && lpTokenValue ? currentTokenAmount / lpTokenValue : '-';

  // const feesEarnedByWallet = walletShare !== '-' && (totalVolume / displayedTradingFee).toFixed(2) !== '-' ? walletShare * (totalVolume / displayedTradingFee).toFixed(2) : '-';
  console.log(walletShare);
  // useEffect(() => {
  //   if (feesEarnedByWallet !== '-') {
  //     recordDailyFees(feesEarnedByWallet);
  //   }
  // }, [feesEarnedByWallet]);

  return (
    <div className="flex p-2 bg-black text-white rounded-lg shadow-md amm-actions-container">
      <div className="flex flex-col space-y-2 mr-4 border-r border-gray-400 pr-2">
        <button
          onClick={() => handleModeChange('addLiquidity')}
          className={mode === 'addLiquidity' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}
        >
          Add Liquidity
        </button>
        <button
          onClick={() => handleModeChange('withdrawLiquidity')}
          className={mode === 'withdrawLiquidity' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}
        >
          Withdraw Liquidity
        </button>
        <button
          onClick={() => handleModeChange('vote')}
          className={mode === 'vote' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}
        >
          Vote
        </button>
      </div>
      <div className="flex-1">
        <h2 className="text-lg font-light text-left mb-2">Amm Actions</h2>
        <div className="mb-2">
          <p className="mb-1 text-sm">Trading Fee : <span className="font-bold">{(displayedTradingFee / 1000).toFixed(2)}%</span></p>
          <p className="mb-1 text-sm">Pool Rates :</p>
          <p className="mb-1 text-sm"><span className="font-bold">{baseExchangeRate} {baseCurrency} - {counterExchangeRate} {counterCurrency}</span></p>
          {/* <p className="mb-1 text-sm"><span className="font-bold">{counterExchangeRate} {counterCurrency}</span></p> */}
          <p className="mb-1 text-sm">Pool Balance : </p>
          <p className="mb-1 text-sm"><span className="font-bold">{safeToFixed(poolBalance1)} {asset1.currency} / {safeToFixed(poolBalance2)} {asset2.currency}</span></p>
          <p className="mb-1 text-sm">24h Volume : <span className="font-bold">{totalVolume} XRP</span></p>
          <p className="mb-1 text-sm">24h Fees Generated : <span className="font-bold">{feesGenerated} XRP</span></p>
          <p className="mb-1 text-sm">APR: <span className="font-bold">{{relativeAPR} ? `${relativeAPR}%` : '-'}</span></p>
          <p className="mb-1 text-sm">Total Contributors : <span className="font-bold">{totalContributors}</span></p>
          <p className="text-sm">My Vote Weight : <span className="font-bold">{voteWeight}</span></p>
        </div>
        {mode === 'addLiquidity' && (
          <div>
            <input
              type="text"
              value={currencyAmount1}
              onChange={(e) => setCurrencyAmount1(e.target.value)}
              placeholder={`Enter ${asset1.currency} Amount`}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              value={currencyAmount2}
              onChange={(e) => setCurrencyAmount2(e.target.value)}
              placeholder={`Enter ${asset2.currency} Amount`}
              className="w-full mb-2 p-2 border rounded"
            />
            <button
              onClick={handleAddLiquidity}
              className="bg-green-500 text-white p-2 rounded"
            >
              Add Liquidity
            </button>
            <p className="text-red-500 mt-2">{transactionStatus}</p>
          </div>
        )}
        {mode === 'withdrawLiquidity' && (
          <div>
            <input
              type="text"
              value={currencyAmount1}
              onChange={(e) => setCurrencyAmount1(e.target.value)}
              placeholder={`Enter ${asset1.currency} Amount to Withdraw`}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              value={currencyAmount2}
              onChange={(e) => setCurrencyAmount2(e.target.value)}
              placeholder={`Enter ${asset2.currency} Amount to Withdraw`}
              className="w-full mb-2 p-2 border rounded"
            />
            <button
              onClick={handleWithdraw}
              className="bg-red-500 text-white p-2 rounded"
            >
              Withdraw Liquidity
            </button>
            <p className="text-red-500 mt-2">{transactionStatus}</p>
          </div>
        )}
        {mode === 'vote' && (
          <div>
            <input
              type="text"
              value={tradingFeeVote}
              onChange={(e) => setTradingFeeVote(e.target.value)}
              placeholder="Enter Your Vote for Trading Fee"
              className="w-full mb-2 p-2 border rounded"
            />
            <button
              onClick={handleVote}
              className="bg-yellow-500 text-white p-2 rounded"
            >
              Vote
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AmmActions;
