import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { amount_in_cents, petId, petSlug, petName, userId, petImageUrl } =
      await request.json();

    if (
      !amount_in_cents ||
      !petId ||
      !petSlug ||
      !petName ||
      !userId ||
      !petImageUrl
    ) {
      return NextResponse.json(
        {
          error:
            "amount_in_cents, petId, petSlug, petName, userId, and petImageUrl are required",
        },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: amount_in_cents,
            product_data: {
              name: `${petName[0].toUpperCase() + petName.slice(1)}'s Gift`,
              images: [petImageUrl],
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: { petId, petSlug, petName, userId },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/thank-you?sesion_id={CHECKOUT_SESSION_ID}&petName=${encodeURIComponent(petName)}&imageUrl=${encodeURIComponent(petImageUrl)}&amount=${encodeURIComponent(amount_in_cents)}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/p/${petSlug}`,
      custom_fields: [
        {
          key: "note",
          label: {
            type: "custom",
            custom: `Add a message for ${petName[0].toUpperCase() + petName.slice(1)}`
          },
          type: "text",
          optional: true,
        },
      ],
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { error: error.message }, //"Internal Server Error."
      { status: 500 }
    );
  }
}
