import { NextRequest } from "next/server";
import { transporter } from "@/server/nodemailer/nodemailer";

export async function GET(req: NextRequest) {
  console.log("[test-email] hit");

  try {
    const info = await transporter.sendMail({
      from: '"PawCircle" <pawcircleteam@gmail.com>',
      to: "leopoldhorne1@gmail.com",
      subject: "PawCircle prod test",
      text: "If you see this, prod SMTP works.",
    });

    console.log("[test-email] sent", info);
    return Response.json({ ok: true });
  } catch (err: any) {
    console.error("[test-email] error", err);
    return new Response("Error", { status: 500 });
  }
}