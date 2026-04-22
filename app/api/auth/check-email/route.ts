import { NextRequest, NextResponse } from "next/server";
import { isRegisteredEmail } from "@/lib/registered-users";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { email?: string };
  const email = typeof body.email === "string" ? body.email : "";

  const exists = email.length > 0 && isRegisteredEmail(email);

  return NextResponse.json({ exists });
}
