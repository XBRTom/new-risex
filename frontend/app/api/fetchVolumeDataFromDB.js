import prisma from '../../libs/prisma';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Fetch latest volume data for each pool
      const latestVolumeData = await prisma.$queryRaw`
        SELECT v.poolId, v.baseVolume, v.counterVolume
        FROM DailyVolume v
        INNER JOIN (
          SELECT poolId, MAX(dateTo) as maxDate
          FROM DailyVolume
          GROUP BY poolId
        ) latest ON v.poolId = latest.poolId AND v.dateTo = latest.maxDate;
      `;

      res.status(200).json(latestVolumeData);
    } catch (error) {
      console.error('Failed to fetch volume data:', error);
      res.status(500).json({ message: 'Failed to fetch volume data' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
