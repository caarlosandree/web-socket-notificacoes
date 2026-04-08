'use client'

import { Bell } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NotificationBadgeProps {
  count: number
  onClick?: () => void
  className?: string
}

export function NotificationBadge({ count, onClick, className }: NotificationBadgeProps) {
  return (
    <button
      onClick={onClick}
      className={cn('relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors', className)}
      aria-label="Notificações"
    >
      <Bell className="w-6 h-6 text-gray-700 dark:text-gray-300" />
      {count > 0 && (
        <span className="absolute top-1 right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  )
}
