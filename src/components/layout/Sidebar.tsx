'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HiHome, HiUserGroup } from 'react-icons/hi'
import classNames from 'classnames'

const navigation = [
  { name: 'Home', href: '/', icon: HiHome },
  { name: 'Coach', href: '/coach', icon: HiUserGroup },
]

// Kept filename/export for minimal churn, but this is now a top navigation bar.
export default function Sidebar() {
  const pathname = usePathname()

  return (
    <header className="bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="h-14 px-3 sm:px-4 flex items-center gap-3">
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-sm sm:text-base font-extrabold bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">
            CF Analytics
          </span>
        </div>

        <nav className="flex-1 min-w-0 overflow-x-auto">
          <div className="flex items-center gap-2 sm:gap-3">
            {navigation.map(item => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={classNames(
                    'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs sm:text-sm font-bold transition-colors whitespace-nowrap',
                    isActive ? 'bg-blue-50 text-blue-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <item.icon className={classNames('h-4 w-4', isActive ? 'text-blue-700' : 'text-gray-400')} />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
    </header>
  )
}
