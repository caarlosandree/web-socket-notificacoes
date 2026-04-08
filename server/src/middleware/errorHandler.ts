import { Request, Response, NextFunction } from 'express'
import { AppError } from '../utils/AppError'

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
      ...(err.code && { code: err.code }),
    })
    return
  }

  console.error('[Unhandled Error]', err)
  res.status(500).json({ success: false, error: 'Internal server error' })
}
