import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import { cookies } from "next/headers";
import GoogleProvider from "next-auth/providers/google";
import {
  isRegisteredEmail,
  normalizeEmail,
  registerEmail,
} from "@/lib/registered-users";

function oauthProfilePicture(profile: unknown): string | undefined {
  if (typeof profile !== "object" || profile === null) {
    return undefined;
  }
  const picture = (profile as { picture?: unknown }).picture;
  return typeof picture === "string" && picture.length > 0 ? picture : undefined;
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "select_account",
          scope: "openid email profile",
        },
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ user }) {
      if (!user?.email) {
        return false;
      }

      const googleEmail = normalizeEmail(user.email);
      const cookieStore = await cookies();
      const intent = cookieStore.get("oauth_intent")?.value;

      if (intent === "login") {
        const expected = cookieStore.get("oauth_login_email")?.value;
        if (!expected || normalizeEmail(expected) !== googleEmail) {
          return false;
        }
        if (!isRegisteredEmail(googleEmail)) {
          return false;
        }
        registerEmail(user.email);
        return true;
      }

      if (intent === "signup") {
        registerEmail(user.email);
        return true;
      }

      return false;
    },
    async jwt({ token, user, account, profile }): Promise<JWT> {
      if (account && user) {
        const picture =
          (typeof user.image === "string" && user.image.length > 0
            ? user.image
            : undefined) ??
          oauthProfilePicture(profile) ??
          (typeof token.picture === "string" ? token.picture : undefined);

        return {
          ...token,
          name: user.name,
          email: user.email,
          picture,
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.name = token.name as string | null | undefined;
        session.user.email = token.email as string | null | undefined;
        session.user.image = token.picture as string | null | undefined;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
};
