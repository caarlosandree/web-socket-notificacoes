import { Request, Response } from 'express'
import { BaseController } from './BaseController'
import { userRepository } from '../repositories/UserRepository'
import { AppError } from '../utils/AppError'
import type { AuthRequest } from '../types'

export class UserController extends BaseController {
  async list(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 20
      const skip = (page - 1) * limit

      const [users, total] = await Promise.all([
        userRepository.list({ skip, take: limit }),
        userRepository.count(),
      ])

      this.handleSuccess(res, users, 200)
    } catch (error) {
      this.handleError(error, res, 'UserController.list')
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const user = await userRepository.create(req.body)
      this.handleSuccess(res, {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      }, 201)
    } catch (error) {
      this.handleError(error, res, 'UserController.create')
    }
  }

  async getCurrentUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = await userRepository.findById(req.user!.userId)
      if (!user) {
        throw new AppError('Usuário não encontrado', 404)
      }

      this.handleSuccess(res, {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      })
    } catch (error) {
      this.handleError(error, res, 'UserController.getCurrentUser')
    }
  }
}

export const userController = new UserController()
