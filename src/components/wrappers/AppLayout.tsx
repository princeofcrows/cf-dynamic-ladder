'use client'

import QueryProvider from '@/src/components/wrappers/QueryProvider'
import Sidebar from '@/src/components/layout/Sidebar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <div className="flex flex-col h-dvh w-full bg-custom-gray">
        {/* Top navigation for all screens */}
        <div className="sticky top-0 z-20">
          <Sidebar />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto min-w-0">{children}</div>
      </div>
    </QueryProvider>
  )
}
