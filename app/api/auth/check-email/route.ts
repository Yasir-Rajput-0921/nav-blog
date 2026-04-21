import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  const registeredEmails = ["rana@test.com", "test@gmail.com"];

  const exists = registeredEmails.includes(email);

  return NextResponse.json({ exists });
}