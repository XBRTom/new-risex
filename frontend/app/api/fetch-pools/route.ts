import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/libs/prisma';

type Params = {
    page: number;
    limit: number;
    };

export async function GET(req: NextRequest, context: {params:Params}) {
    try {
        const page = 1;
        const limit = 10;

    // Calculate the number of items to skip
    const skip = (page - 1) * limit;

    const pools = await prisma.pool.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        account: true,
        asset_currency: true,
        asset2_currency: true,
        balance: true,
        tradingFee: true,
        metrics: {
          orderBy: {
            date: 'desc', // Order metrics by date to get the latest
          },
          take: 1, // Take only the latest metric
          select: {
            totalPoolVolume: true,
            feesGenerated: true,
            relativeAPR: true,
            grossAPR: true,
            totalValueLocked: true,
            poolYield: true,
            date: true, // Include the date to know when it was recorded
          },
        },
        // Only select necessary fields to minimize response size
      },
    });

    console.log('Fetched pools with metrics:', pools);
    const totalPools = await prisma.pool.count(); // To calculate total pages

    return NextResponse.json({ pools, totalPools });
  } catch (error) {
    console.error('Failed to fetch pools from the database:', error);
    return NextResponse.json({ error: 'Failed to fetch pools' }, { status: 500 });
  }
}