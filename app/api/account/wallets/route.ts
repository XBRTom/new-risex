import { auth } from "@/auth";
import { Xumm } from "xumm";

const apiKey = process.env.NEXT_PUBLIC_XUMM_API_KEY || '';
const apiSecret = process.env.NEXT_PUBLIC_XUMM_API_SECRET || '';
const frontAppUrl = process.env.NEXT_PUBLIC_FRONT_APP_URL || 'http://localhost:3000'

const xumm = new Xumm(apiKey, apiSecret);

export const POST = auth(async (req) => {
  if (!req.auth) {
    return Response.json({ message: "Not authenticated" }, { status: 401 });
  }

  const currentUser = req.auth.user;
  if (!currentUser?.email) {
    return Response.json({ message: "Not authenticated" }, { status: 401 });
  }

  const { transaction, return_url } = await req.json();

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
          instruction: "Thank you for signing this transaction using the xaman wallet"
        }
      })
    return Response.json({ payload});
  } catch (error) {
    console.error('Failed to sign transaction:', error);
    return Response.json({ message: "Failed to sign transaction" }, { status: 500 });
  }
}) as any;