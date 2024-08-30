import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    const latestMetrics = await prisma.globalPoolMetrics.findMany({
      orderBy: {
        date: 'desc',
      },
      distinct: ['poolId'],
    });

    res.status(200).json(latestMetrics);
  } catch (error) {
    console.error('Error fetching latest metrics:', error);
    res.status(500).json({ error: 'Failed to fetch latest metrics', details: error.message });
  }
}
