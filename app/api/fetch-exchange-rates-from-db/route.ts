import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/libs/prisma';

export async function GET(req: NextRequest, res: NextResponse) {
    try {
      const exchangeRates = await prisma.$queryRaw<
        { issuer: string; targetCurrency: string; rate: number }[]
      >`
        SELECT e1.issuer, e1.targetCurrency, e1.rate
        FROM ExchangeRate e1
        INNER JOIN (
          SELECT issuer, targetCurrency, MAX(timestamp) AS latest
          FROM ExchangeRate
          GROUP BY issuer, targetCurrency
        ) e2 ON e1.issuer = e2.issuer AND e1.targetCurrency = e2.targetCurrency AND e1.timestamp = e2.latest;
      `;

      const rates = exchangeRates.reduce((acc: Record<string, Record<string, number>>, rate: { issuer: string; targetCurrency: string; rate: number }) => {
        if (!acc[rate.issuer]) {
          acc[rate.issuer] = {};
        }
        acc[rate.issuer][rate.targetCurrency] = rate.rate;
        return acc;
      }, {} as Record<string, Record<string, number>>);

      return NextResponse.json({ exchangeRates: rates }, {status: 200});
    } catch (error) {
      console.error('Failed to fetch exchange rates:', (error as Error).message);
      console.error('Stack trace:', (error as Error).stack);
      return NextResponse.json({ message: 'Failed to fetch exchange rates' }, {status: 500});
    } finally {
      await prisma.$disconnect();
    }

}