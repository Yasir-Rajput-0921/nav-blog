import { client } from "@/sanity/lib/client";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { writeClient } from "@/sanity/lib/write-client";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    prompt: "select_account",
                }
            }
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({ user }) {
            const email = user.email;
            const existing = await client.fetch(
                `*[_type == "user" && email == $email][0]`,
                { email }
            );
            if (!existing) {
                await writeClient.create({
                    _type: "user",
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    provider: "google",
                    createdAt: new Date().toISOString(),
                });
            }
            return true;
        },
        async session({ session, token }) {
            (session.user as any).id = token.sub!;
            return session;
        },
    },
});

export { handler as GET, handler as POST };