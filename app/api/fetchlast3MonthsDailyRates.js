import axios from 'axios';
import prisma from '../../libs/prisma'; // Adjust the path as needed

const BASE_URL = 'https://data.xrplf.org/v1/iou/exchange_rates/XRP';

const fetchDailyExchangeRate = async (counterCurrency, targetCurrency, startDate, endDate) => {
  let currentDate = new Date(startDate);
  const end = new Date(endDate);
  const rates = [];

  while (currentDate <= end) {
    const formattedDate = currentDate.toISOString();
    let apiUrl = `${BASE_URL}/${counterCurrency}?date=${formattedDate}`;

    if (counterCurrency === 'XRP') {
      rates.push({
        targetCurrency: targetCurrency,
        rate: 1,
        timestamp: new Date(formattedDate),
        issuer: 'XRP',
      });
      currentDate.setDate(currentDate.getDate() + 1);
      continue;
    }

    try {
      console.log(`Fetching rate for ${counterCurrency} on ${formattedDate}`);
      console.log(`URL: ${apiUrl}`);
      const response = await axios.get(apiUrl);
      const rate = response.data.rate;

      rates.push({
        targetCurrency: targetCurrency,
        rate: rate,
        timestamp: new Date(formattedDate),
        issuer: counterCurrency.split('_')[0],  // Extract issuer from counterCurrency
      });

      // Move to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    } catch (error) {
      console.error(`Failed to fetch exchange rate for ${counterCurrency} on ${formattedDate}:`, error.message);
      console.log('Error details:', error.response?.data);

      // Move to the next day even if there's an error
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  return rates;
};

const fetchAllRatesForLastThreeMonths = async () => {
  const pools = await prisma.pool.findMany({
    select: {
      asset_currency: true,
      asset_issuer: true,
      asset2_currency: true,
      asset2_issuer: true,
    }
  });

  const endDate = new Date('2024-08-04T12:00:00.432Z');  // Set end date to 2024-08-04T12:00:00.432Z
  const startDate = new Date(endDate);
  startDate.setMonth(startDate.getMonth() - 3);  // 3 months before the end date

  for (const pool of pools) {
    const counterCurrencies = [
      pool.asset_currency === 'XRP' ? 'XRP' : `${pool.asset_issuer}_${pool.asset_currency}`,
      pool.asset2_currency === 'XRP' ? 'XRP' : `${pool.asset2_issuer}_${pool.asset2_currency}`
    ];
    const targetCurrencies = [pool.asset_currency, pool.asset2_currency];

    for (let i = 0; i < counterCurrencies.length; i++) {
      const counterCurrency = counterCurrencies[i];
      const targetCurrency = targetCurrencies[i];
      const rates = await fetchDailyExchangeRate(counterCurrency, targetCurrency, startDate, endDate);

      for (const rate of rates) {
        await prisma.exchangeRate.create({
          data: rate,
        });
      }
    }
  }

  console.log('Exchange rates fetched and stored successfully');
};

// Ensure default export of the handler function
export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      await fetchAllRatesForLastThreeMonths();
      res.status(200).json({ message: 'Exchange rates fetched and stored successfully' });
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error.message);
      res.status(500).json({ message: 'Failed to fetch exchange rates' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
