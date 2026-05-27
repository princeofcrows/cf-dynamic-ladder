'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HiHome, HiUserGroup, HiChevronLeft, HiChevronRight } from 'react-icons/hi'
import classNames from 'classnames'

const navigation = [
  { name: 'Home', href: '/', icon: HiHome },
  { name: 'Coach', href: '/coach', icon: HiUserGroup },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Load collapse state from localStorage on mount
  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('sidebar-collapsed')
    if (stored) {
      setIsCollapsed(stored === 'true')
    }
  }, [])

  const handleToggle = () => {
    const nextState = !isCollapsed
    setIsCollapsed(nextState)
    localStorage.setItem('sidebar-collapsed', String(nextState))
  }

  return (
    <div
      className={classNames(
        'flex h-full flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex-shrink-0',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      <div
        className={classNames(
          'flex h-16 items-center border-b border-gray-200 px-4',
          isCollapsed ? 'justify-center' : 'justify-between'
        )}
      >
        {!isCollapsed && (
          <h1 className="text-lg font-extrabold bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent transition-all duration-200">
            CF Analytics
          </h1>
        )}
        <button
          onClick={handleToggle}
          className="rounded-lg p-1.5 hover:bg-gray-100 text-gray-500 hover:text-gray-900 focus:outline-none"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <HiChevronRight className="h-5 w-5" /> : <HiChevronLeft className="h-5 w-5" />}
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={classNames(
                isActive
                  ? 'bg-blue-50 text-blue-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                'group flex items-center rounded-lg px-2.5 py-2 text-sm font-semibold transition-all duration-200',
                isCollapsed ? 'justify-center' : ''
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon
                className={classNames(
                  isActive ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500',
                  'h-6 w-6 flex-shrink-0 transition-colors duration-200',
                  isCollapsed ? '' : 'mr-3'
                )}
                aria-hidden="true"
              />
              {!isCollapsed && <span className="transition-all duration-200">{item.name}</span>}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
