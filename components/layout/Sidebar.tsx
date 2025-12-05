'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { 
  Map,
  Plus,
  History,
  Users,
  Settings
} from 'lucide-react'

export default function Sidebar() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const menuItems = [
    {
      label: 'Map',
      sublabel: 'Trips',
      href: '/trips',
      icon: Map,
    },
    {
      label: 'Create',
      sublabel: 'New',
      href: '/trips/new',
      icon: Plus,
    },
    {
      label: 'History',
      sublabel: 'Past',
      href: '/history',
      icon: History,
    },
    {
      label: 'Friends',
      sublabel: 'Feed',
      href: '/friends',
      icon: Users,
    },
  ]

  const isActive = (href: string) => {
    return pathname === href 
  }

  // 認証済みユーザーのみサイドバーを表示
  if (status !== 'authenticated') {
    return null
  }

  return (
    <aside className="hidden lg:flex w-80 bg-white border-l border-gray-200 flex-col shadow-sm shrink-0 overflow-y-auto">
      {/* ヘッダー部分 */}
      <div className="px-8 py-6">
        <div className="flex items-center space-x-3">
          <div className="w-14 h-14 rounded-full bg-teal-700 flex items-center justify-center text-white shadow-md">
            <Map className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">TravelMap</h2>
          </div>
        </div>
      </div>

      {/* メニュー項目 */}
      <nav className="flex-1 px-6 pt-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center px-4 py-3.5 rounded-xl transition-all group
                ${active 
                  ? 'bg-teal-700 text-white shadow-lg' 
                  : 'text-gray-800 hover:bg-gray-50'
                }
              `}
            >
              <Icon className={`w-5 h-5 mr-3 ${active ? 'text-white' : 'text-gray-700'}`} />
              <div className="flex-1">
                <div className={`font-semibold text-[15px] ${active ? 'text-white' : 'text-gray-900'}`}>
                  {item.label}
                </div>
                <div className={`text-xs ${active ? 'text-teal-100' : 'text-gray-500'}`}>
                  {item.sublabel}
                </div>
              </div>
            </Link>
          )
        })}
      </nav>

      {/* 下部のセクション */}
      <div className="px-6 pb-6 pt-4 border-t border-gray-200 space-y-3">
        <Link
          href="/settings"
          className={`
            flex items-center px-4 py-3 rounded-xl transition-all
            ${isActive('/settings')
              ? 'bg-teal-700 text-white'
              : 'text-gray-800 hover:bg-gray-50'
            }
          `}
        >
          <Settings className={`w-5 h-5 mr-3 ${isActive('/settings') ? 'text-white' : 'text-gray-700'}`} />
          <span className="font-semibold text-[15px]">Settings</span>
        </Link>

        {/* ユーザー情報 */}
        <div className="flex items-center space-x-3 px-2 py-2">
          <div className="w-11 h-11 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-base shadow-sm">
            {session.user?.name?.substring(0, 2).toUpperCase() || 'JD'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-[15px] text-gray-900 truncate">
              {session.user?.name || 'John Doe'}
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
