import { Client, dropsToXrp, xrpToDrops } from 'xrpl';
import { AMM } from 'xrpl/dist/npm/models/ledger';

const client = new Client('wss://s1.ripple.com', {
  connectionTimeout: 10000, // Increase connection timeout to 10 seconds
});

const connectClient = async (): Promise<void> => {
  if (!client.isConnected()) {
    console.log('Connecting to XRPL Ledger...');
    await client.connect();
    console.log('Connected to XRPL Ledger');
  }
};

interface AmmDetails {
  accountData: any;
  ammData: any;
}

const fetchAmmDetails = async (ammAccount: string): Promise<AmmDetails> => {
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
  } catch (error: any) {
    console.error(`Error fetching AMM details for account ${ammAccount}: ${error.message}`);
    throw error;
  }
};

const fetchAllAmms = async (): Promise<string[]> => {
  await connectClient();
  const response = await client.request({
    command: 'ledger_entry',
    type: 'amm',
  });
  return response.result.node
    ? (Array.isArray(response.result.node)
      ? response.result.node.filter((amm): amm is AMM => amm.LedgerEntryType === 'AMM').map(amm => amm.Account)
      : response.result.node.LedgerEntryType === 'AMM' ? [response.result.node.Account] : [])
    : [];
};

export interface Transaction {
  id: string;
  date: string;
  sender: string;
  recipient: string;
  amount: string;
  type: string;
  lpTokens: string;
  ammOwnership: string;
  issuer1: string;
  issuer2: string;
  asset_currency?: string;
  asset2_currency?: string;
}

const fetchTransactions = async (address: string): Promise<Transaction[]> => {
  let transactions: any[] = [];
  let marker: string | null = null;

  try {
    await connectClient();
    let response: any;

    do {
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

      if (response.result.transactions) {
        transactions = transactions.concat(response.result.transactions);
      } else {
        console.warn('No transactions found in the response.');
        break;
      }

      marker = response.result.marker || null;

    } while (marker);

    return transactions.map((tx) => {
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

        tx.meta.AffectedNodes.forEach((node: any) => {
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
  } catch (error: any) {
    console.error('Error fetching transactions:', error.message);
    throw error;
  }
};

const fetchAmmTransactionsWithRetries = async (ammAccount: string, retries = 5, delay = 2000): Promise<Transaction[]> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fetchTransactions(ammAccount);
    } catch (error: any) {
      if (attempt < retries) {
        console.warn(`Retry ${attempt} failed. Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
  throw new Error('All retries failed'); // Add this line
};

export {
  client,
  connectClient,
  fetchAmmDetails,
  fetchAllAmms,
  fetchTransactions,
  fetchAmmTransactionsWithRetries,
  xrpToDrops,
};
