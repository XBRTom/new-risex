import React from 'react';

const GlobalPoolMetricsTable = ({ metrics, timeRange }) => {
  const safeToFixed = (value, digits = 2) => {
    const numberValue = parseFloat(value); // Convert string to number
    if (!isNaN(numberValue)) {
      return numberValue.toFixed(digits);
    }
    return '-'; // Fallback if the value is not a valid number
  };

  // Sort metrics by date to ensure correct cumulative calculation
  const sortedMetrics = [...metrics].sort((a, b) => new Date(a.date) - new Date(b.date));

  // Calculate cumulative fees, relative growth, and set color indicators
  let cumulativeFees = 0;
  let previousCumulativeFees = null;
  let previousPoolYield = null;
  let previousRelativeAPR = null;
  const metricsWithIndicators = sortedMetrics.map((metric) => {
    cumulativeFees += parseFloat(metric.feesGenerated); // Accumulate fees over time

    let relativeGrowth = null;
    if (previousCumulativeFees !== null) {
      relativeGrowth = ((cumulativeFees - previousCumulativeFees) / previousCumulativeFees) * 100;
    }

    // Determine color classes for Pool Yield and Relative APR
    const poolYieldClass = previousPoolYield !== null
      ? metric.poolYield > previousPoolYield
        ? 'text-green-500'
        : metric.poolYield < previousPoolYield
        ? 'text-red-500'
        : ''
      : '';
    
    const relativeAPRClass = previousRelativeAPR !== null
      ? metric.relativeAPR > previousRelativeAPR
        ? 'text-green-500'
        : metric.relativeAPR < previousRelativeAPR
        ? 'text-red-500'
        : ''
      : '';

    const relativeGrowthClass = relativeGrowth !== null ? 'text-green-500' : '';

    // Update previous values for next iteration comparison
    previousCumulativeFees = cumulativeFees;
    previousPoolYield = metric.poolYield;
    previousRelativeAPR = metric.relativeAPR;

    return {
      ...metric,
      cumulativeFees,
      relativeGrowth,
      poolYieldClass,
      relativeAPRClass,
      relativeGrowthClass,
    };
  });

  return (
    <div className="mt-6">
      <h3 className="text-lg font-light text-white mb-4">Historical Pool Metrics ({timeRange})</h3>
      <table className="min-w-full bg-black text-white border border-gray-700">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-gray-700">Date</th>
            <th className="py-2 px-4 border-b border-gray-700">Total Value Locked (TVL)</th>
            <th className="py-2 px-4 border-b border-gray-700">Total Pool Volume</th>
            <th className="py-2 px-4 border-b border-gray-700">Pool Yield</th>
            <th className="py-2 px-4 border-b border-gray-700">Relative APR</th>
            <th className="py-2 px-4 border-b border-gray-700">Fees Generated</th>
            <th className="py-2 px-4 border-b border-gray-700">Cumulative Fees</th>
            <th className="py-2 px-4 border-b border-gray-700">Relative Growth (%)</th>
          </tr>
        </thead>
        <tbody>
          {metricsWithIndicators.map((metric, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border-b border-gray-700">{new Date(metric.date).toLocaleDateString()}</td>
              <td className="py-2 px-4 border-b border-gray-700">{safeToFixed(metric.totalValueLocked, 2)} XRP</td>
              <td className="py-2 px-4 border-b border-gray-700">{safeToFixed(metric.totalPoolVolume, 2)} XRP</td>
              <td className={`py-2 px-4 border-b border-gray-700 ${metric.poolYieldClass}`}>{safeToFixed(metric.poolYield, 2)} %</td>
              <td className={`py-2 px-4 border-b border-gray-700 ${metric.relativeAPRClass}`}>{safeToFixed(metric.relativeAPR, 2)} %</td>
              <td className="py-2 px-4 border-b border-gray-700">{safeToFixed(metric.feesGenerated, 2)} XRP</td>
              <td className="py-2 px-4 border-b border-gray-700">{safeToFixed(metric.cumulativeFees, 2)} XRP</td>
              <td className={`py-2 px-4 border-b border-gray-700 ${metric.relativeGrowthClass}`}>
                {metric.relativeGrowth !== null ? safeToFixed(metric.relativeGrowth, 2) : '-'} %
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GlobalPoolMetricsTable;
