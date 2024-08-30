import prisma from '../../libs/prisma';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const exchangeRates = await prisma.$queryRaw`
        SELECT e1.issuer, e1.targetCurrency, e1.rate
        FROM ExchangeRate e1
        INNER JOIN (
          SELECT issuer, targetCurrency, MAX(timestamp) AS latest
          FROM ExchangeRate
          GROUP BY issuer, targetCurrency
        ) e2 ON e1.issuer = e2.issuer AND e1.targetCurrency = e2.targetCurrency AND e1.timestamp = e2.latest;
      `;

      const rates = exchangeRates.reduce((acc, rate) => {
        if (!acc[rate.issuer]) {
          acc[rate.issuer] = {};
        }
        acc[rate.issuer][rate.targetCurrency] = rate.rate;
        return acc;
      }, {});

      res.status(200).json({ exchangeRates: rates });
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error.message);
      console.error('Stack trace:', error.stack);
      res.status(500).json({ message: 'Failed to fetch exchange rates' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
