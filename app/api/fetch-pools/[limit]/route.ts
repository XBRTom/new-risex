import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/libs/prisma';
import { getPoolsMax } from '@prisma/client/sql'

type Params = {
    limit: string;
};

export async function GET(req: NextRequest, context: {params: Params}) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(context.params.limit || '15', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);
    
    // Input validation and security limits
    if (limit > 100 || limit < 1) {
      return NextResponse.json({ error: 'Invalid limit. Must be between 1 and 100' }, { status: 400 });
    }
    if (page < 1) {
      return NextResponse.json({ error: 'Invalid page. Must be 1 or greater' }, { status: 400 });
    }
    
    const offset = (page - 1) * limit;

    console.log(`Fetching pools: limit=${limit}, page=${page}, offset=${offset}`);

    // Get paginated pools
    const pools = await prisma.$queryRawTyped(getPoolsMax(limit, offset));
    
    // Get total count for pagination (we'll optimize this later)
    const totalCount = await prisma.pool.count();

    console.log(`Found ${pools.length} pools out of ${totalCount} total`);

    return NextResponse.json({ 
      pools, 
      totalPools: totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      hasMore: offset + pools.length < totalCount
    });
  } catch (error) {
    console.error('Failed to fetch pools from the database:', error);
    return NextResponse.json({ error: 'Failed to fetch pools' }, { status: 500 });
  }
}
