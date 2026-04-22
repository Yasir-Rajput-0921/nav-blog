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
                    className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-white/70 transition"
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
                            className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition"
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
                className="inline-flex items-center justify-center min-h-10 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-white/70 hover:text-slate-900 rounded-xl transition duration-200"
            >
                Login
            </Link>
            <Link
                href="/signup"
                className="inline-flex items-center justify-center min-h-10 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition duration-200"
            >
                Signup
            </Link>
        </div>
    );
}