# Next.js + Supabase + NextAuth.js + Prisma ディレクトリ構成（srcなし）

## 1. ディレクトリ構成

```
travel-planner/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   │
│   ├── (protected)/
│   │   ├── layout.tsx
│   │   ├── trips/
│   │   │   ├── page.tsx
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx
│   │   │       └── edit/
│   │   │           └── page.tsx
│   │   ├── history/
│   │   │   └── page.tsx
│   │   └── friends/
│   │       └── page.tsx
│   │
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   ├── trips/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       ├── route.ts
│   │   │       ├── members/
│   │   │       │   └── route.ts
│   │   │       └── schedules/
│   │   │           └── route.ts
│   │   ├── schedules/
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   ├── messages/
│   │   │   └── route.ts
│   │   ├── friends/
│   │   │   ├── route.ts
│   │   │   └── requests/
│   │   │       └── route.ts
│   │   └── upload/
│   │       └── route.ts
│   │
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── AuthProvider.tsx
│   ├── trips/
│   │   ├── TripCard.tsx
│   │   ├── TripForm.tsx
│   │   └── TripList.tsx
│   ├── schedules/
│   │   ├── ScheduleForm.tsx
│   │   └── ScheduleList.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Navigation.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       └── Loading.tsx
│
├── lib/
│   ├── auth.ts
│   ├── prisma.ts
│   ├── supabase.ts
│   └── api-helpers.ts
│
├── hooks/
│   ├── useAuth.ts
│   ├── useTrips.ts
│   └── useFetch.ts
│
├── types/
│   ├── api.ts
│   └── next-auth.d.ts
│
├── utils/
│   ├── fetcher.ts
│   └── validators.ts
│
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
│
├── public/
│   └── ...
│
├── .env.local
├── .gitignore
├── middleware.ts
├── next.config.js
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## 2. 基本設定ファイル

### lib/prisma.ts
```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### lib/auth.ts
```typescript
import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      if (session.user) {
        session.user.id = user.id
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
  },
}
```

### lib/api-helpers.ts
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ZodError } from 'zod'

export async function getAuthenticatedUser() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return null
  }
  return session.user
}

export function handleApiError(error: unknown) {
  console.error('API Error:', error)

  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: 'Validation error', details: error.errors },
      { status: 400 }
    )
  }

  if (error instanceof Error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  )
}

export function successResponse(data: any, status = 200) {
  return NextResponse.json(data, { status })
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}
```

## 3. App ディレクトリの実装

### app/layout.tsx
```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/auth/AuthProvider'
import Header from '@/components/layout/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '旅プランナー',
  description: '友達と一緒に旅行を計画しよう',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
```

### app/page.tsx
```typescript
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="max-w-4xl mx-auto">
      <section className="text-center py-20">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          旅プランナーへようこそ
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          友達と一緒に最高の旅行を計画しよう
        </p>
        
        {session ? (
          <Link
            href="/trips"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors inline-block"
          >
            旅行を見る
          </Link>
        ) : (
          <Link
            href="/login"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors inline-block"
          >
            ログインして始める
          </Link>
        )}
      </section>

      <section className="grid md:grid-cols-3 gap-8 py-16">
        <div className="text-center">
          <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📅</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">簡単な計画作成</h3>
          <p className="text-gray-600">
            直感的なインターフェースで旅行の計画を簡単に作成
          </p>
        </div>
        
        <div className="text-center">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">👥</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">友達と共有</h3>
          <p className="text-gray-600">
            友達を招待して一緒に旅行を計画できます
          </p>
        </div>
        
        <div className="text-center">
          <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🗺️</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">地図で確認</h3>
          <p className="text-gray-600">
            Google Mapsで訪問地を確認しながら計画
          </p>
        </div>
      </section>
    </div>
  )
}
```

### app/(protected)/layout.tsx
```typescript
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  return <>{children}</>
}
```

### app/(protected)/trips/page.tsx
```typescript
import TripList from '@/components/trips/TripList'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default function TripsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">旅行一覧</h1>
        <Link
          href="/trips/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          新しい旅行を作成
        </Link>
      </div>
      
      <TripList />
    </div>
  )
}
```

### app/(protected)/trips/[id]/page.tsx
```typescript
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

interface TripDetailPageProps {
  params: {
    id: string
  }
}

