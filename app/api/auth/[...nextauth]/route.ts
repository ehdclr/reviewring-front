import NextAuth, { DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      accessToken: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    accessToken: string;
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      //   async authorize(credentials) {
      //     if (!credentials?.email || !credentials?.password) {
      //       return null
      //     }

      //     try {
      //       const res = await fetch(`${process.env.BACKEND_URL}/api/auth/login`, {
      //         method: 'POST',
      //         headers: {
      //           'Content-Type': 'application/json',
      //         },
      //         body: JSON.stringify({
      //           email: credentials.email,
      //           password: credentials.password,
      //         }),
      //       })

      //       const data = await res.json()

      //       if (res.ok && data.accessToken) {
      //         return { accessToken: data.accessToken, id: data.user.id }
      //       } else {
      //         throw new Error('로그인 실패!')
      //       }
      //     } catch (error) {
      //       console.error('로그인 실패!', error)
      //       throw new Error('로그인 실패!')
      //     }
      //   }

      //TODO 더미 데이터
      authorize(credentials) {
        if (
          credentials?.email === "test@test.com" &&
          credentials?.password === "test1234"
        ) {
          return {
            id: "1",
            name: "Test User",
            email: "test@test.com",
            accessToken: "dummy_access_token",
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
});

export { handler as GET, handler as POST };
