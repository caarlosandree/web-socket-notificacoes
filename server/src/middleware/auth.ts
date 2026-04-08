import { Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config'
import { AppError } from '../utils/AppError'
import { AuthRequest, AuthPayload } from '../types'

export function authenticate(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError('Token não informado', 401, 'UNAUTHORIZED')
  }

  const token = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify(token, config.JWT_SECRET, {
      issuer: 'api',
      audience: 'client',
    }) as AuthPayload

    req.user = payload
    next()
  } catch {
    throw new AppError('Token inválido ou expirado', 401, 'INVALID_TOKEN')
  }
}
