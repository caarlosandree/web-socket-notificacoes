import { Router } from 'express'
import { authController } from '../controllers/AuthController'
import { validate } from '../middleware/validate'
import { asyncWrap } from '../middleware/asyncWrap'
import { registerSchema, loginSchema, refreshTokenSchema } from '../validators/auth.schema'

const router: Router = Router()

router.post(
  '/register',
  validate(registerSchema),
  asyncWrap((req, res) => authController.register(req, res))
)

router.post(
  '/login',
  validate(loginSchema),
  asyncWrap((req, res) => authController.login(req, res))
)

router.post(
  '/refresh',
  validate(refreshTokenSchema),
  asyncWrap((req, res) => authController.refreshToken(req, res))
)

export { router as authRoutes }
