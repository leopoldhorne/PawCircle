import nodemailer from "nodemailer";
import { supabaseAdmin } from "../db/supabase-admin";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendGiftEmail({
  userId,
  petName,
  creatorAmountCents,
  gifterEmail,
}: {
  userId: string;
  petName: string;
  creatorAmountCents: number;
  gifterEmail: string;
}) {
  const { data: userEmail, error: userEmailError } = await supabaseAdmin
    .from("users")
    .select()
    .eq("id", userId)
    .single();

  if (userEmailError) {
    throw new Error("CANT FIND USER EMAIL");
  }
  try {
    const info = await transporter.sendMail({
      from: '"PawCircle" <pawcircleteam@gmail.com>',
      to: userEmail?.email,
      subject: `🎁 ${petName[0].toUpperCase() + petName.slice(1)} just received a new gift!`,
      html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 480px;">
      <h2 style="color: #9333ea; margin-bottom: 16px;">New Gift for ${petName[0].toUpperCase() + petName.slice(1)}</h2>

      <p>${petName[0].toUpperCase() + petName.slice(1)} just received a new gift of 
        <strong>$${(creatorAmountCents / 100).toFixed(2)}</strong>.
      </p>

      <p>The gift was sent by:
        <strong>${gifterEmail}</strong>
      </p>

      <p>You can view this gift and your updated balance in your dashboard:</p>

      <a href="https://pawcircle.app/auth"
         style="display:inline-block;background:#9333ea;color:white;padding:10px 18px;border-radius:6px;text-decoration:none;margin-top:12px;">
        Open PawCircle
      </a>

      <hr style="margin:24px 0;border:0;border-top:1px solid #eee;" />
      <p style="font-size: 13px; color: #777;">
        You’re receiving this message because your pet has a PawCircle profile. 
        If this wasn’t you, you can safely ignore this email.
      </p>
    </div>
        `,
      text: `
    New Gift for ${petName}!
    ${petName} just received a gift of $${(creatorAmountCents / 100).toFixed(2)}
    Sent by: ${gifterEmail}

    View your dashboard: https://pawcircle.app/auth
    `.trim(),
    });

    console.log("[sendGiftEmail] email sent", {
      messageId: info.messageId,
      response: info.response,
    });

    return info

  } catch (error: any) {
    console.log("fail to send gift email", error.message);
    throw new Error(error.message);
  }
}
