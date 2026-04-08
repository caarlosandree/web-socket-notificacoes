'use client'

import { Check, Info, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

type NotificationType = 'info' | 'success' | 'warning' | 'error'

interface NotificationItemProps {
  id: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  createdAt: string
  onMarkAsRead?: (id: string) => void
}

const icons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
}

const colors = {
  info: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20',
  success: 'text-green-500 bg-green-50 dark:bg-green-900/20',
  warning: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
  error: 'text-red-500 bg-red-50 dark:bg-red-900/20',
}

export function NotificationItem({ id, type, title, message, read, createdAt, onMarkAsRead }: NotificationItemProps) {
  const Icon = icons[type] || Info

  return (
    <div
      className={cn(
        'p-4 rounded-lg border transition-all hover:bg-gray-50 dark:hover:bg-gray-800/50',
        read ? 'bg-gray-50 dark:bg-gray-800/30 border-gray-200 dark:border-gray-700' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn('p-2 rounded-full', colors[type] || colors.info)}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className={cn('font-semibold', read ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-white')}>
              {title}
            </h4>
            {!read && onMarkAsRead && (
              <button
                onClick={() => onMarkAsRead(id)}
                className="text-gray-400 hover:text-green-500 transition-colors"
                title="Marcar como lida"
              >
                <Check className="w-4 h-4" />
              </button>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{message}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true, locale: ptBR })}
          </p>
        </div>
      </div>
    </div>
  )
}
