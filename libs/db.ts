import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const fetchAmmInfo = async (account: string) => {
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
      if(!ammInfo) {
        return null;
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
      return { ...ammInfo, pool: { ...ammInfo.pool, voteSlots: topVoteSlots }};
    }; 