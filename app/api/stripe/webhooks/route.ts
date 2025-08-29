import { NextResponse } from "next/server";

// Stripe functionality disabled - no environment variables configured
export async function POST(req: Request) {
  console.log("Stripe webhook endpoint called but not configured");
  return NextResponse.json(
    { message: "Stripe webhooks not configured" },
    { status: 501 }
  );
}
