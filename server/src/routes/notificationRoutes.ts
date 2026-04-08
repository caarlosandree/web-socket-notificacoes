import { Router } from 'express'
import { NotificationController } from '../controllers/notificationController'
import { validate } from '../middleware/validate'
import { asyncWrap } from '../middleware/asyncWrap'
import { authenticate } from '../middleware/auth'
import { requireAdmin } from '../middleware/requireAdmin'
import {
  sendNotificationSchema,
  sendRoomNotificationSchema,
  broadcastNotificationSchema,
} from '../validators/notification.schema'

const router: Router = Router()
const notificationController = new NotificationController()

router.post(
  '/user',
  authenticate,
  asyncWrap(requireAdmin),
  validate(sendNotificationSchema),
  asyncWrap((req, res) => notificationController.sendToUser(req, res))
)

router.post(
  '/room',
  authenticate,
  asyncWrap(requireAdmin),
  validate(sendRoomNotificationSchema),
  asyncWrap((req, res) => notificationController.sendToRoom(req, res))
)

router.post(
  '/broadcast',
  authenticate,
  asyncWrap(requireAdmin),
  validate(broadcastNotificationSchema),
  asyncWrap((req, res) => notificationController.broadcast(req, res))
)

router.get(
  '/connected-users',
  authenticate,
  requireAdmin,
  asyncWrap((req, res) => notificationController.getConnectedUsers(req, res))
)

router.get(
  '/',
  authenticate,
  asyncWrap((req, res) => notificationController.list(req, res))
)

router.patch(
  '/:id/read',
  authenticate,
  asyncWrap((req, res) => notificationController.markAsRead(req, res))
)

router.patch(
  '/read-all',
  authenticate,
  asyncWrap((req, res) => notificationController.markAllAsRead(req, res))
)

router.get(
  '/unread-count',
  authenticate,
  asyncWrap((req, res) => notificationController.getUnreadCount(req, res))
)

export { router as notificationRoutes }
