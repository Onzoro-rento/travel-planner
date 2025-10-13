import { DefaultSession, DefaultUser } from 'next-auth'
import { JWT, DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  /**
   * セッションで返されるユーザー情報の型定義
   */
  interface Session {
    user: {
      id: string
      emailVerified: Date | null
    } & DefaultSession['user']
    accessToken?: string // Google OAuth用のアクセストークン
  }

  /**
   * ユーザーオブジェクトの型定義
   */
  interface User extends DefaultUser {
    id: string
    emailVerified: Date | null
    password?: string | null // Credentials認証用
  }

  /**
   * プロファイル情報の型定義（OAuth用）
   */
  interface Profile {
    id?: string
    name?: string
    email?: string
    image?: string
    picture?: string // Google用
    email_verified?: boolean
  }
}

declare module 'next-auth/jwt' {
  /**
   * JWTトークンの型定義
   */
  interface JWT extends DefaultJWT {
    id: string
    emailVerified: Date | null
    accessToken?: string
  }
}

// Prismaアダプター用の型定義
declare module '@auth/prisma-adapter' {
  interface PrismaUser {
    id: string
    email: string
    name?: string | null
    image?: string | null
    password?: string | null
    emailVerified?: Date | null
  }
}