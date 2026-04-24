import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { token, password } = await req.json();

  if (!token || !password) {
    return NextResponse.json(
      { error: "Token and password are required" },
      { status: 400 }
    );
  }

  const { data: user } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("reset_token", token)
    .single();

  if (!user) {
    return NextResponse.json(
      { error: "Invalid or expired link" },
      { status: 400 }
    );
  }

  const now = new Date();
  const expiry = new Date(user.token_expiry);

  if (now > expiry) {
    return NextResponse.json(
      { error: "Link has expired. Please request a new link." },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await supabaseAdmin
    .from("users")
    .update({
      password: hashedPassword,
      reset_token: null,
      token_expiry: null,
    })
    .eq("id", user.id);

  return NextResponse.json({
    message: "Password updated. Please login.",
  });
}