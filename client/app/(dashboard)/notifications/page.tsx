'use client'

import { useState } from 'react'
import { RefreshCw, Bell, CheckCircle, Clock, TrendingUp } from 'lucide-react'
import { NotificationItem } from '@/components/ui/notification-item'
import { useNotifications } from '@/lib/hooks/useNotifications'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { format, subDays, isToday } from 'date-fns'
import { ptBR } from 'date-fns/locale'

type TabType = 'all' | 'unread' | 'read'

const COLORS = {
  info: '#3b82f6',
  success: '#22c55e',
  warning: '#eab308',
  error: '#ef4444',
}

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('all')
  const {
    notifications,
    unreadCount,
    loading,
    handleMarkAsRead,
    handleMarkAllAsRead,
  } = useNotifications()

  // Filtrar notificações por aba
  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'unread') return !n.read
    if (activeTab === 'read') return n.read
    return true
  })

  // Calcular KPIs
  const totalCount = notifications.length
  const readCount = notifications.filter((n) => n.read).length
  const readTodayCount = notifications.filter(
    (n) => n.read && isToday(new Date(n.createdAt))
  ).length
  const readRate = totalCount > 0 ? (readCount / totalCount) * 100 : 0

  // Dados para gráfico por tipo
  const notificationsByType = [
    {
      name: 'Info',
      value: notifications.filter((n) => n.type === 'info').length,
      color: COLORS.info,
    },
    {
      name: 'Success',
      value: notifications.filter((n) => n.type === 'success').length,
      color: COLORS.success,
    },
    {
      name: 'Warning',
      value: notifications.filter((n) => n.type === 'warning').length,
      color: COLORS.warning,
    },
    {
      name: 'Error',
      value: notifications.filter((n) => n.type === 'error').length,
      color: COLORS.error,
    },
  ].filter((item) => item.value > 0)

  // Dados para gráfico temporal (últimos 7 dias)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i)
    return {
      date: format(date, 'dd/MM', { locale: ptBR }),
      total: notifications.filter((n) =>
        format(new Date(n.createdAt), 'yyyy-MM-dd') ===
          format(date, 'yyyy-MM-dd')
      ).length,
      unread: notifications.filter(
        (n) =>
          !n.read &&
          format(new Date(n.createdAt), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      ).length,
    }
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Cards/KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalCount}
              </p>
            </div>
            <Bell className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Não lidas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {unreadCount}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Lidas hoje</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {readTodayCount}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Taxa de leitura</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {readRate.toFixed(1)}%
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico por tipo */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Notificações por Tipo
          </h3>
          {notificationsByType.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={notificationsByType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {notificationsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              Sem dados para exibir
            </div>
          )}
        </div>

        {/* Gráfico temporal */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Últimos 7 Dias
          </h3>
          {last7Days.some((d) => d.total > 0) ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={last7Days}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="date"
                  stroke="#9ca3af"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="total" fill="#3b82f6" name="Total" />
                <Bar dataKey="unread" fill="#eab308" name="Não lidas" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              Sem dados para exibir
            </div>
          )}
        </div>
      </div>

      {/* Abas e lista de notificações */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex gap-4 px-4">
            <button
              onClick={() => setActiveTab('all')}
              className={`py-3 px-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'all'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Todas ({totalCount})
            </button>
            <button
              onClick={() => setActiveTab('unread')}
              className={`py-3 px-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'unread'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Não lidas ({unreadCount})
            </button>
            <button
              onClick={() => setActiveTab('read')}
              className={`py-3 px-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'read'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Lidas ({readCount})
            </button>
          </nav>
        </div>

        <div className="p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {activeTab === 'unread' && unreadCount > 0
              ? `${unreadCount} não lida${unreadCount > 1 ? 's' : ''}`
              : activeTab === 'read'
              ? `${readCount} lida${readCount > 1 ? 's' : ''}`
              : `${totalCount} notificação${totalCount > 1 ? 'ões' : ''}`}
          </h2>
          {activeTab === 'unread' && unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <RefreshCw className="w-4 h-4" />
              Marcar todas como lidas
            </button>
          )}
        </div>

        <div className="px-4 pb-4">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                {activeTab === 'unread'
                  ? 'Nenhuma notificação não lida'
                  : activeTab === 'read'
                  ? 'Nenhuma notificação lida'
                  : 'Nenhuma notificação'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  {...notification}
                  onMarkAsRead={
                    !notification.read ? handleMarkAsRead : undefined
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
