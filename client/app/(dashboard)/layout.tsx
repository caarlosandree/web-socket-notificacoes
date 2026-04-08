'use client'

import { useRouter } from 'next/navigation'
import { auth } from '@/lib/auth'
import { socketClient } from '@/lib/socket'
import { NotificationDropdown } from '@/components/ui/notification-dropdown'
import { LogOut } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  const handleLogout = () => {
    auth.clear()
    socketClient.disconnect()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <div className="flex items-center gap-4">
            <NotificationDropdown />
            <button
              onClick={handleLogout}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Sair"
              aria-label="Sair"
            >
              <LogOut className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
