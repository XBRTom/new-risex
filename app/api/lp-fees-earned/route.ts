import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/libs/prisma';

// Helper function to fetch transactions from XRPL
async function fetchWalletTransactions(walletAddress: string) {
  try {
    const response = await fetch(`https://api.xrpscan.com/api/v1/account/${walletAddress}/transactions?type=amm`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.log(`XRPL API response not OK: ${response.status}`);
      return [];
    }
    
    const data = await response.json();
    return data.transactions || [];
  } catch (error) {
    console.error('Failed to fetch transactions from XRPL:', error);
    return [];
  }
}

// Helper function to extract AMM transactions
function extractAMMTransactions(transactions: any[], walletAddress: string) {
  const ammTransactions: any[] = [];
  
  for (const tx of transactions) {
    if (tx.TransactionType === 'AMMDeposit' || tx.TransactionType === 'AMMWithdraw') {
      // For AMM transactions, the destination is the AMM account
      const ammAccount = tx.meta?.AffectedNodes?.find((node: any) => 
        node.ModifiedNode?.LedgerEntryType === 'AMM'
      )?.ModifiedNode?.FinalFields?.Account;
      
      // Extract LP token changes from transaction metadata
      let lpTokensChange = 0;
      let ammOwnership = 0;
      
      // Look for LP token balance changes in metadata
      if (tx.meta?.AffectedNodes) {
        for (const node of tx.meta.AffectedNodes) {
          if (node.ModifiedNode?.LedgerEntryType === 'RippleState') {
            const finalFields = node.ModifiedNode.FinalFields;
            const prevFields = node.ModifiedNode.PreviousFields;
            
            if (finalFields?.Balance && prevFields?.Balance) {
              const finalBalance = parseFloat(finalFields.Balance);
              const prevBalance = parseFloat(prevFields.Balance);
              lpTokensChange = Math.abs(finalBalance - prevBalance);
            }
          }
        }
      }
      
      const ammData = {
        transactionType: tx.TransactionType,
        destination: ammAccount,
        lpTokens: lpTokensChange.toString(),
        ammOwnership: ammOwnership.toString(), // We'll estimate this based on pool data
        date: new Date(tx.date),
        txHash: tx.hash
      };
      
      if (ammData.destination) {
        ammTransactions.push(ammData);
      }
    }
  }
  
  return ammTransactions;
}

export async function POST(req: NextRequest) {
  try {
    const { walletAddress } = await req.json();
    
    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
    }

    console.log('Calculating LP trading fees for wallet:', walletAddress);

    // Fetch transactions from XRPL API
    const allTransactions = await fetchWalletTransactions(walletAddress);
    const ammTransactions = extractAMMTransactions(allTransactions, walletAddress);
    
    // Get unique pool accounts from AMM transactions
    const poolAccounts = Array.from(new Set(ammTransactions.map(tx => tx.destination).filter(Boolean)));
    
    if (poolAccounts.length === 0) {
      return NextResponse.json({
        walletAddress,
        totalFeesEarned: 0,
        poolsCount: 0,
        feesBreakdown: [],
        message: 'No AMM positions found for this wallet'
      });
    }

    // For now, let's use a simpler approach - just check the current AMM balances
    // This is a basic estimation based on current holdings rather than historical data
    const feesCalculation = [];
    let totalFeesEarned = 0;

    // Fetch current AMM balances for the wallet to estimate ownership
    for (const poolAccount of poolAccounts) {
      try {
        // Find the pool in our database
        const pool = await prisma.pool.findUnique({
          where: { account: poolAccount },
          include: {
            metrics: {
              orderBy: { date: 'desc' },
              take: 1
            }
          }
        });

        if (!pool || !pool.metrics[0]) {
          continue;
        }

        const metrics = pool.metrics[0];
        const poolTotalFees = parseFloat(metrics.feesGenerated?.toString() || '0');
        
        if (poolTotalFees <= 0) {
          continue;
        }

        // For this basic version, assume a 0.1% ownership estimate
        // In a real implementation, you'd fetch current AMM balance from XRPL
        const estimatedOwnershipPercent = 0.1; // This should be calculated from actual AMM balance
        const userFeesEarned = poolTotalFees * (estimatedOwnershipPercent / 100);

        feesCalculation.push({
          poolAccount: pool.account,
          poolPair: `${pool.asset_currency}/${pool.asset2_currency}`,
          tradingFeeRate: (pool.tradingFee / 1000).toFixed(3), // Convert from basis points
          poolTotalFees: poolTotalFees,
          estimatedOwnershipPercent: estimatedOwnershipPercent,
          estimatedFeesEarned: userFeesEarned,
          transactionCount: ammTransactions.filter(tx => tx.destination === poolAccount).length
        });

        totalFeesEarned += userFeesEarned;
      } catch (error) {
        console.error(`Error processing pool ${poolAccount}:`, error);
      }
    }

    // Sort by estimated fees earned (highest first)
    feesCalculation.sort((a, b) => b.estimatedFeesEarned - a.estimatedFeesEarned);

    console.log(`Calculated fees for ${feesCalculation.length} pools, total estimated fees: $${totalFeesEarned.toFixed(2)}`);

    return NextResponse.json({
      walletAddress,
      totalFeesEarned,
      poolsCount: feesCalculation.length,
      feesBreakdown: feesCalculation,
      calculationMethod: 'basic-estimation',
      disclaimer: 'This is a basic estimate assuming 0.1% pool ownership. For accurate calculations, we would need to fetch your current AMM balance from the XRPL.'
    });

  } catch (error) {
    console.error('Failed to calculate LP fees:', error);
    return NextResponse.json({ error: 'Failed to calculate LP fees' }, { status: 500 });
  }
}
