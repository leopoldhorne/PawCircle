import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/server/db/supabase-admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { userData } = await request.json();

  try {
    if (!userData) {
      return NextResponse.json({ error: "NEED USERDATA" }, { status: 400 });
    }

    const { data: gifts, error: giftsError } = await supabaseAdmin
      .from("gifts")
      .select("id, creator_earnings_cents")
      .eq("user_id", userData.id)
      .eq("status", "available")
      .is("paid_out_at", null);

    if (giftsError) {
      return NextResponse.json({ error: "CANT FIND GIFTS" }, { status: 400 });
    }

    if (!gifts || gifts.length === 0) {
      return NextResponse.json(
        { error: "AVAILABLE BALANCE 0" },
        { status: 400 }
      );
    }

    const totalAmount = gifts.reduce(
      (sum, gift) => sum + gift.creator_earnings_cents,
      0
    );

    if (totalAmount <= 0) {
      return NextResponse.json(
        { error: "NO BALANCE TO WITHDRAW" },
        { status: 400 }
      );
    }

    const account = await stripe.accounts.retrieve(userData.stripe_account_id);

    if (!account.payouts_enabled) {
      return NextResponse.json(
        { error: "PAYOUTS NOT ENABLED" },
        { status: 400 }
      );
    }

    const transfer = await stripe.transfers.create({
      amount: totalAmount,
      currency: "usd",
      destination: userData.stripe_account_id,
      metadata: {
        user_id: userData.id,
        gift_count: gifts.length.toString(),
      },
    });

    const giftIds = gifts.map((gift) => gift.id);

    const { error: updateError } = await supabaseAdmin
      .from("gifts")
      .update({
        paid_out_at: new Date().toISOString(),
        stripe_transfer_id: transfer.id,
        status: "paid_out",
      })
      .in("id", giftIds);

    if (updateError) {
      return NextResponse.json(
        { error: "FAIL TO UPDATE DATABASE" },
        { status: 499 }
      );
    }

    return NextResponse.json(
      { success: true, transferId: transfer.id, amount_cents: totalAmount },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
