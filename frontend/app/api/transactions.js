import { fetchTransactions } from '@/libs/xrpl';

export default async function handler(req, res) {
  const { address } = req.query;

  try {
    const transactions = await fetchTransactions(address);
    res.status(200).json({ transactions });
  } catch (error) {
    console.error(`Failed to fetch transactions for address ${address}:`, error);
    res.status(500).json({ error: `Failed to fetch transactions for address ${address}` });
  }
}
