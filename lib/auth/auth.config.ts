import {AuthOptions} from "next-auth"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter"
import  prisma  from "@/lib/prisma" // 共有インスタンスをインポート
import { JWT } from "next-auth/jwt"
import { User} from "next-auth"
import { Session } from "next-auth"
import bcrypt from 'bcrypt'

export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  // Note: CredentialsProvider を使う場合は adapter を使用しない（JWT strategy のみ）
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    CredentialsProvider({
    // The name to display on the sign in form (e.g. "Sign in with...")
    name: "Credentials",
    // `credentials` is used to generate a form on the sign in page.
    // You can specify which fields should be submitted, by adding keys to the `credentials` object.
    // e.g. domain, username, password, 2FA token, etc.
    // You can pass any HTML attribute to the <input> tag through the object.
    credentials: {
      email: { label: "Username", type: "email", placeholder: "jsmith" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials, ) {
      // Add logic here to look up the user from the credentials supplied
     if (!credentials?.email || !credentials?.password) {
          return null
        }

        // 1. データベースからユーザーを検索
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.password) {
          return null
        }

        // 2. パスワードを比較
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        // 3. 認証成功、ユーザーオブジェクトを返す
        return user
      }
  })
    // ...add more providers here
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
  // 引数に型を明記
  async jwt({ token, user }: { token: JWT; user?: User }) {
    if (user) {
      token.id = user.id
    }
    return token
  },
  // 引数に型を明記
  async session({ session, token }: { session: Session; token: JWT }) {
    if (session.user) {
      session.user.id = token.id
    }
    return session
  },

  },
  secret: process.env.NEXTAUTH_SECRET,
}