"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

const WRONG_GOOGLE_ACCOUNT_MSG =
  "Wrong Google account — pick the same email you typed above, or sign up first.";

type LoginFormProps = {
  oauthDenied?: boolean;
};

export default function LoginForm(props: LoginFormProps) {
  const { oauthDenied } = props;
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/check-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = (await res.json()) as { exists?: boolean };
    if (!data.exists) {
      setError("Email not found! Please sign up first.");
      setLoading(false);
      return;
    }

    const intentRes = await fetch("/api/auth/oauth-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ intent: "login", email }),
    });

    if (!intentRes.ok) {
      setError("Could not start login. Try again.");
      setLoading(false);
      return;
    }

    await signIn("google", {
      callbackUrl: "/",
      login_hint: email,
    });
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
        {error ? (
          <p className="mb-4 text-center text-sm text-red-500">{error}</p>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={function onEmailChange(e) {
              setEmail(e.target.value);
            }}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-2 text-white transition hover:bg-blue-700"
          >
            {loading ? "Checking..." : "Login"}
          </button>
        </form>

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
