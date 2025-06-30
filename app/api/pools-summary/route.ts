import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/libs/prisma';

export async function GET(req: NextRequest) {
  try {
    console.log('Fetching pools summary statistics...');

    // Get summary statistics for all pools
    const result = await prisma.$queryRaw`
      SELECT 
        COUNT(*) as total_pools,
        COALESCE(SUM(CAST(totalValueLocked AS DECIMAL)), 0) as total_tvl,
        COALESCE(SUM(CAST(totalPoolVolume AS DECIMAL)), 0) as total_volume,
        COALESCE(AVG(CAST(relativeAPR AS DECIMAL)), 0) as average_apr
      FROM Pool
      WHERE totalValueLocked IS NOT NULL 
        AND totalPoolVolume IS NOT NULL 
        AND relativeAPR IS NOT NULL
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
