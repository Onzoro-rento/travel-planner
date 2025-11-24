import { NextResponse } from 'next/server'
import  prisma  from '@/lib/prisma'
import bcrypt from 'bcrypt'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    // 1. バリデーション
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'すべての項目を入力してください' }, { status: 400 })
    }

    // 2. 既存ユーザーのチェック
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    })

    if (existingUser) {
      return NextResponse.json({ error: 'このメールアドレスは既に使用されています' }, { status: 409 })
    }

    // 3. パスワードのハッシュ化（重要）
    const hashedPassword = await bcrypt.hash(password, 10)

    // 4. データベースにユーザーを作成
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    // パスワード情報を除外して返す
    const userWithoutPassword = {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }

    return NextResponse.json(userWithoutPassword, { status: 201 })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: '予期せぬエラーが発生しました' }, { status: 500 })
  }
}