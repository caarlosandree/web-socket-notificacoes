import { Request, Response } from 'express'
import { AppError } from '../utils/AppError'
import { BaseController } from './BaseController'
import { socketService } from '../services/socketService'
import { notificationService } from '../services/NotificationService'
import type { SendNotificationInput, SendRoomNotificationInput, BroadcastNotificationInput } from '../validators/notification.schema'
import type { AuthRequest as AuthRequestType } from '../types'

export class NotificationController extends BaseController {
  async sendToUser(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body as SendNotificationInput
      const notification = await notificationService.sendToUser(data)
      this.handleSuccess(res, { message: 'Notificação enviada com sucesso', notification })
    } catch (error) {
      this.handleError(error, res, 'NotificationController.sendToUser')
    }
  }

  async sendToRoom(req: Request, res: Response): Promise<void> {
    try {
      const { roomId, type, title, message, data } = req.body as SendRoomNotificationInput

      socketService.emitToRoom(roomId, 'notification', {
        type,
        title,
        message,
        data,
        timestamp: new Date().toISOString(),
      })

      this.handleSuccess(res, { message: 'Notificação enviada para a sala com sucesso' })
    } catch (error) {
      this.handleError(error, res, 'NotificationController.sendToRoom')
    }
  }

  async broadcast(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body as BroadcastNotificationInput
      const result = await notificationService.broadcast(data)
      this.handleSuccess(res, { message: 'Notificação broadcast enviada com sucesso', count: result.count })
    } catch (error) {
      this.handleError(error, res, 'NotificationController.broadcast')
    }
  }

  async getConnectedUsers(_req: Request, res: Response): Promise<void> {
    try {
      const connectedUsers = socketService.getConnectedUsers()
      this.handleSuccess(res, { connectedUsers, count: connectedUsers.length })
    } catch (error) {
      this.handleError(error, res, 'NotificationController.getConnectedUsers')
    }
  }

  async list(req: AuthRequestType, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 20
      const skip = (page - 1) * limit

      const notifications = await notificationService.list(req.user!.userId, { skip, take: limit })
      this.handleSuccess(res, notifications)
    } catch (error) {
      this.handleError(error, res, 'NotificationController.list')
    }
  }

  async markAsRead(req: AuthRequestType, res: Response): Promise<void> {
    try {
      const { id } = req.params
      await notificationService.markAsRead(id as string, req.user!.userId)
      this.handleSuccess(res, { message: 'Notificação marcada como lida' })
    } catch (error) {
      this.handleError(error, res, 'NotificationController.markAsRead')
    }
  }

  async markAllAsRead(req: AuthRequestType, res: Response): Promise<void> {
    try {
      await notificationService.markAllAsRead(req.user!.userId)
      this.handleSuccess(res, { message: 'Todas as notificações marcadas como lidas' })
    } catch (error) {
      this.handleError(error, res, 'NotificationController.markAllAsRead')
    }
  }

  async getUnreadCount(req: AuthRequestType, res: Response): Promise<void> {
    try {
      const count = await notificationService.getUnreadCount(req.user!.userId)
      this.handleSuccess(res, { count })
    } catch (error) {
      this.handleError(error, res, 'NotificationController.getUnreadCount')
    }
  }
}
