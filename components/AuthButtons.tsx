"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function AuthButtons() {
    const { data: session, status } = useSession();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    if (status === "loading") return null;

    if (session) {
        return (
            <div className="relative">
                <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-white/70 transition"
                >
                    <img
                        src={session.user?.image || ""}
                        alt="profile"
                        className="w-8 h-8 rounded-full ring-2 ring-slate-200"
                    />
                    <span className="text-sm font-semibold text-slate-700 hidden sm:block">
                        {session.user?.name}
                    </span>
                    <span className="text-slate-400 text-xs">▼</span>
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