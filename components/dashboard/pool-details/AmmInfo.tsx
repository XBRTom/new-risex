'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/sprints/AmmInfoHeader';
import Summary from '@/sprints/AmmInfoSummary';
import GlobalPoolMetricsTable from '@/sprints/GlobalPoolMetricsTable';
import GlobalPoolMetricsChart from '@/sprints/GlobalPoolMetricsChart';
import apiClient from '@/libs/api';

const timeRanges = [
  { value: '15days', label: 'Last 15 Days' },
  { value: 'month', label: 'Current Month' },
  { value: '3months', label: 'Last 3 Months' },
  { value: 'alltime', label: 'All Time' },
];

const AmmInfo = ({account, ammInfo}: { account: string, ammInfo: any }) => {
  // const [ammInfo, setAmmInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [latestMetrics, setLatestMetrics] = useState<any>(null);
  const [historicalMetrics, setHistoricalMetrics] = useState<any[]>([]);
  const [filteredMetrics, setFilteredMetrics] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState('15days'); // Default to last 15 days
  const [error, setError] = useState<string | null>(null);



  useEffect(() => {
    const fetchAmmInfo = async () => {
      try {
        console.log(`Fetching AMM info for account: ${account}`);
        // const response: any = await apiClient.get(`/fetch-amm-info/${account}`);
        // setAmmInfo(response);

        // Fetch the latest metrics data
        console.log(`Fetching latest metrics for poolId: ${ammInfo.poolId}`);
        const metricsResponse: any = await apiClient.get(`/latest-metrics?poolId=${ammInfo.poolId}`);
        console.log('Fetched Latest Metrics:', metricsResponse); // Add this log to verify the fetched data

        // Filter the metrics for the current poolId
        const currentPoolMetrics = metricsResponse.find((metric: any) => metric.poolId === ammInfo.poolId);

        // Ensure that you found the correct metrics for the pool
        if (currentPoolMetrics) {
          setLatestMetrics(currentPoolMetrics);
        } else {
          console.error('No metrics found for the current poolId');
          setLatestMetrics(null);
        }

        // Fetch historical metrics data
        console.log(`Fetching historical metrics for poolId: ${ammInfo.poolId}`);
        const historicalResponse: any = await apiClient.get(`/historical-metrics?poolId=${ammInfo.poolId}`);
        console.log('Fetched Historical Metrics:', historicalResponse);
        setHistoricalMetrics(historicalResponse);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching AMM info or latest metrics:', err);
        setError('Failed to fetch AMM info');
        setLoading(false);
      }
    };

    if (account) {
      fetchAmmInfo();
    }
  }, [account, ammInfo.poolId]);

  // Filter and aggregate data based on the selected time range
  useEffect(() => {
    if (historicalMetrics.length > 0) {
      const now = new Date();
      let filteredData: any[] = [];

      switch (timeRange) {
        case '15days':
          filteredData = historicalMetrics.filter((metric) => {
            const metricDate = new Date(metric.date);
            const daysDifference = Math.floor((now.getTime() - metricDate.getTime()) / (1000 * 60 * 60 * 24));
            return daysDifference <= 15;
          });
          break;
        case 'month':
          filteredData = historicalMetrics.filter((metric) => {
            const metricDate = new Date(metric.date);
            return metricDate.getMonth() === now.getMonth() && metricDate.getFullYear() === now.getFullYear();
          });
          break;
        case '3months':
        case 'alltime':
          const metricsByMonth: { [key: string]: any } = {};

          historicalMetrics.forEach((metric) => {
            const metricDate = new Date(metric.date);
            const yearMonth = `${metricDate.getFullYear()}-${metricDate.getMonth() + 1}`;

            if (!metricsByMonth[yearMonth]) {
              metricsByMonth[yearMonth] = {
                totalValueLocked: 0,
                totalPoolVolume: 0,
                poolYield: 0,
                relativeAPR: 0,
                feesGenerated: 0,
                count: 0,
              };
            }

            metricsByMonth[yearMonth].totalValueLocked += parseFloat(metric.totalValueLocked);
            metricsByMonth[yearMonth].totalPoolVolume += parseFloat(metric.totalPoolVolume);
            metricsByMonth[yearMonth].poolYield += parseFloat(metric.poolYield);
            metricsByMonth[yearMonth].relativeAPR += parseFloat(metric.relativeAPR);
            metricsByMonth[yearMonth].feesGenerated += parseFloat(metric.feesGenerated);
            metricsByMonth[yearMonth].count += 1;
          });

          for (let [key, value] of Object.entries(metricsByMonth)) {
            const avgTotalValueLocked = value.totalValueLocked / value.count;
            const avgTotalPoolVolume = value.totalPoolVolume / value.count;
            const avgPoolYield = value.poolYield / value.count;
            const avgRelativeAPR = value.relativeAPR / value.count;
            const totalFeesGenerated = value.feesGenerated; // Sum instead of average

            filteredData.push({
              date: `${key}-01`, // Set the date to the first of the month
              totalValueLocked: avgTotalValueLocked,
              totalPoolVolume: avgTotalPoolVolume,
              poolYield: avgPoolYield,
              relativeAPR: avgRelativeAPR,
              feesGenerated: totalFeesGenerated, // Use the sum of feesGenerated
            });
          }

          filteredData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          if (timeRange === '3months') {
            filteredData = filteredData.slice(-3);
          }
          break;
        default:
          break;
      }

      setFilteredMetrics(filteredData);
    }
  }, [timeRange, historicalMetrics]);

  if (loading) {
    return <div className="text-white text-sm">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-sm">{error}</div>;
  }

  if (!ammInfo) {
    return <div className="text-white text-sm">No AMM info available</div>;
  }

  // Convert drops to XRP, but only apply it to 'ammInfo.amount'
  const getAmountValue = (amount: number) => {
    if (typeof amount === 'number') {
      return amount / 1_000_000; // Convert drops to XRP
    }
    return 0;
  };

  const poolBalance1 = getAmountValue(ammInfo.amount); // Convert only amount to XRP
  const poolBalance2 = ammInfo.amount2_value; // Do not convert, use the value as is

  const amountValue = ammInfo.amount || 0;
  const amountCurrency = ammInfo.amount_currency || 'XRP';
  const amount2Value = ammInfo.amount2_value;
  const amount2Currency = ammInfo.amount2_currency;

  console.log('Calculated Values:', {
    poolBalance1,
    amountCurrency,
    poolBalance2,
    amount2Currency,
  });

  const latestDailyVolume = ammInfo.pool.dailyVolumes.length > 0 ? ammInfo.pool.dailyVolumes[0] : null;
  const latestLpTokenBalance = ammInfo.pool.lpTokenBalances.length > 0 ? ammInfo.pool.lpTokenBalances[0] : null;
  const latestDailyTradingFee = ammInfo.pool.dailyTradingFees.length > 0 ? ammInfo.pool.dailyTradingFees[0] : null;

  console.log('Processed Data:', {
    latestDailyVolume,
    latestLpTokenBalance,
    latestDailyTradingFee,
  });

  return (
    <div className="min-h-screen bg-black text-white px-6 py-6">
      <Header />
      <div className="max-w-full mx-auto px-[150px]">
        <Summary
          amountValue={amountValue}
          amountCurrency={amountCurrency}
          amount2Value={amount2Value}
          amount2Currency={amount2Currency}
          ammInfo={{
            account: account || '',
            amount: `${amountValue} ${amountCurrency}`,
            trading_fee: `${ammInfo.trading_fee / 1000}%`,
            issuer2: ammInfo.amount2_issuer,
          }}
          auctionSlot={ammInfo.pool.auctionSlots.map((slot: any) => ({
            account: slot.account,
            discounted_fee: slot.discountedFee,
            expiration: slot.expiration,
            price: `${slot.price_value} ${slot.price_currency}`,
          }))}
          lpToken={
            latestLpTokenBalance
              ? [
                  {
                    currency: latestLpTokenBalance.currency,
                    issuer: latestLpTokenBalance.issuer,
                    value: latestLpTokenBalance.value,
                  },
                ]
              : []
          }
          voteSlotsData={ammInfo.pool.voteSlots.map((vote: any) => ({
            account: vote.account,
            trading_fee: `${vote.tradingFee / 1000}%`,
            vote_weight: vote.voteWeight,
          }))}
          voteSlotsHeaders={[
            { key: 'account', label: 'Account' },
            { key: 'trading_fee', label: 'Trading Fee' },
            { key: 'vote_weight', label: 'Vote Weight' },
          ]}
          poolBalance1={poolBalance1}
          poolBalance2={poolBalance2}
          latestDailyVolume={latestDailyVolume}
          latestDailyTradingFee={latestDailyTradingFee}
          latestMetrics={latestMetrics}
        />
        {/* Dropdown for selecting the time range */}
        <div className="mt-6 mb-4">
          <label htmlFor="timeRange" className="mr-2">
            Select Time Range:
          </label>
          <select
            id="timeRange"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-gray-800 text-white p-2 rounded"
          >
            {timeRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
        {/* Render the historical metrics table */}
        <GlobalPoolMetricsTable metrics={filteredMetrics} timeRange={timeRange} />

        {/* Render the historical metrics chart */}
        <GlobalPoolMetricsChart metrics={filteredMetrics} />
      </div>
    </div>
  );
};

export default AmmInfo;