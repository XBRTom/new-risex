const { fetchTransactions } = require('./libs/xrpl.tsx');

// Simple test function to verify LP holdings calculation
async function testLPHoldings() {
  const testWallet = 'rK5j9n8baXfL4gzUoZsfxBvvsv97P5ofDG'; // Example wallet
  
  console.log('🧪 Testing LP Holdings Calculation');
  console.log('====================================');
  console.log(`Testing wallet: ${testWallet}`);
  console.log('');
  
  try {
    // Fetch transactions
    console.log('📡 Fetching transactions...');
    const transactions = await fetchTransactions(testWallet);
    console.log(`✅ Found ${transactions.length} total transactions`);
    
    // Filter for AMM transactions
    const ammTransactions = transactions.filter(tx => 
      tx.type === 'AMMDeposit' || tx.type === 'AMMWithdraw'
    );
    console.log(`🔄 Found ${ammTransactions.length} AMM transactions`);
    
    if (ammTransactions.length > 0) {
      console.log('\n📊 Sample AMM transactions:');
      ammTransactions.slice(0, 3).forEach((tx, i) => {
        console.log(`  ${i + 1}. ${tx.type} - ${tx.amount} - LP: ${tx.lpTokens} - Date: ${tx.date}`);
      });
    }
    
    // Group by pools
    const poolGroups = ammTransactions.reduce((groups, tx) => {
      const poolAccount = tx.recipient;
      if (!groups[poolAccount]) {
        groups[poolAccount] = [];
      }
      groups[poolAccount].push(tx);
      return groups;
    }, {});
    
    console.log(`\n🏊 Found positions in ${Object.keys(poolGroups).length} different pools`);
    
    // Calculate holdings for each pool
    const holdings = [];
    for (const [poolAccount, poolTransactions] of Object.entries(poolGroups)) {
      let totalLPTokens = 0;
      
      // Sort transactions by date
      const sortedTxs = poolTransactions.sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      
      // Calculate net LP tokens
      for (const tx of sortedTxs) {
        const lpChange = parseFloat(tx.lpTokens);
        if (tx.type === 'AMMDeposit') {
          totalLPTokens += lpChange;
        } else if (tx.type === 'AMMWithdraw') {
          totalLPTokens -= Math.abs(lpChange);
        }
      }
      
      // Only include active positions
      if (totalLPTokens > 0.0001) {
        const latestTx = sortedTxs[sortedTxs.length - 1];
        const assets = latestTx.amount.split(', ');
        let asset1 = 'XRP', asset2 = 'Unknown';
        
        if (assets.length >= 2) {
          const asset1Match = assets[0].match(/[\d.]+\s+(\w+)/);
          const asset2Match = assets[1].match(/[\d.]+\s+(\w+)/);
          if (asset1Match) asset1 = asset1Match[1];
          if (asset2Match) asset2 = asset2Match[1];
        }
        
        holdings.push({
          poolAccount: poolAccount.slice(0, 12) + '...',
          pool: `${asset1}/${asset2}`,
          lpTokens: totalLPTokens.toFixed(6),
          transactions: poolTransactions.length,
          lastActivity: latestTx.date
        });
      }
    }
    
    console.log('\n💰 Active LP Holdings:');
    if (holdings.length === 0) {
      console.log('  No active LP positions found');
    } else {
      holdings.forEach((holding, i) => {
        console.log(`  ${i + 1}. ${holding.pool} - ${holding.lpTokens} LP tokens`);
        console.log(`     Pool: ${holding.poolAccount}`);
        console.log(`     Transactions: ${holding.transactions}`);
        console.log(`     Last Activity: ${holding.lastActivity}`);
        console.log('');
      });
    }
    
    console.log('✅ Test completed successfully!');
    console.log(`📈 Summary: ${holdings.length} active LP positions found`);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run the test
testLPHoldings();
