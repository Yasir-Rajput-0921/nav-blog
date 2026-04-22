"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

const WRONG_GOOGLE_ACCOUNT_MSG =
  "Could not complete login. Please try again.";
const SIGNUP_REQUIRED_MSG =
  "Email not found. Please sign up first.";
const OAUTH_CALLBACK_MSG =
  "Google could not finish sign-in. Confirm GOOGLE_CLIENT_SECRET in .env (must start with GOCSPX-) and that Authorized redirect URI in Google Cloud includes http://localhost:3000/api/auth/callback/google";

type LoginFormProps = {
  oauthDenied?: boolean;
  signupRequired?: boolean;
  oauthCallbackFailed?: boolean;
};

export default function LoginForm(props: LoginFormProps) {
  const { oauthDenied, signupRequired, oauthCallbackFailed } = props;
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGoogleLogin() {
    setLoading(true);
    setError("");

    const intentRes = await fetch("/api/auth/oauth-intent", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ intent: "login" }),
    });

    if (!intentRes.ok) {
      setError("Could not start login. Try again.");
      setLoading(false);
      return;
    }

    await signIn("google", { callbackUrl: "/" });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold">Login</h1>

        {oauthDenied ? (
          <p className="mb-4 text-center text-sm text-red-500">
            {WRONG_GOOGLE_ACCOUNT_MSG}
          </p>
        ) : null}
        {signupRequired ? (
          <p className="mb-4 text-center text-sm text-red-500">
            {SIGNUP_REQUIRED_MSG}
          </p>
        ) : null}
        {oauthCallbackFailed ? (
          <p className="mb-4 text-center text-sm text-red-500">{OAUTH_CALLBACK_MSG}</p>
        ) : null}
        {error ? (
          <p className="mb-4 text-center text-sm text-red-500">{error}</p>
        ) : null}

        <button
          type="button"
          disabled={loading}
          onClick={handleGoogleLogin}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 px-4 py-3 transition hover:bg-gray-50 disabled:opacity-60"
        >
          <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" aria-hidden>
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {loading ? "Opening Google..." : "Continue with Google"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
}
