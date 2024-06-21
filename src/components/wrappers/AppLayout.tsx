'use client'

import QueryProvider from '@/src/components/wrappers/QueryProvider'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <div className="min-h-screen w-full bg-custom-gray">{children}</div>
    </QueryProvider>
  )
}
