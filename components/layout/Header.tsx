'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { 
  Search,
  MapPin,
  List,
  Menu,
  X
} from 'lucide-react'


export default function Header() {
  const { status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // URLパラメータからviewModeを取得
  const viewMode = (searchParams.get('view') === 'list' ? 'list' : 'map') as 'map' | 'list'

  // viewMode変更時にURLパラメータを更新
  const handleViewChange = (newView: 'map' | 'list') => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('view', newView)
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  const isAuthenticated = status === 'authenticated'
  const isLoading = status === 'loading'

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* 左側：検索バー（デスクトップ・認証済みのみ） */}
            {isAuthenticated && (
              <div className="hidden lg:flex items-center flex-1 max-w-xl">
                <div className="relative w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search trips..."
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>
            )}

            {/* 未認証時：ロゴエリア */}
            {!isAuthenticated && (
              <div className="flex items-center">
                <Link href="/" className="flex items-center gap-2">
                  <MapPin className="w-8 h-8 text-teal-600" />
                  <span className="text-xl font-bold text-gray-900">TravelMap</span>
                </Link>
              </div>
            )}

            {/* モバイル：ハンバーガーメニュー */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* 中央：ビュー切り替えボタン（認証済みのみ） */}
            {isAuthenticated && (
              <div className="flex items-center gap-2 lg:ml-6">
              <button
                onClick={() => handleViewChange('map')}
                className={`
                  flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-2.5 rounded-lg font-medium transition-all
                  ${viewMode === 'map'
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                <MapPin className="w-4 h-4 lg:w-5 lg:h-5" />
                <span className="hidden sm:inline">Map</span>
              </button>
              <button
                onClick={() => handleViewChange('list')}
                className={`
                  flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-2.5 rounded-lg font-medium transition-all
                  ${viewMode === 'list'
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                <List className="w-4 h-4 lg:w-5 lg:h-5" />
                <span className="hidden sm:inline">List</span>
              </button>
              </div>
            )}

            {/* 右側：認証ボタン */}
            <div className="hidden lg:flex items-center gap-3 ml-6">
              {isLoading ? (
                <div className="px-5 py-2.5 text-sm text-gray-400">Loading...</div>
              ) : isAuthenticated ? (
                <>
                  <button
                    onClick={handleSignOut}
                    className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    className="px-5 py-2.5 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors shadow-md"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* モバイルメニュー */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="absolute right-0 top-0 h-full w-64 bg-white shadow-xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col space-y-4">
              {/* モバイル検索（認証済みのみ） */}
              {isAuthenticated && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search trips..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                  />
                </div>
              )}

              {/* モバイル認証ボタン */}
              {isLoading ? (
                <div className="text-center py-4 text-gray-400">Loading...</div>
              ) : isAuthenticated ? (
                <>
                  <button
                    onClick={handleSignOut}
                    className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="w-full px-4 py-2.5 text-center text-gray-700 font-medium bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    className="w-full px-4 py-2.5 text-center bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
