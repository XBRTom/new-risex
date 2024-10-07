import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/libs/prisma';
import { getPoolsMax } from '@prisma/client/sql'

type Params = {
    page: string;
    limit: string;
    };

export async function GET(req: NextRequest, context: {params:Params}) {
  try {
    const page = parseInt(context.params.page || '1', 10);
    const limit = parseInt(context.params.limit || '10', 10);
    // Calculate the number of items to skip
    const skip = (page - 1) * limit;

    const totalPools = await prisma.pool.count(); // To calculate total pages
    const pools = await prisma.$queryRawTyped(getPoolsMax(limit, skip));

    return NextResponse.json({ pools, totalPools });
  } catch (error) {
    console.error('Failed to fetch pools from the database:', error);
    return NextResponse.json({ error: 'Failed to fetch pools' }, { status: 500 });
  }
}