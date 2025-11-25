import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/server/db/supabase-admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { userData } = await request.json();
  try {
  if (!userData) {
    return NextResponse.json({error: "NO USER DATA"}, {status: 400})
  }
  const account = await stripe.accounts.create({
    type: "express",
    country: userData.country,
    email: userData.email,
    capabilities: {
        transfers: {requested: true}
    },
  })

  const { error: dbError } = await supabaseAdmin.from("users").update({stripe_account_id: account.id}).eq("id", userData.id)

  if (dbError) {
    console.error("Supabase error saving stripe_account_id:", dbError);
    return NextResponse.json({error: "FAILED TO SAVE STRIPE ACCOUNT"}, {status: 405})
  }

  return NextResponse.json({success: true},{status: 200})

} catch (error: any) {
    return NextResponse.json({error: "INTERNAL ERROR"}, {status: 500})
}

}
