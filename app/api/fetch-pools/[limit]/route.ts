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
    const search = searchParams.get('search');
    
    // Input validation and security limits
    if (limit > 100 || limit < 1) {
      return NextResponse.json({ error: 'Invalid limit. Must be between 1 and 100' }, { status: 400 });
    }
    if (page < 1) {
      return NextResponse.json({ error: 'Invalid page. Must be 1 or greater' }, { status: 400 });
    }
    
    const offset = (page - 1) * limit;

    console.log(`Fetching pools: limit=${limit}, page=${page}, offset=${offset}, search=${search}`);

    let pools;
    let totalCount;

    if (search && search.trim()) {
      // Search functionality using Prisma's findMany with search filters
      const searchTerm = search.trim();
      
      pools = await prisma.pool.findMany({
        where: {
          OR: [
            {
              asset_currency: {
                contains: searchTerm
              }
            },
            {
              asset2_currency: {
                contains: searchTerm
              }
            },
            {
              account: {
                contains: searchTerm
              }
            }
          ]
        },
        take: limit,
        skip: offset,
        orderBy: {
          id: 'desc'
        }
      });
      
      totalCount = await prisma.pool.count({
        where: {
          OR: [
            {
              asset_currency: {
                contains: searchTerm
              }
            },
            {
              asset2_currency: {
                contains: searchTerm
              }
            },
            {
              account: {
                contains: searchTerm
              }
            }
          ]
        }
      });
    } else {
      // No search - use the existing optimized query
      pools = await prisma.$queryRawTyped(getPoolsMax(limit, offset));
      totalCount = await prisma.pool.count();
    }

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
