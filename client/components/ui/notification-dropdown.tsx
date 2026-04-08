'use client'

import { useState } from 'react'
import { Bell, X, RefreshCw, Check } from 'lucide-react'
import { NotificationItem } from '@/components/ui/notification-item'
import { useNotifications } from '@/lib/hooks/useNotifications'

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    handleMarkAsRead,
    handleMarkAllAsRead,
  } = useNotifications()

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Abrir notificações"
      >
        <Bell className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-96 max-h-[500px] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Notificações
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      fetchNotifications()
                    }}
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="Atualizar"
                  >
                    <RefreshCw className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Fechar"
                  >
                    <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {unreadCount > 0
                    ? `${unreadCount} não lida${unreadCount > 1 ? 's' : ''}`
                    : 'Todas lidas'}
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <Check className="w-3 h-3" />
                    Marcar todas
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-y-auto max-h-[400px]">
              {loading ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  Carregando...
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhuma notificação</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => {
                        if (!notification.read) {
                          handleMarkAsRead(notification.id)
                        }
                      }}
                    >
                      <NotificationItem
                        {...notification}
                        onMarkAsRead={
                          !notification.read ? handleMarkAsRead : undefined
                        }
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    setIsOpen(false)
                    window.location.href = '/notifications'
                  }}
                  className="w-full text-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                >
                  Ver todas
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
