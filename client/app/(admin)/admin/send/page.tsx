'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { get, post } from '@/lib/utils/axios'
import { auth } from '@/lib/auth'
import { LogOut, Send, Users } from 'lucide-react'

type User = {
  id: string
  email: string
  name: string
  role: string
}

type NotificationType = 'info' | 'success' | 'warning' | 'error'

export default function AdminSendPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set())
  const [broadcast, setBroadcast] = useState(false)
  const [type, setType] = useState<NotificationType>('info')
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState('')

  const fetchUsers = async () => {
    try {
      const users = await get<User[]>('/users')
      setUsers(users)
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleUser = (userId: string) => {
    setSelectedUsers((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(userId)) {
        newSet.delete(userId)
      } else {
        newSet.add(userId)
      }
      return newSet
    })
  }

  const handleSelectAll = () => {
    if (selectedUsers.size === users.length) {
      setSelectedUsers(new Set())
    } else {
      setSelectedUsers(new Set(users.map((u) => u.id)))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setSuccess('')

    try {
      console.log('[handleSubmit] broadcast:', broadcast)
      console.log('[handleSubmit] dados:', { type, title, message })
      console.log('[handleSubmit] token existe:', !!auth.getAccessToken())

      if (broadcast) {
        await post('/notifications/broadcast', { type, title, message })
      } else if (selectedUsers.size > 0) {
        await Promise.all(
          Array.from(selectedUsers).map((userId) =>
            post('/notifications/user', { userId, type, title, message })
          )
        )
      }

      setSuccess(`Notificação enviada para ${broadcast ? 'todos' : selectedUsers.size} usuário(s)`)
      setTitle('')
      setMessage('')
      setSelectedUsers(new Set())
    } catch (error) {
      console.error('Erro ao enviar notificação:', error)
    } finally {
      setSending(false)
    }
  }

  const handleLogout = () => {
    auth.clear()
    router.push('/login')
  }

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push('/login')
      return
    }

    fetchUsers()
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin - Enviar Notificações</h1>
          <button
            onClick={handleLogout}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Sair"
          >
            <LogOut className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Selecionar Usuários</h2>

            <div className="mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={broadcast}
                  onChange={(e) => {
                    setBroadcast(e.target.checked)
                    setSelectedUsers(new Set())
                  }}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700 dark:text-gray-300 font-medium">Enviar para todos (broadcast)</span>
              </label>
            </div>

            {!broadcast && (
              <>
                <div className="mb-4">
                  <button
                    onClick={handleSelectAll}
                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {selectedUsers.size === users.length ? 'Desmarcar todos' : 'Selecionar todos'}
                  </button>
                </div>

                {loading ? (
                  <div className="text-gray-500 dark:text-gray-400">Carregando usuários...</div>
                ) : (
                  <div className="max-h-96 overflow-y-auto space-y-2">
                    {users.map((user) => (
                      <label
                        key={user.id}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedUsers.has(user.id)}
                          onChange={() => handleToggleUser(user.id)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                          {user.role}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Criar Notificação</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tipo
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as NotificationType)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Título
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  maxLength={200}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mensagem
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  maxLength={1000}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {success && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={sending || (!broadcast && selectedUsers.size === 0)}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                {sending ? 'Enviando...' : 'Enviar Notificação'}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Users className="w-4 h-4" />
                <span>Total: {users.length} usuários</span>
                {selectedUsers.size > 0 && (
                  <span className="text-blue-600 dark:text-blue-400">
                    ({selectedUsers.size} selecionados)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
