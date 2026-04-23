import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

type CheckEmailRequestBody = {
  email?: string;
};

export async function POST(request: NextRequest) {
  const body = (await request.json()) as CheckEmailRequestBody;
  const email = body.email?.trim();

  if (!email) {
    return NextResponse.json(
      { error: "Email is required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("users")
    .select("id")
    .ilike("email", email)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: "Unable to check email" },
      { status: 500 }
    );
  }

  return NextResponse.json({ exists: Boolean(data) });
}
