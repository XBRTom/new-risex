import { auth } from "@/auth";
import { Xumm } from "xumm";
import { NextResponse } from "next/server";

const frontAppUrl = process.env.NEXT_PUBLIC_FRONT_APP_URL || 'http://localhost:3000'

// Initialize XUMM only when needed to avoid build-time errors
function getXummInstance() {
  const apiKey = process.env.NEXT_PUBLIC_XUMM_API_KEY;
  const apiSecret = process.env.NEXT_PUBLIC_XUMM_API_SECRET;
  
  if (!apiKey || !apiSecret) {
    throw new Error('XUMM API credentials not configured');
  }
  
  return new Xumm(apiKey, apiSecret);
}

export const GET = auth(async (req, context: { params?: Record<string, string | string[]> }) => {
  if (!req.auth) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }
  
  const currentUser = req.auth.user;
  if (!currentUser?.email) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }
  const uuid = context.params?.uuid as string || '';
  console.log('uuid', uuid)
  try {
    const xumm = getXummInstance();
    const payload = await xumm.payload?.get(uuid)
    return NextResponse.json({ payload});
  } catch (error) {
    console.error('Failed to get transaction:', error);
    return NextResponse.json({ message: "Failed to get transaction" }, { status: 500 });
  }
}) as any;