import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { JWT } from "next-auth/jwt";
import type { Session, User } from "next-auth";

interface MyUser {
  id: string;
  email: string;
  role: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (
          credentials?.email === process.env.NEXT_PUBLIC_STATIC_EMAIL &&
          credentials?.password === process.env.NEXT_PUBLIC_STATIC_PASSWORD
        ) {
          return {
            id: "1",
            email: credentials?.email,
            role: "admin",
            name:"sundar"
          } as MyUser;
        }
        return null;
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/auth",
  },

  callbacks: {
    async jwt({ token, user, ...rest }: any): Promise<JWT> {
      if (user) {
        token.user = user;
      }
      return token;
    },

    async session({ session, token, ...rest }: any): Promise<Session> {
      if (token.user) {
        session.user = token.user as MyUser;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
