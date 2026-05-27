'use client'

import QueryProvider from '@/src/components/wrappers/QueryProvider'
import Sidebar from '@/src/components/layout/Sidebar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <div className="flex h-screen w-full bg-custom-gray">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </QueryProvider>
  )
}
