"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

function avatarInitial(name: string | null | undefined): string {
  const trimmed = name?.trim();
  if (!trimmed) {
    return "?";
  }
  return trimmed.charAt(0).toUpperCase();
}

export default function AuthButtons() {
    const { data: session, status } = useSession();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    if (status === "loading") return null;

    if (session) {
        const imageUrl = session.user?.image;
        const hasImage = typeof imageUrl === "string" && imageUrl.length > 0;

        return (
            <div className="relative">
                <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 transition hover:bg-white/70"
                >
                    {hasImage ? (
                    <img
                        src={imageUrl}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="h-8 w-8 rounded-full object-cover ring-2 ring-slate-200"
                    />
                    ) : (
                    <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700 ring-2 ring-slate-200"
                        aria-hidden
                    >
                        {avatarInitial(session.user?.name)}
                    </span>
                    )}
                    <span className="text-sm font-semibold text-slate-700 hidden sm:block">
                        {session.user?.name}
                    </span>
                </button>

                {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50">
                        <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="w-full cursor-pointer px-4 py-2 text-left text-sm text-red-500 transition hover:bg-red-50"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <Link
                href="/login"
                className="inline-flex min-h-10 cursor-pointer items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 transition duration-200 hover:bg-white/70 hover:text-slate-900"
            >
                Login
            </Link>
            <Link
                href="/signup"
                className="inline-flex min-h-10 cursor-pointer items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-blue-700"
            >
                Signup
            </Link>
        </div>
    );
}