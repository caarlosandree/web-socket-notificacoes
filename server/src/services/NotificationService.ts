import { NotificationType, Prisma } from '@prisma/client'
import { AppError } from '../utils/AppError'
import { notificationRepository } from '../repositories/NotificationRepository'
import { userRepository } from '../repositories/UserRepository'
import { socketService } from './socketService'
import type { SendNotificationInput, BroadcastNotificationInput, SendRoomNotificationInput } from '../validators/notification.schema'

export class NotificationService {
  async sendToUser(data: SendNotificationInput) {
    // Converter type para uppercase para corresponder ao enum do Prisma
    const notificationType = data.type.toUpperCase() as NotificationType

    const notification = await notificationRepository.create({
      userId: data.userId,
      type: notificationType,
      title: data.title,
      message: data.message,
      data: data.data as Prisma.InputJsonValue,
    })

    socketService.emitToUser(data.userId, 'notification', {
      id: notification.id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      data: notification.data,
      read: notification.read,
      createdAt: notification.createdAt,
    })

    return notification
  }

  async list(userId: string, options?: { skip?: number; take?: number }) {
    return notificationRepository.findByUser(userId, options)
  }

  async markAsRead(notificationId: string, userId: string) {
    const notification = await notificationRepository.findById(notificationId)
    if (!notification) {
      throw new AppError('Notificação não encontrada', 404)
    }

    if (notification.userId !== userId) {
      throw new AppError('Acesso negado', 403)
    }

    await notificationRepository.markAsRead(notificationId, userId)
  }

  async markAllAsRead(userId: string) {
    await notificationRepository.markAllAsRead(userId)
  }

  async getUnreadCount(userId: string) {
    return notificationRepository.countUnread(userId)
  }

  async broadcast(data: BroadcastNotificationInput) {
    console.log('[NotificationService.broadcast] iniciando broadcast', data)

    // Buscar todos os usuários
    const users = await userRepository.list()
    console.log('[NotificationService.broadcast] usuários encontrados:', users.length)

    // Converter type para uppercase para corresponder ao enum do Prisma
    const notificationType = data.type.toUpperCase() as NotificationType
    console.log('[NotificationService.broadcast] tipo convertido:', notificationType)

    // Criar notificações para todos os usuários
    const notifications = await Promise.all(
      users.map((user) =>
        notificationRepository.create({
          userId: user.id,
          type: notificationType,
          title: data.title,
          message: data.message,
          data: data.data as Prisma.InputJsonValue,
        })
      )
    )
    console.log('[NotificationService.broadcast] notificações criadas:', notifications.length)

    // Enviar via socket para todos
    socketService.emitToAll('notification', {
      type: data.type,
      title: data.title,
      message: data.message,
      data: data.data,
      timestamp: new Date().toISOString(),
    })
    console.log('[NotificationService.broadcast] broadcast enviado via socket')

    return { count: notifications.length }
  }

  async sendToRoom(data: SendRoomNotificationInput) {
    // Para salas, precisamos saber quais usuários estão na sala
    // Por enquanto, vamos assumir que a sala contém usuários específicos
    // Isso pode ser expandido para buscar usuários de uma tabela de salas
    
    // Enviar via socket para a sala
    socketService.emitToRoom(data.roomId, 'notification', {
      type: data.type,
      title: data.title,
      message: data.message,
      data: data.data,
      timestamp: new Date().toISOString(),
    })

    // Nota: Para persistência de notificações por sala, precisaríamos
    // de uma tabela que mapeia salas para usuários
    return { message: 'Notificação enviada para a sala' }
  }
}

export const notificationService = new NotificationService()
