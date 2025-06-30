import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/libs/prisma';

export async function GET(req: NextRequest) {
  try {
    console.log('Fetching pools summary statistics...');

    // Get summary statistics for all pools using GlobalPoolMetrics
    const result = await prisma.$queryRaw`
      SELECT 
        COUNT(DISTINCT p.id) as total_pools,
        COALESCE(SUM(CAST(gpm.totalValueLocked AS DECIMAL)), 0) as total_tvl,
        COALESCE(SUM(CAST(gpm.totalPoolVolume AS DECIMAL)), 0) as total_volume,
        COALESCE(AVG(CAST(gpm.relativeAPR AS DECIMAL)), 0) as average_apr
      FROM Pool p
      LEFT JOIN GlobalPoolMetrics gpm ON p.id = gpm.poolId
      WHERE gpm.totalValueLocked IS NOT NULL 
        AND gpm.totalPoolVolume IS NOT NULL 
        AND gpm.relativeAPR IS NOT NULL
    `;

    const summary = Array.isArray(result) ? result[0] : result;

    console.log('Summary statistics:', summary);

    return NextResponse.json({
      totalPools: parseInt(summary.total_pools?.toString() || '0'),
      totalTVL: parseFloat(summary.total_tvl?.toString() || '0'),
      totalVolume: parseFloat(summary.total_volume?.toString() || '0'),
      averageAPR: parseFloat(summary.average_apr?.toString() || '0')
    });
  } catch (error) {
    console.error('Failed to fetch pools summary:', error);
    return NextResponse.json({ error: 'Failed to fetch pools summary' }, { status: 500 });
  }
}
