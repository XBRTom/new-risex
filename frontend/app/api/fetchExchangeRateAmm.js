import axios from 'axios';


export default async function handler(req, res) {
  try {
    const response = await axios.get('https://data.xrplf.org/v1/iou/exchange_rates/XRP/rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq_USD?only_amm=true');
    const exchangeRate = response.data.rate;

    res.status(200).json({ exchangeRate });
  } catch (error) {
    console.error('Failed to fetch exchange rate:', error.message);
    console.error(error.response ? error.response.data : error.message);
    res.status(500).json({ error: `Failed to fetch exchange rate: ${error.message}` });
  }
}
