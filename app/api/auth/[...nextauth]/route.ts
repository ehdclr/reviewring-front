import NextAuth, { DefaultSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { client } from "@/lib/apollo-client";
import { gql } from "@apollo/client";

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(loginInput: { email: $email, password: $password }) {
      user {
        id
        email
        name
        nickname
        phone
      }
      success
      message
      accessToken
    }
  }
`;

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      nickname: string;
      phone: string;
      accessToken: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    name: string;
    nickname: string;
    phone: string;
    accessToken: string;
  }
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
        if (!credentials?.email || !credentials?.password) {
          throw new Error("이메일과 비밀번호를 입력해주세요.");
        }

        try {
          const response = await client.mutate({
            mutation: LOGIN_MUTATION,
            variables: {
              email: credentials.email,
              password: credentials.password,
            },
          });
          if (response.data?.login.success) {
            const { id, email, name, nickname, phone, accessToken } = response.data.login.user;
            return { id, email, name, nickname, phone, accessToken };
          } else {
            throw new Error(response.data?.login.message || "로그인에 실패했습니다.");
          }
        } catch (error) {
          console.error('로그인 실패!', error);
          throw new Error(error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.nickname = user.nickname;
        token.phone = user.phone;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id as string,
        email: token.email as string,
        name: token.name as string,
        nickname: token.nickname as string,
        phone: token.phone as string,
        accessToken: token.accessToken as string,
      };
      return session;
    },
  },
  pages: {
    signIn: "/signin",
    signOut: "/signout",
  },
  session: {
    strategy: "jwt",
  },
};

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET is not set");
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };