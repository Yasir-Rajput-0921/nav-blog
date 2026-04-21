"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

export function AuthButton() {
    const { data: session } = useSession();
    if (session) {
        return (
            <div className="flex items-center gap-3">
                {session.user?.image && (
                    <Image
                    src={session.user.image} 
                    alt={session.user.name || "Profile picture"} 
                    width={32} 
                    height={32} 
                    className="rounded-full" />
                )}
                <span className="text-sm font-semibold text-slate-700">
                    {session.user?.name}
                </span>
                <button onClick={() => signOut()} className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 cursor-pointer">
                    Log Out
                </button>
            </div>
        );
    }
    return (
        <div className="flex items-center gap-2">
      <button
        onClick={() => signIn("google")}
        className="rounded-xl border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50"
      >
        Login
      </button>
      <button
        onClick={() => signIn("google")}
        className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
      >
        Sign Up
      </button>
    </div>
    );
}