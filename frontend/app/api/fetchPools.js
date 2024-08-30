import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    const { page = 1, limit = 10 } = req.query;

    // Calculate the number of items to skip
    const skip = (page - 1) * limit;

    const pools = await prisma.pool.findMany({
      skip,
      take: parseInt(limit),
      select: {
        id: true,
        account: true,
        asset_currency: true,
        asset2_currency: true,
        balance: true,
        tradingFee: true,
        metrics: {
          orderBy: {
            date: 'desc', // Order metrics by date to get the latest
          },
          take: 1, // Take only the latest metric
          select: {
            totalPoolVolume: true,
            feesGenerated: true,
            relativeAPR: true,
            grossAPR: true,
            totalValueLocked: true,
            poolYield: true,
            date: true, // Include the date to know when it was recorded
          },
        },
        // Only select necessary fields to minimize response size
      },
    });
   
    console.log('Fetched pools with metrics:', pools);
    const totalPools = await prisma.pool.count(); // To calculate total pages
    res.status(200).json({ pools, totalPools });
  } catch (error) {
    console.error('Failed to fetch pools from the database:', error);
    res.status(500).json({ error: 'Failed to fetch pools' });
  }
}




