import { fetchTransactions, Transaction } from '@/libs/xrpl';

export interface LPHolding {
  id: string;
  poolAccount: string;
  asset1_currency: string;
  asset2_currency: string;
  asset1_issuer?: string;
  asset2_issuer?: string;
  lpTokenBalance: number;
  sharePercentage: number;
  firstDepositDate: string;
  lastActivityDate: string;
  totalDeposits: number;
  totalWithdrawals: number;
  netPosition: number;
}

export const fetchWalletLPHoldings = async (walletAddress: string): Promise<LPHolding[]> => {
  try {
    console.log(`Calculating LP holdings from transactions for wallet: ${walletAddress}`);
    
    // Get all transactions for the wallet
    const transactions = await fetchTransactions(walletAddress);
    console.log(`Analyzing ${transactions.length} transactions for LP positions`);

    // Filter for AMM transactions (deposits and withdrawals)
    const ammTransactions = transactions.filter(tx => 
      tx.type === 'AMMDeposit' || tx.type === 'AMMWithdraw'
    );

    console.log(`Found ${ammTransactions.length} AMM transactions`);

    // Group transactions by pool account (recipient)
    const poolGroups = ammTransactions.reduce((groups, tx) => {
      const poolAccount = tx.recipient;
      if (!groups[poolAccount]) {
        groups[poolAccount] = [];
      }
      groups[poolAccount].push(tx);
      return groups;
    }, {} as Record<string, Transaction[]>);

    const holdings: LPHolding[] = [];

    // Calculate net position for each pool
    for (const [poolAccount, poolTransactions] of Object.entries(poolGroups)) {
      let totalLPTokens = 0;
      let totalDeposits = 0;
      let totalWithdrawals = 0;
      let currentOwnership = 0;
      
      // Sort transactions by date (oldest first)
      const sortedTxs = poolTransactions.sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      // Calculate running total of LP tokens
      for (const tx of sortedTxs) {
        const lpChange = parseFloat(tx.lpTokens);
        
        if (tx.type === 'AMMDeposit') {
          totalLPTokens += lpChange;
          totalDeposits += lpChange;
        } else if (tx.type === 'AMMWithdraw') {
          totalLPTokens -= Math.abs(lpChange); // Withdrawals reduce LP tokens
          totalWithdrawals += Math.abs(lpChange);
        }

        // Get the latest ownership percentage
        if (tx.ammOwnership && parseFloat(tx.ammOwnership) > 0) {
          currentOwnership = parseFloat(tx.ammOwnership);
        }
      }

      // Only include pools where user still has a position
      if (totalLPTokens > 0.0001) { // Small threshold to account for rounding
        const latestTx = sortedTxs[sortedTxs.length - 1];
        const firstTx = sortedTxs[0];

        // Extract asset information from latest transaction
        const assets = latestTx.amount.split(', ');
        let asset1_currency = 'XRP';
        let asset2_currency = 'Unknown';
        let asset1_issuer: string | undefined;
        let asset2_issuer: string | undefined;

        if (assets.length >= 2) {
          // Parse "1000 XRP, 500 USD" format
          const asset1Match = assets[0].match(/[\d.]+\s+(\w+)/);
          const asset2Match = assets[1].match(/[\d.]+\s+(\w+)/);
          
          if (asset1Match) asset1_currency = asset1Match[1];
          if (asset2Match) asset2_currency = asset2Match[1];
        }

        if (latestTx.issuer1 && latestTx.issuer1 !== 'N/A') {
          asset1_issuer = latestTx.issuer1;
        }
        if (latestTx.issuer2 && latestTx.issuer2 !== 'N/A') {
          asset2_issuer = latestTx.issuer2;
        }

        const holding: LPHolding = {
          id: poolAccount,
          poolAccount: poolAccount,
          asset1_currency: asset1_currency,
          asset2_currency: asset2_currency,
          asset1_issuer: asset1_issuer,
          asset2_issuer: asset2_issuer,
          lpTokenBalance: totalLPTokens,
          sharePercentage: currentOwnership,
          firstDepositDate: firstTx.date,
          lastActivityDate: latestTx.date,
          totalDeposits: totalDeposits,
          totalWithdrawals: totalWithdrawals,
          netPosition: totalLPTokens
        };

        holdings.push(holding);
        console.log(`LP Position found:`, {
          pool: `${asset1_currency}/${asset2_currency}`,
          lpTokens: totalLPTokens,
          ownership: `${currentOwnership}%`
        });
      }
    }

    console.log(`Total active LP positions: ${holdings.length}`);
    return holdings;

  } catch (error: any) {
    console.error('Error calculating LP holdings:', error);
    throw new Error(`Failed to calculate LP holdings: ${error.message}`);
  }
};
