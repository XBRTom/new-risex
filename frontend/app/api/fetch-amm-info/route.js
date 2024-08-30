import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET(req, res) {
  const {searchParams} = new URL(req.url);

  // Extract 'base' and 'counter' from the query parameters
  const account = searchParams.get('account');
  if (!account) {
    return NextResponse.json({ error: 'Missing required query parameters' }, {status: 400});
  }

  try {
    const ammInfo = await prisma.ammInfo.findFirst({
      where: { account: account },
      include: {
        pool: {
          include: {
            auctionSlots: true,
            dailyTradingFees: {
              orderBy: {
                timestamp: 'desc',
              },
              take: 1, // Fetch only the latest entry
            },
            voteSlots: true,
            lpTokenBalances: {
              orderBy: {
                id: 'desc',
              },
              take: 1, // Fetch only the latest entry
            },
            dailyVolumes: {
              orderBy: {
                dateTo: 'desc',
              },
              take: 1, // Fetch only the latest entry
            }, // Including dailyVolumes for completeness
            // ammInfos: true, // Including ammInfos for completeness
          }
        },
        // exchangeRate: true // If ExchangeRate is a direct relation, otherwise adjust as needed
      },
    });

    if (!ammInfo) {
      return NextResponse.json({ error: 'AMM info not found' }, {status: 401});
    }

    
    // Step 1: Filter distinct accounts
    const distinctVoteSlots = [];
    const accounts = new Set();
    for (const voteSlot of ammInfo.pool.voteSlots) {
      if (!accounts.has(voteSlot.account)) {
        distinctVoteSlots.push(voteSlot);
        accounts.add(voteSlot.account);
      }
    }

    // Step 2: Sort by the latest id and pick the latest entry
    const sortedById = distinctVoteSlots.sort((a, b) => b.id - a.id);

    // Step 3: Sort by voteWeight and pick the top 8 entries
    const topVoteSlots = sortedById.sort((a, b) => b.voteWeight - a.voteWeight).slice(0, 8);

    // Count unique addresses in the pool
    // const uniqueAddressesCount = accounts.size;


    // res.status(200).json({ ...ammInfo, pool: { ...ammInfo.pool, voteSlots: topVoteSlots } });
    return NextResponse.json({ ...ammInfo, pool: { ...ammInfo.pool, voteSlots: topVoteSlots } }, {status: 200});
  } catch (error) {
    console.error('Failed to fetch AMM info from the database:', error);
    // res.status(500).json({ error: 'Failed to fetch AMM info' });
    return NextResponse.json({ error: 'Failed to fetch AMM info' }, {status: 500});
  } finally {
    await prisma.$disconnect();
  }
};

