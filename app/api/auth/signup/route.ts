import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  const { data: existingUser } = await supabaseAdmin
    .from("users")
    .select("email")
    .eq("email", email)
    .single();

  if (existingUser) {
    return NextResponse.json(
      { error: "This email is already registered" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const { error } = await supabaseAdmin.from("users").insert({
    name,
    email,
    password: hashedPassword,
    provider: "credentials",
    created_at: new Date().toISOString(),
  });

  if (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}