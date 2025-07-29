import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth.config'

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