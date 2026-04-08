import { PrismaClient, NotificationType, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

export class NotificationRepository {
  async create(data: {
    userId: string
    type: NotificationType
    title: string
    message: string
    data?: Prisma.InputJsonValue
  }) {
    return prisma.notification.create({
      data,
    })
  }

  async findByUser(userId: string, options?: { skip?: number; take?: number }) {
    return prisma.notification.findMany({
      where: { userId },
      skip: options?.skip,
      take: options?.take,
      orderBy: { createdAt: 'desc' },
    })
  }

  async findById(id: string) {
    return prisma.notification.findUnique({ where: { id } })
  }

  async markAsRead(id: string, userId: string) {
    return prisma.notification.updateMany({
      where: { id, userId },
      data: { read: true },
    })
  }

  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    })
  }

  async countUnread(userId: string) {
    return prisma.notification.count({
      where: { userId, read: false },
    })
  }

  async countByUser(userId: string) {
    return prisma.notification.count({ where: { userId } })
  }
}

export const notificationRepository = new NotificationRepository()
