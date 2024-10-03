import axios from 'axios';

export default async function handler(req, res) {
  const { ammAccount } = req.query;

  console.log(`Received request for AMM account: ${ammAccount}`);

  try {
    const response = await axios.get(`https://api.xrpscan.com/api/v1/account/${ammAccount}/trustlines2`);
    const accountTrustLines = response.data;

    console.log('Fetched Account TrustLines');  // Log the trust lines data
    res.status(200).json({ accountTrustLines });
  } catch (error) {
    console.error('Failed to fetch Trust Lines:', error.message);
    res.status(500).json({ error: `Failed to fetch Trust Lines: ${error.message}` });
  }
}
