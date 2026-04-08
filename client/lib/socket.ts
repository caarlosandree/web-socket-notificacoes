import { io, Socket } from 'socket.io-client'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

class SocketClient {
  private socket: Socket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5

  connect(token: string) {
    if (this.socket?.connected) return

    this.socket = io(API_URL, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: this.maxReconnectAttempts,
    })

    this.socket.on('connect', () => {
      console.log('[socket] conectado')
      this.reconnectAttempts = 0
    })

    this.socket.on('disconnect', (reason) => {
      console.log('[socket] desconectado:', reason)
    })

    this.socket.on('connect_error', (error) => {
      console.error('[socket] erro de conexão:', error)
      this.reconnectAttempts++
    })

    return this.socket
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  on(event: string, callback: (...args: unknown[]) => void) {
    this.socket?.on(event, callback)
  }

  off(event: string, callback?: (...args: unknown[]) => void) {
    this.socket?.off(event, callback)
  }

  emit(event: string, data?: unknown) {
    this.socket?.emit(event, data)
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false
  }
}

export const socketClient = new SocketClient()
