import NextAuth, { NextAuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import jwt from "jsonwebtoken";

interface ExtendedUser extends NextAuthUser {
  id: string;
  username: string;
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || "",
  session: {
    strategy: "jwt",
  },
  cookies: {
    sessionToken: {
      name: "__session",
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
      },
    },
  },
  pages: {
    signOut: "/auth/signout",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const response = await fetch(`${process.env.API_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            username: credentials?.username || "",
            password: credentials?.password || "",
          }).toString(),
          credentials: "include",
        });

        if (response.status === 401) {
          throw new Error("Invalid credentials");
        }

        const access_token = response.headers
          .get("Set-Cookie")
          ?.split(";")[0]
          .split("=")[1];

        const decoded = jwt.verify(
          access_token || "",
          process.env.JWT_SECRET || ""
        ) as unknown as ExtendedUser;

        if (response.ok && access_token) {
          return {
            access_token,
            id: decoded.id,
            username: decoded.username,
            startingCredits: decoded.credits,
            role: decoded.role,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.access_token = user.access_token;
        token.id = user.id;
        token.username = user.username;
        token.startingCredits = user.startingCredits;
        token.role = user.role;
      }

      return token;
    },

    async session({ session, token }) {
      if (token.access_token) {
        session.user = {
          id: token.id as string,
          username: token.username as string,
          startingCredits: token.startingCredits as number,
          role: token.role as string,
        };
      }

      return session;
    },
  },
};

export default NextAuth(authOptions);
