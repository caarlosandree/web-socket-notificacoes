import { Server as SocketIOServer, Socket } from 'socket.io'
import jwt from 'jsonwebtoken'
import { config } from '../config'

interface AuthenticatedSocket extends Socket {
  userId?: string
}

export class SocketService {
  private io: SocketIOServer | null = null
  private connectedUsers = new Map<string, Set<string>>()

  initialize(server: any): SocketIOServer {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: config.CORS_ORIGIN,
        credentials: true,
      },
      pingTimeout: 60000,
      pingInterval: 25000,
    })

    this.io.use(this.authenticateSocket.bind(this))
    this.setupConnectionHandlers()

    return this.io
  }

  private authenticateSocket(socket: Socket, next: (err?: Error) => void): void {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '')

      if (!token) {
        return next(new Error('Token de autenticação não fornecido'))
      }

      const decoded = jwt.verify(token, config.JWT_SECRET) as { userId: string }
      ;(socket as AuthenticatedSocket).userId = decoded.userId
      next()
    } catch (error) {
      next(new Error('Token inválido'))
    }
  }

  private setupConnectionHandlers(): void {
    if (!this.io) return

    this.io.on('connection', (socket: AuthenticatedSocket) => {
      const userId = socket.userId!
      console.log(`[socket] usuário conectado: ${userId} (socket: ${socket.id})`)

      this.addToUserRoom(userId, socket.id)

      socket.on('join-room', (roomId: string) => {
        socket.join(roomId)
        console.log(`[socket] usuário ${userId} entrou na sala: ${roomId}`)
      })

      socket.on('leave-room', (roomId: string) => {
        socket.leave(roomId)
        console.log(`[socket] usuário ${userId} saiu da sala: ${roomId}`)
      })

      socket.on('disconnect', () => {
        this.removeFromUserRoom(userId, socket.id)
        console.log(`[socket] usuário desconectado: ${userId} (socket: ${socket.id})`)
      })
    })
  }

  private addToUserRoom(userId: string, socketId: string): void {
    if (!this.connectedUsers.has(userId)) {
      this.connectedUsers.set(userId, new Set())
    }
    this.connectedUsers.get(userId)!.add(socketId)
  }

  private removeFromUserRoom(userId: string, socketId: string): void {
    const userSockets = this.connectedUsers.get(userId)
    if (userSockets) {
      userSockets.delete(socketId)
      if (userSockets.size === 0) {
        this.connectedUsers.delete(userId)
      }
    }
  }

  emitToUser(userId: string, event: string, data: unknown): void {
    if (!this.io) {
      console.warn('[socket] Socket.io não inicializado')
      return
    }

    this.io.to(userId).emit(event, data)
  }

  emitToRoom(roomId: string, event: string, data: unknown): void {
    if (!this.io) {
      console.warn('[socket] Socket.io não inicializado')
      return
    }

    this.io.to(roomId).emit(event, data)
  }

  emitToAll(event: string, data: unknown): void {
    if (!this.io) {
      console.warn('[socket] Socket.io não inicializado')
      return
    }

    this.io.emit(event, data)
  }

  getConnectedUsers(): string[] {
    return Array.from(this.connectedUsers.keys())
  }

  getUserSocketCount(userId: string): number {
    return this.connectedUsers.get(userId)?.size || 0
  }

  getIO(): SocketIOServer | null {
    return this.io
  }
}

export const socketService = new SocketService()
