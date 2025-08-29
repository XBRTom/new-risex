import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/libs/prisma';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';
export const revalidate = false;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const poolId = searchParams.get('poolId');

  if (!poolId) {
    return NextResponse.json({ error: 'Pool ID is required' }, { status: 400 });
  }

  try {
    const metrics = await prisma.globalPoolMetrics.findMany({
      where: { poolId: parseInt(poolId) },
      orderBy: { date: 'desc' }, // Order by date descending
    });

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Error fetching historical metrics:', error);
    return NextResponse.json({ error: 'Failed to fetch historical metrics' }, { status: 500 });
  }
}