import { NextResponse, NextRequest } from "next/server";
import prisma from '@/libs/prisma'; // Adjust the path as necessary
import {fetchAmmInfo} from '@/libs/db';

type Params = {
  account: string
}

export async function GET(req: NextRequest, context: { params: Params }) {
  console.log('Fetching AMM info from the database', context);

   const { account } = context.params;
  
  // Extract 'base' and 'counter' from the query parameters
  if (!account) {
    return NextResponse.json({ error: 'Missing required query parameters' }, {status: 400});
  }

  try {
    const ammInfo = await fetchAmmInfo(account);

    // Count unique addresses in the pool
    // const uniqueAddressesCount = accounts.size;

    if (!ammInfo) {
      return NextResponse.json({ error: 'AMM info not found' }, {status: 401});
    }
    // res.status(200).json({ ...ammInfo, pool: { ...ammInfo.pool, voteSlots: topVoteSlots } });
    return NextResponse.json(ammInfo, {status: 200});
  } catch (error) {
    console.error('Failed to fetch AMM info from the database:', error);
    // res.status(500).json({ error: 'Failed to fetch AMM info' });
    return NextResponse.json({ error: 'Failed to fetch AMM info' }, {status: 500});
  } finally {
    // await prisma.$disconnect();
  }
};

