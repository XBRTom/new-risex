import { Client, dropsToXrp, xrpToDrops } from 'xrpl';

const client = new Client('wss://s1.ripple.com', {
  connectionTimeout: 10000, // Increase connection timeout to 10 seconds
});

const connectClient = async () => {
  if (!client.isConnected()) {
    console.log('Connecting to XRPL Ledger...');
    await client.connect();
    console.log('Connected to XRPL Ledger');
  }
};

const fetchAmmDetails = async (ammAccount) => {
  try {
    await connectClient();
    const accountInfoResponse = await client.request({
      command: 'account_info',
      account: ammAccount,
    });
    const ammInfoResponse = await client.request({
      command: 'amm_info',
      amm_account: ammAccount,
    });

    return {
      accountData: accountInfoResponse.result.account_data,
      ammData: ammInfoResponse.result.amm,
    };
  } catch (error) {
    console.error(`Error fetching AMM details for account ${ammAccount}: ${error.message}`);
    throw error;
  }
};

const fetchAllAmms = async () => {
  await connectClient();
  const response = await client.request({
    command: 'amm_list', // Hypothetical endpoint
  });
  return response.result.amms.map(amm => amm.account);
};

const fetchTransactions = async (address) => {
  let transactions = [];
  let marker = null;

  try {
    await connectClient();
    let response;

    do {
      // console.log(`Fetching transactions for ${address} with marker:`, marker);

      response = await client.request({
        command: 'account_tx',
        account: address,
        ledger_index_min: -1,
        ledger_index_max: -1,
        limit: 20, // Adjusted limit for quicker responses
        binary: false,
        forward: false,
        marker: marker || undefined, // Pass marker only if defined
      });

      console.log('Response:', response);

      if (response.result.transactions) {
        transactions = transactions.concat(response.result.transactions);
      } else {
        console.warn('No transactions found in the response.');
        break;
      }

      marker = response.result.marker || null;
      console.log('Next marker:', marker);

    } while (marker);

    return transactions.map(tx => {
    // console.log('TX MAP:', tx);
        const txData = tx.tx || tx.tx_json;
      let type = 'Unknown';
      let amount = '0';
      let sender = txData.Account;
      let recipient = txData.Destination || 'N/A';
      let lpTokens = '0';
      let totalLpTokens = '0';
      let ammOwnership = '0';
      let ammAccount = '';
      let issuer1 = '';
      let issuer2 = '';

      if (txData.TransactionType === 'Payment' && txData.Amount && txData.Amount.currency && txData.Amount.value) {
        type = 'Payment';
        amount = typeof txData.Amount === 'string' ? dropsToXrp(txData.Amount) + ' XRP' : `${txData.Amount.value} ${txData.Amount.currency}`;
      } else if (txData.TransactionType === 'AMMDeposit' || txData.TransactionType === 'AMMWithdraw') {
        type = txData.TransactionType;
        amount = `${dropsToXrp(txData.Amount)} XRP, ${txData.Amount2.value} ${txData.Amount2.currency}`;
        issuer1 = txData.Amount.issuer || 'N/A';
        issuer2 = txData.Amount2.issuer || 'N/A';

        tx.meta.AffectedNodes.forEach(node => {
          if (node.ModifiedNode && node.ModifiedNode.LedgerEntryType === 'AMM') {
            const finalLpBalance = parseFloat(node.ModifiedNode.FinalFields.LPTokenBalance.value);
            const previousLpBalance = parseFloat(node.ModifiedNode.PreviousFields.LPTokenBalance.value);
            lpTokens = (finalLpBalance - previousLpBalance).toString();
            totalLpTokens = finalLpBalance.toString();
            ammAccount = node.ModifiedNode.FinalFields.LPTokenBalance.issuer;

            if (totalLpTokens !== '0') {
              ammOwnership = ((parseFloat(lpTokens) / finalLpBalance) * 100).toFixed(4).toString();
            }
          }
        });

        recipient = ammAccount;
      }

      const timestamp = txData.date + 946684800; // Correct the Ripple epoch (January 1, 2000) to Unix epoch (January 1, 1970)
      const date = new Date(timestamp * 1000).toLocaleString();
      return {
        id: txData.hash,
        date: date,
        sender: sender,
        recipient: recipient,
        amount: amount,
        type: type,
        lpTokens: lpTokens,
        ammOwnership: ammOwnership,
        issuer1: issuer1,
        issuer2: issuer2,
      };
    });
  } catch (error) {
    console.error('Error fetching transactions:', error.message);
    throw error;
  }
};




const fetchAmmTransactionsWithRetries = async (ammAccount, retries = 5, delay = 2000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fetchTransactions(ammAccount);
    } catch (error) {
      if (attempt < retries) {
        console.warn(`Retry ${attempt} failed. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
};

module.exports = {
  client,
  connectClient,
  fetchAmmDetails,
  fetchAllAmms,
  fetchTransactions,
  fetchAmmTransactionsWithRetries,
  xrpToDrops
};
