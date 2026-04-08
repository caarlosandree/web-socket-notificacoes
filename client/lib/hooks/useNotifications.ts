'use client'

import { useEffect, useState } from 'react'
import { get, patch } from '@/lib/utils/axios'
import { auth } from '@/lib/auth'
import { socketClient } from '@/lib/socket'

type Notification = {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  data: unknown
  read: boolean
  createdAt: string
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchNotifications = async () => {
    try {
      const notifications = await get<Notification[]>('/notifications')
      setNotifications(notifications)
    } catch (error) {
      console.error('Erro ao buscar notificações:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUnreadCount = async () => {
    try {
      const response = await get<{ count: number }>('/notifications/unread-count')
      setUnreadCount(response.count)
    } catch (error) {
      console.error('Erro ao buscar contador:', error)
    }
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      await patch(`/notifications/${id}/read`)
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      )
      fetchUnreadCount()
    } catch (error) {
      console.error('Erro ao marcar como lida:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await patch('/notifications/read-all')
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      fetchUnreadCount()
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error)
    }
  }

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      return
    }

    const token = auth.getAccessToken()!
    socketClient.connect(token)

    socketClient.on('notification', (data) => {
      window.postMessage({ type: 'notification', data }, '*')
      fetchNotifications()
      fetchUnreadCount()
    })

    fetchNotifications()
    fetchUnreadCount()

    return () => {
      socketClient.off('notification')
    }
  }, [])

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    fetchUnreadCount,
    handleMarkAsRead,
    handleMarkAllAsRead,
  }
}
