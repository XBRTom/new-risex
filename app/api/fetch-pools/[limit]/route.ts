import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/libs/prisma';
import { getPoolsMax } from '@prisma/client/sql'

type Params = {
    limit: string;
};

export async function GET(req: NextRequest, context: {params: Params}) {
  try {
    const limit = parseInt(context.params.limit || '10', 10);
    //const currentDate = new Date().toISOString().split('T')[0] + '%';
    // const pools = await prisma.$queryRawTyped(getPools(currentDate, currentDate, currentDate, currentDate, limit));
    const pools = await prisma.$queryRawTyped(getPoolsMax(limit, 0));

    return NextResponse.json({ pools, totalPools: pools.length });
  } catch (error) {
    console.error('Failed to fetch pools from the database:', error);
    return NextResponse.json({ error: 'Failed to fetch pools' }, { status: 500 });
  }
}