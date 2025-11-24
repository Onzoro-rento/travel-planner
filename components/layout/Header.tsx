'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { 
  Menu, 
  X, 
  MapPin, 
  Calendar, 
  Users, 
  History, 
  Settings,
  LogOut,
  User,
  ChevronDown,
  Bell
} from 'lucide-react'

export default function Header() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const navigation = [
    { name: '旅行一覧', href: '/trips', icon: Calendar },
    { name: '履歴', href: '/history', icon: History },
    { name: 'フレンド', href: '/friends', icon: Users },
  ]

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* ロゴ */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <MapPin className="h-8 w-8" />
              <span className="text-xl font-bold">旅プランナー</span>
            </Link>
          </div>

          {/* デスクトップナビゲーション */}
          <div className="hidden md:flex items-center space-x-8">
            {status === 'authenticated' && (
              <>
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? 'bg-white/20 text-white'
                          : 'text-white/90 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
              </>
            )}
          </div>

          {/* ユーザーメニュー（デスクトップ） */}
          <div className="hidden md:flex items-center space-x-4">
            {status === 'authenticated' ? (
              <>
                {/* 通知ボタン */}
                <button className="relative p-2 rounded-full hover:bg-white/10 transition-colors">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>

                {/* ユーザードロップダウン */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-white/10 transition-colors"
                  >
                    <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
                      {session.user?.image ? (
                        <Image
                          src={session.user.image}
                          alt={session.user.name || ''}
                          width={32}
                          height={32}
                          className="h-8 w-8 rounded-full"
                        />
                      ) : (
                        <User className="h-5 w-5" />
                      )}
                    </div>
                    <span className="text-sm font-medium">
                      {session.user?.name || 'ユーザー'}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {/* ドロップダウンメニュー */}
                  {isUserMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                        <Link
                          href="/settings"
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings className="h-4 w-4" />
                          <span>設定</span>
                        </Link>
                        <hr className="my-1" />
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false)
                            handleSignOut()
                          }}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>ログアウト</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : status === 'unauthenticated' ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-sm font-medium hover:text-white/80 transition-colors"
                >
                  ログイン
                </Link>
                <Link
                  href="/sign-up"
                  className="text-sm font-medium hover:text-white/80 transition-colors"
>
                  新規登録
                </Link>
              </div>
            ) : null}
          </div>

          {/* モバイルメニューボタン */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md hover:bg-white/10 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* モバイルメニュー */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {status === 'authenticated' ? (
                <>
                  {/* ユーザー情報 */}
                  <div className="flex items-center space-x-3 px-3 py-2 mb-2">
                    <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center">
                      {session.user?.image ? (
                        <Image
                          src={session.user.image}
                          alt={session.user.name || ''}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full"
                        />
                      ) : (
                        <User className="h-6 w-6" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {session.user?.name || 'ユーザー'}
                      </p>
                      <p className="text-xs text-white/70">
                        {session.user?.email}
                      </p>
                    </div>
                  </div>

                  <hr className="border-white/20 my-2" />

                  {/* ナビゲーション */}
                  {navigation.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                          isActive(item.href)
                            ? 'bg-white/20 text-white'
                            : 'text-white/90 hover:bg-white/10 hover:text-white'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    )
                  })}

                  <hr className="border-white/20 my-2" />

                  {/* 設定・ログアウト */}
                  <Link
                    href="/settings"
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-white/90 hover:bg-white/10 hover:text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Settings className="h-5 w-5" />
                    <span>設定</span>
                  </Link>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      handleSignOut()
                    }}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-white/90 hover:bg-white/10 hover:text-white w-full text-left"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>ログアウト</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block px-3 py-2 rounded-md text-base font-medium text-white/90 hover:bg-white/10 hover:text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    ログイン
                  </Link>
                  <Link
                    href="/register"
                    className="block px-3 py-2 rounded-md text-base font-medium bg-white text-blue-600 hover:bg-white/90"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    新規登録
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}