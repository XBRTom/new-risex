import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/libs/prisma';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';
export const revalidate = false;

export async function GET(req: NextRequest) {
  try {
    // Get URL parameters
    const { searchParams } = new URL(req.url);
    const poolId = searchParams.get('poolId');

    if (poolId) {
      // If poolId is specified, get latest metrics for that specific pool
      const latestMetric = await prisma.globalPoolMetrics.findFirst({
        where: { poolId: parseInt(poolId) },
        orderBy: { date: 'desc' },
      });
      
      return NextResponse.json(latestMetric ? [latestMetric] : []);
    } else {
      // Get latest metrics for all pools using a more efficient query
      const latestMetrics = await prisma.$queryRaw`
        SELECT gpm.*
        FROM GlobalPoolMetrics gpm
        INNER JOIN (
          SELECT poolId, MAX(date) as maxDate
          FROM GlobalPoolMetrics
          GROUP BY poolId
        ) latest ON gpm.poolId = latest.poolId AND gpm.date = latest.maxDate
        ORDER BY gpm.date DESC
      `;

      return NextResponse.json(latestMetrics);
    }
  } catch (error) {
    console.error('Error fetching latest metrics:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch latest metrics', 
      details: (error as Error).message 
    }, { status: 500 });
  }
}
