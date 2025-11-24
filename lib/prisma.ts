import { PrismaClient } from '../app/generated/prisma'

const globalForPrisma = global as unknown as { 
    prisma: PrismaClient | undefined
}

// Prisma クライアントのシングルトンインスタンス
// 開発環境でホットリロード時に複数のインスタンスが作成されるのを防ぐ
const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma