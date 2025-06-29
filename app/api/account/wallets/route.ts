import { auth } from "@/auth";
import { Xumm } from "xumm";
import { NextResponse } from "next/server";

const apiKey = process.env.NEXT_PUBLIC_XUMM_API_KEY || '';
const apiSecret = process.env.NEXT_PUBLIC_XUMM_API_SECRET || '';
const frontAppUrl = process.env.NEXT_PUBLIC_FRONT_APP_URL || 'http://localhost:3000'
const xumm = new Xumm(apiKey, apiSecret);

export const POST = auth(async (req) => {
  if (!req.auth) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const currentUser = req.auth.user;
  if (!currentUser?.email) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const { transaction, return_url } = await req.json();
  console.log('transaction', transaction)
  console.log('return_url', return_url)
  try {
    const payload = await xumm.payload?.create({
        txjson: transaction,
        options: {
          return_url: {
            web: return_url ?? frontAppUrl
          },
          force_network: "DEVNET", // MAINNET // DEVNET // TESTNET
          submit: true,
          multisign: false,
          expire: 300
        },
        custom_meta: {
          instruction: "Sign your transaction using the xaman wallet"
        }
      })
      console.log('After payload create', payload)
    return NextResponse.json({ payload});
  } catch (error) {
    console.error('Failed to sign transaction:', error);
    return NextResponse.json({ message: "Failed to sign transaction" }, { status: 500 });
  }
}) as any;