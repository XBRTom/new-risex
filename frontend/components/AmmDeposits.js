import React, { useEffect, useState } from 'react';
import { fetchTransactions } from '../xrpl';
import { Link } from 'react-router-dom';
import { useWallet } from './WalletContext';
import ProvideLiquidity from './ProvideLiquidity';
import { createRoot } from 'react-dom/client';

const AmmDeposits = () => {
  const { account, handleLogin, xumm } = useWallet();
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTransactions = async () => {
      if (account) {
        try {
          const txs = await fetchTransactions(account);
          const ammDeposits = txs.filter(tx => tx.type === 'AMMDeposit');
          setTransactions(ammDeposits);
        } catch (error) {
          setError(error.message || 'Failed to fetch transactions');
        }
      }
    };
    getTransactions();
  }, [account]);

  const handleAddFunds = (ammAccount) => {
    const popup = window.open('', 'ProvideLiquidity', 'width=500,height=600');
    if (popup) {
      const popupContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Provide Liquidity</title>
          </head>
          <body>
            <div id="popup-root"></div>
            <script>
              window.onload = function() {
                window.opener.renderProvideLiquidityPopup('${ammAccount}');
              };
            </script>
          </body>
        </html>
      `;
      popup.document.write(popupContent);
      popup.document.close();
    }
  };

  window.renderProvideLiquidityPopup = (ammAccount) => {
    const popup = window.open('', 'ProvideLiquidity', 'width=500,height=600');
    const rootElement = popup.document.getElementById('popup-root');
    if (rootElement) {
      const root = createRoot(rootElement);
      root.render(
        <ProvideLiquidity account={account} xumm={xumm} selectedPool={ammAccount} />
      );
    }
  };

  if (!account) {
    return <p>Please connect your wallet to view AMM deposits.</p>;
  }

  return (
    <div>
      <h3>AMM Deposits</h3>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <table style={{ margin: '0 auto', borderCollapse: 'collapse', width: '80%' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid black', padding: '8px' }}>Type</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Recipient</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Amount</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>LP Tokens</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>AMM Ownership (%)</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(tx => (
              <tr key={tx.id}>
                <td style={{ border: '1px solid black', padding: '8px' }}>{tx.type}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>
                  <Link to={`/pool/${tx.recipient.split(' ')[2].slice(1, -1)}`}>{tx.recipient}</Link>
                </td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{tx.amount}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{tx.lpTokens}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{tx.ammOwnership}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>
                  <button onClick={() => handleAddFunds(tx.recipient.split(' ')[2].slice(1, -1))}>Add Funds</button>
                  <button>Withdraw Funds</button> {/* Placeholder for withdraw logic */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AmmDeposits;
