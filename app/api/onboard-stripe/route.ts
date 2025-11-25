import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { userData } = await request.json();
  try {
    if (!userData) {
      return NextResponse.json({ error: "NO USER DATA" }, { status: 400 });
    }

    const onboardLink = await stripe.accountLinks.create({
      account: userData.stripe_account_id,
      type: "account_onboarding",
      refresh_url: `${process.env.NEXT_PUBLIC_BASE_URL}/c/dashboard/earnings?onboarding=retry`,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/c/dashboard/earnings?onboarding=success`,
    });

    return NextResponse.json({ onboardingUrl: onboardLink.url }, {status: 200});
  } catch (error: any) {
    return NextResponse.json({ error: "INTERNAL ERROR" }, { status: 500 });
  }
}
