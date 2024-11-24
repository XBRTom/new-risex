import NextAuth, { type DefaultSession } from "next-auth"
import "next-auth/jwt"
import { PrismaAdapter } from "@auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import Resend from "next-auth/providers/resend"
import prisma from '@/libs/prisma';


export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: !!process.env.AUTH_DEBUG,
  theme: { logo: "/logo_white.svg" },
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        } 
      },
      profile(profile) {
        return { role: "user" }
      }
    }),
    Resend({
        apiKey: process.env.AUTH_RESEND_KEY,
        from: process.env.AUTH_RESEND_FROM,
        name: 'E-mail',
    }),
  ],
  session: { strategy: "database" },
  callbacks: {
    jwt({ token, trigger, session, account }) {
      if (trigger === "update") token.name = session.user.name
      if (account?.provider === "keycloak") {
        return { ...token, accessToken: account.access_token }
      }
      return token
    },
    session({ session, token, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          phoneNumber: user.phoneNumber,
          role: user.role,
        },
      }
    }
  },
})


declare module "next-auth" {
  interface Session {
    accessToken?: string
    user: {
      phoneNumber: string
      role?: string
    } & DefaultSession["user"]
  }

  interface User {
    phoneNumber?: string
    role?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
  }
}