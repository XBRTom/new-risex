// pages/api/historical-metrics.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { poolId } = req.query;

  if (!poolId) {
    return res.status(400).json({ error: 'Pool ID is required' });
  }

  try {
    const metrics = await prisma.globalPoolMetrics.findMany({
      where: { poolId: parseInt(poolId) },
      orderBy: { date: 'desc' }, // Order by date descending
    });

    res.status(200).json(metrics);
  } catch (error) {
    console.error('Error fetching historical metrics:', error);
    res.status(500).json({ error: 'Failed to fetch historical metrics' });
  }
}
