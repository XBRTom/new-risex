import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/libs/prisma';

export async function GET(req: NextRequest) {
  try {
    const latestMetrics = await prisma.globalPoolMetrics.findMany({
      orderBy: {
        date: 'desc',
      },
      distinct: ['poolId'],
    });

    return NextResponse.json(latestMetrics);
  } catch (error) {
    console.error('Error fetching latest metrics:', error);
    return NextResponse.json({ error: 'Failed to fetch latest metrics', details: (error as Error).message }, { status: 500 });
  }
}