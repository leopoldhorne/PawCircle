import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { userData } = await request.json();
  try {
    if (!userData) {
      return NextResponse.json({ error: "NO USER DATA" }, { status: 400 });
    }

    const link = await stripe.accounts.createLoginLink(userData.stripe_account_id);

    return NextResponse.json({ url: link.url }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: "INTERNAL ERROR" }, { status: 500 });
  }
}
