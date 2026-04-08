'use client'

import { useEffect, useState } from 'react'
import { X, Info, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastType = 'info' | 'success' | 'warning' | 'error'

interface ToastProps {
  id: string
  type: ToastType
  title: string
  message: string
  onClose: (id: string) => void
}

const icons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
}

const colors = {
  info: 'bg-blue-500',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
}

export function Toast({ id, type, title, message, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)
  const Icon = icons[type]

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onClose(id), 300)
    }, 5000)

    return () => clearTimeout(timer)
  }, [id, onClose])

  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-50 flex items-start gap-3 p-4 rounded-lg shadow-lg transition-all duration-300',
        'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
      )}
    >
      <div className={cn('p-2 rounded-full', colors[type])}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900 dark:text-white">{title}</h4>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{message}</p>
      </div>
      <button
        onClick={() => {
          setIsVisible(false)
          setTimeout(() => onClose(id), 300)
        }}
        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        title="Fechar"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  )
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Array<{ id: string; type: ToastType; title: string; message: string }>>([])

  useEffect(() => {
    const audio = new Audio('/som-do-zap-zap-estourado.mp3')
    audio.volume = 0.5

    const handleNotification = (event: MessageEvent) => {
      if (event.data.type === 'notification') {
        audio.currentTime = 0
        audio.play().catch(console.error)

        setToasts((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            type: event.data.data.type,
            title: event.data.data.title,
            message: event.data.data.message,
          },
        ])
      }
    }

    window.addEventListener('message', handleNotification)
    return () => window.removeEventListener('message', handleNotification)
  }, [])

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 z-50 p-4 space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={removeToast} />
      ))}
    </div>
  )
}
