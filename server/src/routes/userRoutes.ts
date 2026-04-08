import { Router } from 'express'
import { userController } from '../controllers/UserController'
import { validate } from '../middleware/validate'
import { asyncWrap } from '../middleware/asyncWrap'
import { authenticate } from '../middleware/auth'
import { requireAdmin } from '../middleware/requireAdmin'
import { createUserSchema } from '../validators/user.schema'

const router: Router = Router()

router.get(
  '/',
  authenticate,
  requireAdmin,
  asyncWrap((req, res) => userController.list(req, res))
)

router.post(
  '/',
  authenticate,
  requireAdmin,
  validate(createUserSchema),
  asyncWrap((req, res) => userController.create(req, res))
)

router.get(
  '/me',
  authenticate,
  asyncWrap((req, res) => userController.getCurrentUser(req, res))
)

export { router as userRoutes }
