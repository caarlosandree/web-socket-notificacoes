import { Response, NextFunction } from 'express'
import { AppError } from '../utils/AppError'
import { AuthRequest } from '../types'
import { userRepository } from '../repositories/UserRepository'

export async function requireAdmin(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  console.log('[requireAdmin] verificando usuário:', req.user?.userId)
  const user = await userRepository.findById(req.user!.userId)
  console.log('[requireAdmin] usuário encontrado:', user?.id, 'role:', user?.role)
  if (!user || user.role !== 'ADMIN') {
    throw new AppError('Acesso negado. Apenas administradores.', 403, 'FORBIDDEN')
  }
  next()
}
