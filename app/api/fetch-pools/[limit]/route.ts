import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/libs/prisma';
import { getPools } from '@prisma/client/sql'

type Params = {
    limit: string;
};

export async function GET(req: NextRequest, context: {params: Params}) {
  try {
    const limit = parseInt(context.params.limit || '10', 10);

    // TODO: find a better way to get the last cron datetime, because the simple date is not enough, we can have multilpe crons in one day
    const currentDate = new Date().toISOString().split('T')[0] + '%';
    //const currentDate = '2024-10-09 20%';
    const pools = await prisma.$queryRawTyped(getPools(currentDate, currentDate, currentDate, currentDate, limit));

    return NextResponse.json({ pools, totalPools: pools.length });
  } catch (error) {
    console.error('Failed to fetch pools from the database:', error);
    return NextResponse.json({ error: 'Failed to fetch pools' }, { status: 500 });
  }
}