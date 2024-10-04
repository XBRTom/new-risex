import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { createRoot } from 'react-dom/client'; // Import createRoot
import { fetchAmmDetails, fetchTransactions } from '../xrpl';
import { useWallet } from './WalletContext';
import ProvideLiquidity from '../components/ProvideLiquidity';

const LiquidityPools = () => {
  const { ammAccount } = useParams();
  const { account, handleLogin, xumm } = useWallet();
  const [ammDetails, setAmmDetails] = useState(null);
  const [error, setError] = useState(null);
  const [lpTokenBalance, setLpTokenBalance] = useState('0');
  const [ownershipPercentage, setOwnershipPercentage] = useState('0');
  const [hasLiquidity, setHasLiquidity] = useState(false);

  useEffect(() => {
    const getAmmDetails = async () => {
      try {
        const details = await fetchAmmDetails(ammAccount);
        setAmmDetails(details);

        if (account) {
          const transactions = await fetchTransactions(account);
          const relevantTransaction = transactions.find(tx => tx.recipient.includes(ammAccount));
          if (relevantTransaction) {
            setLpTokenBalance(relevantTransaction.lpTokens);
            setOwnershipPercentage(relevantTransaction.ammOwnership);
            setHasLiquidity(true);
          } else {
            setHasLiquidity(false);
          }
        }
      } catch (error) {
        setError(error.message || 'Failed to fetch AMM details');
      }
    };
    getAmmDetails();
  }, [ammAccount, account]);

  const handleEarnInterest = () => {
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
                window.opener.renderProvideLiquidityPopup();
              };
            </script>
          </body>
        </html>
      `;
      popup.document.write(popupContent);
      popup.document.close();
    }
  };

  window.renderProvideLiquidityPopup = () => {
    const popup = window.open('', 'ProvideLiquidity', 'width=500,height=600');
    const rootElement = popup.document.getElementById('popup-root');
    if (rootElement) {
      const root = createRoot(rootElement);
      root.render(
        <ProvideLiquidity account={account} xumm={xumm} selectedPool={ammAccount} />
      );
    }
  };

  return (
    <div>
      <h3>AMM Details</h3>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : ammDetails ? (
        <div>
          {account ? (
            hasLiquidity ? (
              <>
                <h3>Your Ownership</h3>
                <table style={{ margin: '20px auto', borderCollapse: 'collapse', width: '80%' }}>
                  <thead>
                    <tr>
                      <th style={{ border: '1px solid black', padding: '8px' }}>LP Tokens</th>
                      <th style={{ border: '1px solid black', padding: '8px' }}>Ownership Percentage (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ border: '1px solid black', padding: '8px' }}>{lpTokenBalance}</td>
                      <td style={{ border: '1px solid black', padding: '8px' }}>{ownershipPercentage}%</td>
                    </tr>
                  </tbody>
                </table>
              </>
            ) : (
              <button onClick={handleEarnInterest}>Earn Interest</button>
            )
          ) : (
            <button onClick={handleLogin}>Start Earning Interest</button>
          )}

          {/* Summary Table */}
          <h3>AMM Summary</h3>
          <table style={{ margin: '20px auto', borderCollapse: 'collapse', width: '80%' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid black', padding: '8px' }}>Total Value Locked (TVL)</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>Fees Collected</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>Pool Return (%)</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>LP Token Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: '1px solid black', padding: '8px' }}>{ammDetails.totalValueLocked.toFixed(6)} XRP</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{ammDetails.feesCollected.toFixed(6)} XRP</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{ammDetails.poolReturn.toFixed(2)}%</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{ammDetails.lpTokenValue.toFixed(6)} XRP</td>
              </tr>
            </tbody>
          </table>

          {/* Table 1: AMM Account and Assets */}
          <h3>AMM Account and Assets</h3>
          <table style={{ margin: '20px auto', borderCollapse: 'collapse', width: '80%' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid black', padding: '8px' }}>AMM Account</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>LP Token Supply</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>Amount (Asset 1 - XRP)</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>Amount (Asset 2 - {ammDetails.ammData.amount2.currency})</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: '1px solid black', padding: '8px' }}>{ammAccount}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{ammDetails.ammData.lp_token.value}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{ammDetails.ammData.amount}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{ammDetails.ammData.amount2.value}</td>
              </tr>
            </tbody>
          </table>

          {/* Table 2: Auction Slot Details */}
          <h3>Auction Slot Details</h3>
          <table style={{ margin: '20px auto', borderCollapse: 'collapse', width: '80%' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid black', padding: '8px' }}>Trading Fee (%)</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>Auction Currency</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>Auction Value</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>Discounted Fee</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>Account</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>Expiration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: '1px solid black', padding: '8px' }}>{ammDetails.tradingFeePercentage}%</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{ammDetails.ammData.auction_slot.price.currency}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{ammDetails.ammData.auction_slot.price.value}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{ammDetails.ammData.auction_slot.discounted_fee}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{ammDetails.ammData.auction_slot.account}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{ammDetails.ammData.auction_slot.expiration}</td>
              </tr>
            </tbody>
          </table>

          {/* Table 3: Vote Slots */}
          <h3>Vote Slots</h3>
          <table style={{ margin: '20px auto', borderCollapse: 'collapse', width: '80%' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid black', padding: '8px' }}>Account</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>Trading Fee (%)</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>Vote Weight</th>
              </tr>
            </thead>
            <tbody>
              {ammDetails.voteSlots.map((vote, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{vote.account}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{vote.tradingFeePercentage}%</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{vote.vote_weight}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Trust Lines Table */}
          <h3>Trust Lines</h3>
          <table style={{ margin: '20px auto', borderCollapse: 'collapse', width: '80%' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid black', padding: '8px' }}>Currency</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>Balance</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>Issuer</th>
              </tr>
            </thead>
            <tbody>
              {ammDetails.assetDetails.map((asset, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{asset.currency}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{asset.balance}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{asset.issuer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Loading...</p> // Display loading text while fetching details
      )}
    </div>
  );
};

export default LiquidityPools;
