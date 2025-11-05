import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "./mongodb";

export const authOptions: NextAuthOptions = {
	adapter: MongoDBAdapter(clientPromise),
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		}),
	],
	session: { strategy: "jwt" },
	pages: {},
	callbacks: {
		async session({ session, token }) {
			if (session.user && token.sub) {
				(session as unknown as { user: typeof session.user & { id: string } }).user = {
					...session.user,
					id: token.sub,
				};
			}
			return session;
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
};

export const { auth } = NextAuth(authOptions);
