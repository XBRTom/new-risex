'use client';

import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AllAmms = ({ setPools }) => { 
  const [localPools, setLocalPools] = useState([]);
  const [ammInfo, setAmmInfo] = useState({});
  const [volumes, setVolumes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exchangeRates, setExchangeRates] = useState({});
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    const fetchCoinData = async () => {
      try {
        const response = await axios.get('../coinData.json');
        const coinData = response.data;
        const rates = {};
        coinData.forEach(coin => {
          rates[coin.symbol] = parseFloat(coin.price_usd);
        });
        setExchangeRates(rates);
      } catch (err) {
        console.error('Failed to fetch coin data:', err);
        setError('Failed to fetch coin data');
      }
    };

    const fetchData = async () => {
      try {
        const [poolsResponse, ammInfoResponse, volumesResponse, tokensResponse] = await Promise.all([
          axios.get('/ammPools.json'),
          axios.get('/ammInfo.json'),
          axios.get('/ammVolumes.json'),
          axios.get('/tokens.json')
        ]);

        setLocalPools(poolsResponse.data);
        setAmmInfo(ammInfoResponse.data);
        setVolumes(volumesResponse.data);
        setTokens(tokensResponse.data.tokens || []);
        await fetchCoinData();
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (typeof setPools === 'function') {
      const detailedPools = localPools.map(pool => {
        const asset1CurrencyName = getTokenName(pool.Asset.currency);
        const asset2CurrencyName = getTokenName(pool.Asset2.currency);
        return { ...pool, asset1CurrencyName, asset2CurrencyName };
      });
      setPools(detailedPools);
    } else {
      console.error('setPools is not a function');
    }
  }, [getTokenName, localPools, setPools]);

  const convertDropsToXrp = (drops) => {
    return drops / 1_000_000;
  };

  const convertToUsd = (value, currency) => {
    const rate = exchangeRates[currency];
    return rate ? value * rate : 'N/A';
  };

  const getTokenName = useCallback((currencyCode) => {
    if (/^[0-9A-F]{40}$/.test(currencyCode)) {
      const token = tokens.find(token => token.currency === currencyCode);
      if (token) {
        const tokenName = token.meta?.token?.name;
        if (tokenName && !/^[0-9A-F]{40}$/.test(tokenName)) {
          return tokenName;
        }
        const issuerName = token.meta?.issuer?.name;
        if (issuerName && !/^[0-9A-F]{40}$/.test(issuerName)) {
          return issuerName;
        }
      }
    }
    return currencyCode;
  }, [tokens]);

  return (
    <div>
      <h3>All AMM Pools</h3>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <table style={{ margin: '20px auto', borderCollapse: 'collapse', width: '80%' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid black', padding: '8px' }}>Account</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Pools</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Trading Fee (%)</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Balance</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Liquidity (USD)</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Last 24h Volume</th>
            </tr>
          </thead>
          <tbody>
            {localPools.map((pool, index) => {
              const asset1Xrp = convertDropsToXrp(pool.Balance);
              const asset1Usd = convertToUsd(asset1Xrp, 'XRP');
              const asset2Value = parseFloat(pool.Asset2.value || 0);
              const asset2Xrp = convertDropsToXrp(asset2Value);
              const asset2Usd = convertToUsd(asset2Xrp, 'XRP');
              const tradingFee = (pool.TradingFee / 10000).toFixed(2);

              const ammDetails = ammInfo[pool.Account] || {};
              const amount2Value = ammDetails.amount2 ? parseFloat(ammDetails.amount2.value) : 'N/A';
              const amount2Currency = ammDetails.amount2 ? ammDetails.amount2.currency : 'N/A';
              const amount2Usd = ammDetails.amount2 ? convertToUsd(amount2Value, amount2Currency) : 'N/A';

              const liquidity = (asset1Usd !== 'N/A' && amount2Usd !== 'N/A') ? asset1Usd + amount2Usd : 'N/A';

              const volume = volumes[pool.Account] ? volumes[pool.Account].totalVolume : 'N/A';
              const volumeUnit = volumes[pool.Account] ? volumes[pool.Account].unit : '';

              const asset1CurrencyName = getTokenName(pool.Asset.currency);
              const asset2CurrencyName = getTokenName(pool.Asset2.currency);

              return (
                <tr key={index}>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{pool.Account}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <Link to={`/pool/${pool.Account}`}>
                      {asset1CurrencyName} / {asset2CurrencyName}
                    </Link>
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{tradingFee}%</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{asset1Xrp.toFixed(6)} {asset1CurrencyName} / {amount2Value} {asset2CurrencyName}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{liquidity !== 'N/A' ? liquidity.toFixed(2) : liquidity}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{volume} {volumeUnit}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AllAmms;