export default async function TripDetailPage({ params }: TripDetailPageProps) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    notFound()
  }

  const trip = await prisma.trip.findFirst({
    where: {
      id: params.id,
      members: {
        some: {
          userId: session.user.id,
          status: 'ACCEPTED',
        },
      },
    },
    include: {
      members: {
        include: {
          user: true,
        },
      },
      schedules: {
        include: {
          location: true,
        },
        orderBy: [
          { scheduledDate: 'asc' },
          { orderIndex: 'asc' },
        ],
      },
    },
  })

  if (!trip) {
    notFound()
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{trip.title}</h1>
        <p className="text-gray-600">{trip.description}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* スケジュール一覧 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">スケジュール</h2>
            {/* ScheduleList コンポーネント */}
          </div>
        </div>

        <div>
          {/* メンバー一覧 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">メンバー</h2>
            <div className="space-y-3">
              {trip.members.map((member) => (
                <div key={member.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full" />
                  <div>
                    <p className="font-medium">{member.user.name}</p>
                    <p className="text-sm text-gray-500">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

## 4. API Routes

### app/api/auth/[...nextauth]/route.ts
```typescript
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
```

### app/api/trips/route.ts
```typescript
import { NextRequest } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { 
  getAuthenticatedUser, 
  handleApiError, 
  successResponse, 
  errorResponse 
} from '@/lib/api-helpers'

// 旅行一覧取得
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) {
      return errorResponse('Unauthorized', 401)
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '20')
    const cursor = searchParams.get('cursor')

    const trips = await prisma.trip.findMany({
      where: {
        members: {
          some: {
            userId: user.id,
            status: 'ACCEPTED',
          },
        },
        ...(status && { status }),
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        _count: {
          select: {
            schedules: true,
            photos: true,
          },
        },
      },
      orderBy: {
        startDate: 'desc',
      },
      take: limit + 1,
      ...(cursor && {
        cursor: {
          id: cursor,
        },
      }),
    })

    let nextCursor: string | undefined = undefined
    if (trips.length > limit) {
      const nextItem = trips.pop()
      nextCursor = nextItem!.id
    }

    return successResponse({
      trips,
      nextCursor,
    })
  } catch (error) {
    return handleApiError(error)
  }
}

// 旅行作成
const createTripSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  startDate: z.string().transform(str => new Date(str)),
  endDate: z.string().transform(str => new Date(str)),
  memberIds: z.array(z.string()).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) {
      return errorResponse('Unauthorized', 401)
    }

    const body = await request.json()
    const validatedData = createTripSchema.parse(body)

    // 日付の検証
    if (validatedData.endDate < validatedData.startDate) {
      return errorResponse('終了日は開始日より後である必要があります')
    }

    const trip = await prisma.trip.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        startDate: validatedData.startDate,
        endDate: validatedData.endDate,
        createdBy: user.id,
        members: {
          create: [
            {
              userId: user.id,
              role: 'OWNER',
              status: 'ACCEPTED',
            },
            ...(validatedData.memberIds?.map(memberId => ({
              userId: memberId,
              role: 'MEMBER' as const,
              status: 'PENDING' as const,
            })) ?? []),
          ],
        },
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    })

    return successResponse(trip, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
```

## 5. コンポーネント

### components/auth/AuthProvider.tsx
```typescript
'use client'

import { SessionProvider } from 'next-auth/react'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}
```

### components/trips/TripList.tsx
```typescript
'use client'

import { useTrips } from '@/hooks/useTrips'
import TripCard from './TripCard'

export default function TripList() {
  const { trips, isLoading, isError } = useTrips()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-lg h-64 animate-pulse" />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">エラーが発生しました</p>
      </div>
    )
  }

  if (trips.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">旅行がまだありません</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {trips.map((trip) => (
        <TripCard key={trip.id} trip={trip} />
      ))}
    </div>
  )
}
```

### components/trips/TripCard.tsx
```typescript
import Link from 'next/link'
import { Calendar, Users } from 'lucide-react'

interface TripCardProps {
  trip: {
    id: string
    title: string
    description?: string
    startDate: string
    endDate: string
    status: string
    members: Array<{
      user: {
        id: string
        name: string
        image?: string
      }
    }>
    _count: {
      schedules: number
      photos: number
    }
  }
}

export default function TripCard({ trip }: TripCardProps) {
  const formatDate = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    return `${startDate.toLocaleDateString('ja-JP')} - ${endDate.toLocaleDateString('ja-JP')}`
  }

  return (
    <Link href={`/trips/${trip.id}`}>
      <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 cursor-pointer">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {trip.title}
        </h3>
        
        {trip.description && (
          <p className="text-gray-600 mb-4 line-clamp-2">
            {trip.description}
          </p>
        )}
        
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(trip.startDate, trip.endDate)}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{trip.members.length}人</span>
          </div>
        </div>
        
        <div className="mt-4 flex items-center gap-2">
          {trip.members.slice(0, 3).map((member) => (
            <div
              key={member.user.id}
              className="w-8 h-8 bg-gray-300 rounded-full"
              title={member.user.name}
            />
          ))}
          {trip.members.length > 3 && (
            <span className="text-sm text-gray-500">
              +{trip.members.length - 3}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
```

## 6. カスタムフック

### hooks/useTrips.ts
```typescript
import useSWR from 'swr'
import { fetcher } from '@/utils/fetcher'

export function useTrips(status?: string) {
  const params = new URLSearchParams()
  if (status) params.append('status', status)
  
  const { data, error, mutate } = useSWR(
    `/api/trips?${params.toString()}`,
    fetcher
  )

  return {
    trips: data?.trips || [],
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}
```

### utils/fetcher.ts
```typescript
export async function fetcher(url: string) {
  const response = await fetch(url)
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'エラーが発生しました')
  }
  
  return response.json()
}
```

## 環境変数（.env.local）

```bash
# Database
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```