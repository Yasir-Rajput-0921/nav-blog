import { NextRequest, NextResponse } from "next/server";

type OAuthIntent = "login" | "signup";

type OAuthIntentRequestBody = {
  intent?: OAuthIntent;
};

function isValidIntent(intent: string): intent is OAuthIntent {
  return intent === "login" || intent === "signup";
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as OAuthIntentRequestBody;
  const intent = body.intent;

  if (!intent || !isValidIntent(intent)) {
    return NextResponse.json(
      { error: "Invalid OAuth intent" },
      { status: 400 }
    );
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("oauth_intent", intent, {
    path: "/",
    maxAge: 60 * 5,
    sameSite: "lax",
  });

  return response;
}
