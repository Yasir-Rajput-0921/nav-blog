import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json(
      { error: "Email is required" },
      { status: 400 }
    );
  }

  const { data: user } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (!user) {
    return NextResponse.json({
      message: "If email is registered, a link has been sent to your email",
    });
  }

  if (user.provider === "google") {
    return NextResponse.json(
      { error: "This account is created with Google. Please login with Google." },
      { status: 400 }
    );
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 60 * 60 * 1000);

  await supabaseAdmin
    .from("users")
    .update({
      reset_token: token,
      token_expiry: expiry.toISOString(),
    })
    .eq("email", email);

  const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

  const fromAddress =
    process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

  const { error: sendError } = await resend.emails.send({
    from: fromAddress,
    to: `${email}`,
    subject: "Password Reset Request",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>You have requested to reset your password.</p>
        <p>Click the button below to reset your password:</p>
        <a 
          href="${resetLink}" 
          style="
            background: #2563eb; 
            color: white; 
            padding: 12px 24px; 
            border-radius: 8px; 
            text-decoration: none;
            display: inline-block;
            margin: 16px 0;
          "
        >
          Password Reset Request
        </a>
        <p style="color: #666; font-size: 14px;">
          This link will expire in 1 hour.
        </p>
        <p style="color: #666; font-size: 14px;">
          If you did not request this reset, please ignore this email.
        </p>
      </div>
    `,
  });

  if (sendError) {
    const status =
      typeof sendError.statusCode === "number" &&
      sendError.statusCode >= 400 &&
      sendError.statusCode < 600
        ? sendError.statusCode
        : 502;
    return NextResponse.json(
      {
        error:
          sendError.message ??
          "Could not send the reset email. Please try again later.",
      },
      { status }
    );
  }

  return NextResponse.json({
    message: "If email is registered, a link has been sent to your email",
  });
}