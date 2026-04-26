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

    function handleToggleMenu() {
        setDropdownOpen(function toggle(previous) {
            return !previous;
        });
    }

    function handleCloseMenu() {
        setDropdownOpen(false);
    }

    function handleSignOut() {
        signOut({ callbackUrl: "/" });
    }

    if (status === "loading") return null;

    if (session) {
        const imageUrl = session.user?.image;
        const hasImage = typeof imageUrl === "string" && imageUrl.length > 0;

        const triggerClasses = [
            "flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2",
            "transition-[background-color,box-shadow,transform,color] duration-200 ease-out",
            "hover:bg-white/70 hover:shadow-sm hover:shadow-slate-900/10 hover:ring-1 hover:ring-slate-200/80",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50",
            "motion-reduce:transition-colors motion-reduce:hover:shadow-none motion-reduce:hover:ring-0",
            dropdownOpen
                ? "bg-white/90 shadow-sm shadow-slate-900/10 ring-1 ring-slate-200/90"
                : "",
        ].join(" ");

        return (
            <div className="relative">
                <button
                    type="button"
                    onClick={handleToggleMenu}
                    className={triggerClasses}
                    aria-expanded={dropdownOpen}
                    aria-haspopup="true"
                >
                    {hasImage ? (
                        <img
                            src={imageUrl}
                            alt=""
                            referrerPolicy="no-referrer"
                            className="h-8 w-8 rounded-full object-cover ring-2 ring-slate-200/90 shadow-sm shadow-slate-900/5"
                        />
                    ) : (
                        <span
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700 ring-2 ring-slate-200/90 shadow-sm shadow-slate-900/5"
                            aria-hidden
                        >
                            {avatarInitial(session.user?.name)}
                        </span>
                    )}
                    <span className="hidden text-sm font-semibold text-slate-700 sm:block">
                        {session.user?.name}
                    </span>
                    <svg
                        className={[
                            "h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ease-out motion-reduce:transition-none",
                            dropdownOpen ? "rotate-180" : "",
                        ].join(" ")}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden
                    >
                        <path
                            fillRule="evenodd"
                            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>

                {dropdownOpen && (
                    <div
                        className="absolute right-0 z-50 mt-2 min-w-[13.5rem] max-w-[min(18rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-slate-200/90 bg-white py-1.5 shadow-lg shadow-slate-900/[0.08] ring-1 ring-slate-900/[0.03]"
                        role="menu"
                    >
                        <div className="border-b border-slate-100 bg-linear-to-b from-slate-50/95 to-slate-50/40 px-4 py-3">
                            <p className="truncate text-sm font-semibold tracking-tight text-slate-800">
                                {session.user?.name}
                            </p>
                            <p className="mt-0.5 truncate text-xs leading-relaxed text-slate-500">
                                {session.user?.email}
                            </p>
                        </div>

                        <div className="px-1.5 pt-1.5 pb-0.5">
                            <Link
                                href="/change-password"
                                onClick={handleCloseMenu}
                                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition-colors duration-200 ease-out hover:bg-slate-100/90 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/35 focus-visible:ring-offset-0 motion-reduce:transition-none"
                                role="menuitem"
                            >
                                <span
                                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 ring-1 ring-slate-200/80"
                                    aria-hidden
                                >
                                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path
                                            fillRule="evenodd"
                                            d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </span>
                                Change Password
                            </Link>
                            <button
                                type="button"
                                onClick={handleSignOut}
                                className="mt-0.5 flex w-full cursor-pointer items-center rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 transition-colors duration-200 ease-out hover:bg-red-50/95 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/30 focus-visible:ring-offset-0 motion-reduce:transition-none"
                                role="menuitem"
                            >
                                Logout
                            </button>
                        </div>
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