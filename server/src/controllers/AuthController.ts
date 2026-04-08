import { Request, Response } from 'express'
import { BaseController } from './BaseController'
import { authService } from '../services/AuthService'
import type { RegisterInput, LoginInput, RefreshTokenInput } from '../validators/auth.schema'

export class AuthController extends BaseController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body as RegisterInput
      const result = await authService.register(data)
      this.handleSuccess(res, result, 201)
    } catch (error) {
      this.handleError(error, res, 'AuthController.register')
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body as LoginInput
      const result = await authService.login(data)
      this.handleSuccess(res, result)
    } catch (error) {
      this.handleError(error, res, 'AuthController.login')
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body as RefreshTokenInput
      const tokens = await authService.refreshTokens(refreshToken)
      this.handleSuccess(res, tokens)
    } catch (error) {
      this.handleError(error, res, 'AuthController.refreshToken')
    }
  }
}

export const authController = new AuthController()
