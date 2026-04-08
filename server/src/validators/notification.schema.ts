import { z } from 'zod'

export const sendNotificationSchema = z.object({
  userId: z.string().uuid('ID de usuário inválido'),
  type: z.enum(['info', 'success', 'warning', 'error']),
  title: z.string().min(1).max(200),
  message: z.string().min(1).max(1000),
  data: z.record(z.unknown()).optional(),
})

export const sendRoomNotificationSchema = z.object({
  roomId: z.string().min(1),
  type: z.enum(['info', 'success', 'warning', 'error']),
  title: z.string().min(1).max(200),
  message: z.string().min(1).max(1000),
  data: z.record(z.unknown()).optional(),
})

export const broadcastNotificationSchema = z.object({
  type: z.enum(['info', 'success', 'warning', 'error']),
  title: z.string().min(1).max(200),
  message: z.string().min(1).max(1000),
  data: z.record(z.unknown()).optional(),
})

export type SendNotificationInput = z.infer<typeof sendNotificationSchema>
export type SendRoomNotificationInput = z.infer<typeof sendRoomNotificationSchema>
export type BroadcastNotificationInput = z.infer<typeof broadcastNotificationSchema>
