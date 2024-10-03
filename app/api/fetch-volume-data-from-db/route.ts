import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/libs/prisma';

export async function GET(req: NextRequest) {
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

    return NextResponse.json(latestVolumeData);
  } catch (error) {
    console.error('Failed to fetch volume data:', error);
    return NextResponse.json({ message: 'Failed to fetch volume data' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
