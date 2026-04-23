import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";

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

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const { data: user } = await supabaseAdmin
          .from("users")
          .select("*")
          .eq("email", credentials.email)
          .single();

        if (!user) return null;

        if (!user.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],

  pages: {
    signIn: "/login",
    error: "/login",
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        if (!user?.email) return false;

        const cookieStore = await cookies();
        const oauthIntent = cookieStore.get("oauth_intent")?.value;

        const { data: existingUser } = await supabaseAdmin
          .from("users")
          .select("*")
          .ilike("email", user.email)
          .single();

        if (existingUser && oauthIntent === "signup") {
          return "/signup?error=EmailExists";
        }

        if (!existingUser) {
          await supabaseAdmin.from("users").insert({
            name: user.name,
            email: user.email,
            image: user.image,
            provider: "google",
            created_at: new Date().toISOString(),
          });
        }

        return true;
      }

      return true;
    },

    async jwt({ token, user, account, profile }): Promise<JWT> {
      if (account && user) {
        return {
          ...token,
          name: user.name,
          email: user.email,
          picture: user.image,
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