import { platformFee } from "@/lib/platform-fee";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/server/db/supabase-admin";
import { sendGiftEmail } from "@/server/nodemailer/nodemailer";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  const webhookSecret = process.env.STRIPE_WEBHOOK!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature || "",
      webhookSecret
    );
    console.log("success");
  } catch (error: any) {
    console.log("ERROR RECEIVING WEBHOOK", error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }
      default:
        console.log("Unhandled event type" + event.type);
    }
  } catch (error: any) {
    console.log("EVENT ERROR", error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ status: 200 });
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  try {
    const { petId, petSlug, petName, userId } = session?.metadata!;
    const { id: sessionId, payment_intent, amount_total, customer_details } = session;

    const supporterEmail = customer_details?.email
    const supporterName = customer_details?.name

    const platformFeeCents = Math.floor(amount_total! * platformFee)

    const note = session.custom_fields[0].text?.value || null

    const { data, error } = await supabaseAdmin.from("gifts").insert({
        user_id: userId,
        pet_id: petId,
        stripe_payment_intent_id: payment_intent,
        stripe_checkout_session_id: sessionId,
        amount_total_cents: amount_total,
        platform_fee_cents: platformFeeCents,
        creator_earnings_cents: amount_total! - platformFeeCents,
        status: "pending",
        available_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        supporter_email: supporterEmail,
        supporter_name: supporterName,
        note: note,
    })

    if (error) {
        console.log(error.message)
        throw new Error("CANT UPDATE DB:")
    }

    sendGiftEmail({userId: userId, petName: petName, creatorAmountCents: amount_total! - platformFeeCents, gifterEmail: supporterEmail!, giftNote: note || ""})



  } catch (error: any) {
    console.log(error.message);
  }
}
