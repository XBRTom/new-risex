// export default Summary;

import React, { useState, useEffect } from 'react';
import { useWallet } from '@/providers/Wallet';
import AmmActions from './AmmActions';
import VoteSlotsGauge from './VoteSlotsGauge';
import CurrencyAmounts from './AmmInfoCurrencyAmounts';
import AmmInfoTable from './AmmInfoTable';
// import Card from './Card';
import WalletPoolHoldingTable from './WalletPoolHoldingTable';
// import FeesEarnedChart from './FeesEarnedChart';
// import EarningsChart from './EarningsChart';
// import LPTokensChart from './LPTokensChart';
// import { aggregateHistoricalData } from '../libs/dataAggregation';
import TransactionTable from './TransactionTable';
import apiClient from '@/libs/api';

const Summary = ({
  amountValue,
  amountCurrency,
  amount2Value,
  amount2Currency,
  ammInfo,
  auctionSlot,
  lpToken,
  voteSlotsData,
  voteSlotsHeaders,
  poolBalance1,
  poolBalance2,
  latestDailyVolume,
  latestDailyTradingFee,
  latestMetrics,
}) => {
  const { lpTokenDetails, transactions } = useWallet();
  const [currentTokenAmount, setCurrentTokenAmount] = useState('-');
  // const [historicalData, setHistoricalData] = useState([]);
  const [baseExchangeRate, setBaseExchangeRate] = useState(null);
  const [counterExchangeRate, setCounterExchangeRate] = useState(null);
  const account = ammInfo.account;

  console.log('transactions in AmmInfoSummary:', transactions);
  console.log('lpTokenDetails in AmmInfoSummary:', lpTokenDetails);
  console.log('account in AmmInfoSummary:', account);
  
  const [baseCurrency, setBaseCurrency] = useState(null);
  const [counterCurrency, setCounterCurrency] = useState(null);

  // useEffect(() => {
  //   const fetchHistoricalData = async () => {
  //     try {
  //       const response = await axios.get('/api/getDailyPoolData');
  //       setHistoricalData(response.data);
  //     } catch (error) {
  //       console.error('Error fetching historical data:', error);
  //     }
  //   };

  //   fetchHistoricalData();
  // }, []);

  useEffect(() => {
    const updateCurrentTokenAmount = () => {
      let poolDetails;
      if (lpTokenDetails) {
        poolDetails = lpTokenDetails.find(detail => detail.poolAddress === ammInfo.account);
      }
      if (poolDetails) {
        setCurrentTokenAmount(poolDetails.current);
      } else {
        setCurrentTokenAmount('-');
      }
    };

    updateCurrentTokenAmount();
  }, [ammInfo.account, lpTokenDetails]);


  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const { exchangeRates } = await apiClient.get('/fetch-exchange-rates-from-db');
        // const exchangeRates = data.exchangeRates;
  
        // Debug: Check if exchangeRates is structured correctly
        console.log('exchangeRates:', exchangeRates);
  
        const base = latestDailyVolume?.base || '-';
        const counter = latestDailyVolume?.counter || '-';
  
        // Determine baseCurrency and baseIssuer
        const baseCurrency = base === 'XRP' ? 'XRP' : (base.includes('_') ? base.split('_')[1] : base);
        const baseIssuer = base === 'XRP' ? null : (base.includes('_') ? base.split('_')[0] : null);
  
        // Determine counterCurrency and counterIssuer
        const counterCurrency = counter === 'XRP' ? 'XRP' : (counter.includes('_') ? counter.split('_')[1] : counter);
        const counterIssuer = counter === 'XRP' ? null : (counter.includes('_') ? counter.split('_')[0] : null);
  
        const baseRate = baseIssuer && exchangeRates[baseIssuer]
          ? exchangeRates[baseIssuer][baseCurrency]
          : (baseCurrency === 'XRP' ? 1 : null);
        
        const counterRate = counterIssuer && exchangeRates[counterIssuer]
          ? exchangeRates[counterIssuer][counterCurrency]
          : (counterCurrency === 'XRP' ? 1 : null);
  
        // Set the exchange rates
        setBaseExchangeRate(baseRate || null);
        setCounterExchangeRate(counterRate || null);
        setBaseCurrency(baseCurrency);
        setCounterCurrency(counterCurrency);

        // You can now use baseVolumeInXRP and counterVolumeInXRP in your component
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
      }
    };
  
    fetchExchangeRates();
  }, [latestDailyVolume]);
  
  const baseVolume = latestDailyVolume?.baseVolume || '-';
  const counterVolume = latestDailyVolume?.counterVolume || '-';
  console.log('basevolume', baseVolume );
  console.log('counterVolume', counterVolume );

  const calculateYourAssets = () => {
    // Ensure that lpToken is correctly passed and accessed
    const lpTokenValue = lpToken.length > 0 ? lpToken[0].value : 0;

    // Log the values for debugging
    console.log('currentTokenAmount:', currentTokenAmount);
    console.log('lpTokenValue:', lpTokenValue);

    if (currentTokenAmount === '-' || lpTokenValue === 0) {
      return { asset1: '-', asset2: '-' };
    }

    const yourAsset1Share = (currentTokenAmount / lpTokenValue) * poolBalance1;
    const yourAsset2Share = (currentTokenAmount / lpTokenValue) * poolBalance2;

    // Log the calculated shares
    console.log('yourAsset1Share:', yourAsset1Share);
    console.log('yourAsset2Share:', yourAsset2Share);

    return { asset1: yourAsset1Share, asset2: yourAsset2Share };
  };

  // Destructure the returned asset shares
  const { asset1: yourAsset1Share, asset2: yourAsset2Share } = calculateYourAssets();
  
  
  // console.log('pool balance', poolBalance1 );
  // console.log('pool balance', poolBalance2 );
  // console.log('pool balance', lpTokenValue );
  
  
  // const calculateFeesEarnedByWallet = (currentTokenAmount, lpTokenValue, total24hFeesGenerated) => {
  //   const walletShare = currentTokenAmount !== '-' && lpTokenValue ? currentTokenAmount / lpTokenValue : '-';
  //   const feesEarned = walletShare !== '-' && total24hFeesGenerated !== '-' ? walletShare * total24hFeesGenerated : '-';
  //   console.log('current token amount', currentTokenAmount);
  //   console.log('lptokenvalue', lpTokenValue);
  //   console.log('total24hFeesGenerated', total24hFeesGenerated);
  //   console.log('walletShare', walletShare);
  //   return feesEarned;
  // };

  // const volume = volumeData[ammInfo.account] || { baseVolume: '-', counterVolume: '-' };
  // console.log('volume', volume );

  // const baseVolume = latestDailyVolume?.baseVolume || '-';
  // const counterVolume = latestDailyVolume?.counterVolume || '-';
  // console.log('basevolume', baseVolume );
  // console.log('counterVolume', counterVolume );
  // console.log('baseRate', baseRate );

  // const base = latestDailyVolume?.base || '-';
  // const baseCurrency = base.includes('_') ? base.split('_')[1] : base;
  // console.log('baseCurrency:', baseCurrency);

  // const counter = latestDailyVolume?.counter || '-';
  // const counterCurrency = counter.includes('_') ? counter.split('_')[1] : counter;
  // console.log('counterCurrency:', counterCurrency);
  
 
  
  // const baseVolumeUSD = volume.baseVolume !== '-' && latestDailyVolume ? volume.baseVolume * latestDailyVolume : '-';
  // const counterVolumeUSD = volume.counterVolume !== '-' && latestDailyVolume ? volume.counterVolume * latestDailyVolume : '-';
  // const totalVolumeUSD = baseVolumeUSD !== '-' && counterVolumeUSD !== '-' ? baseVolumeUSD + counterVolumeUSD : '-';



  // const tradingFeeDecimal = ammInfo.trading_fee ? parseFloat(ammInfo.trading_fee) / 100 : 0;
  // const total24hFeesGenerated = totalVolumeUSD !== '-' ? totalVolumeUSD * tradingFeeDecimal : '-';
  // const feesEarnedByWallet = calculateFeesEarnedByWallet(currentTokenAmount, lpToken?.value, total24hFeesGenerated);

  const holdings = [
    { description: 'Number of LP Tokens', value: currentTokenAmount },
    { description: `Asset1 Share (${amountCurrency})`, value: `${yourAsset1Share} ${amountCurrency}` },
    { description: `Asset2 Share (${amount2Currency})`, value: `${yourAsset2Share} ${amount2Currency}` },
    // { description: 'Fees Earned (USD)', value: `${feesEarnedByWallet !== '-' ? `$${feesEarnedByWallet.toFixed(10)}` : '-'}` }
  ];

  // const combinedSections = [
  //   {
  //     title: 'AMM Info',
  //     data: [
  //       { label: 'Account', value: ammInfo?.account || '' },
  //       { label: 'Amount', value: ammInfo?.amount || '' },
  //       { label: 'Trading Fee', value: ammInfo?.trading_fee || '' },
  //       { label: 'Issuer 2', value: ammInfo?.issuer2 || '' },
  //     ],
  //   },
  //   {
  //     title: 'Auction Slot',
  //     data: auctionSlot
  //       ? [
  //           { label: 'Account', value: auctionSlot?.account || '' },
  //           { label: 'Discounted Fee', value: auctionSlot?.discounted_fee || '' },
  //           { label: 'Expiration', value: auctionSlot?.expiration || '' },
  //           { label: 'Price', value: auctionSlot?.price || '' },
  //         ]
  //       : [],
  //   },
  //   {
  //     title: 'LP Token',
  //     data: lpToken
  //       ? [
  //           { label: 'Currency', value: lpToken?.currency || '' },
  //           { label: 'Issuer', value: lpToken?.issuer || '' },
  //           { label: 'Value', value: lpToken?.value || '' },
  //         ]
  //       : [],
  //   },
  // ];

  return (
    <section className="mb-10">
      <h2 className="text-xl font-light text-white text-left">Summary</h2>
      <div className="flex flex-col md:flex-row justify-start mt-3 space-y-3 md:space-y-0 md:space-x-3">
        <div className="md:w-1/2 space-y-3">
          <AmmActions
            poolAddress={ammInfo?.account}
            asset1={{ currency: amountCurrency, issuer: ammInfo?.issuer1 }}
            asset2={{ currency: amount2Currency, issuer: ammInfo?.issuer2 }}
            account={ammInfo?.account}
            poolBalance1={poolBalance1}
            poolBalance2={poolBalance2}
            lpTokenValue={lpToken?.value}
            baseCurrency={baseCurrency}
            counterCurrency={counterCurrency}
            baseExchangeRate={baseExchangeRate}
            counterExchangeRate={counterExchangeRate}
            latestDailyTradingFee={latestDailyTradingFee}
            totalVolume={latestMetrics?.totalPoolVolume || 0}
            feesGenerated={latestMetrics?.feesGenerated || 0}
            relativeAPR={latestMetrics?.relativeAPR || 0}
          />
        </div>
        <div className="md:w-1/2 space-y-0 -mt-24">
          <CurrencyAmounts
            amountValue={amountValue}
            amountCurrency={amountCurrency}
            amount2Value={amount2Value}
            amount2Currency={amount2Currency}
          />
          <h4 className="text-lg font-light mb-1 text-white"></h4>
          <WalletPoolHoldingTable holdings={holdings} />
          <br></br>
          <br></br>
          <br></br>
        </div>
      </div>
      <div className="flex mt-4">
        <div className="w-1/2 mr-4">
          <VoteSlotsGauge voteSlotsData={voteSlotsData} />
        </div>
        <div className="w-1/2">
          <AmmInfoTable headers={voteSlotsHeaders} data={voteSlotsData} />
        </div>
      </div>
      {/* <div>
        <h2>Historical Data</h2>
        <FeesEarnedChart data={historicalData} />
        <EarningsChart data={historicalData} />
        <LPTokensChart data={historicalData} />
      </div> */}
      <TransactionTable transactions={transactions} />
    </section>
  );
};

export default Summary;

