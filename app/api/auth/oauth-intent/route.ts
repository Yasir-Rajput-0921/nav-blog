import { NextResponse } from "next/server";
import {
  isRegisteredEmail,
  normalizeEmail,
} from "@/lib/registered-users";

const COOKIE_OPTS = {
  httpOnly: true,
  path: "/",
  maxAge: 600,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};

export async function POST(req: Request) {
  const body = (await req.json()) as { intent?: string; email?: string };
  const intent = body.intent;

  if (intent === "login") {
    const email =
      typeof body.email === "string" ? normalizeEmail(body.email) : "";
    if (!email || !isRegisteredEmail(email)) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    const res = NextResponse.json({ ok: true });
    res.cookies.set("oauth_intent", "login", COOKIE_OPTS);
    res.cookies.set("oauth_login_email", email, COOKIE_OPTS);
    return res;
  }

  if (intent === "signup") {
    const res = NextResponse.json({ ok: true });
    res.cookies.set("oauth_intent", "signup", COOKIE_OPTS);
    res.cookies.delete("oauth_login_email");
    return res;
  }

  return NextResponse.json({ ok: false }, { status: 400 });
}
