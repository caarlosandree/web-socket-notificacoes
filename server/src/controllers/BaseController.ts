import { Response } from 'express'
import { AppError } from '../utils/AppError'
import { PaginationMeta } from '../types'

export abstract class BaseController {
  protected handleSuccess<T>(res: Response, data: T, status = 200): void {
    res.status(status).json({ success: true, data })
  }

  protected handleList<T>(res: Response, data: T[], meta: PaginationMeta): void {
    res.status(200).json({ success: true, data, meta })
  }

  protected handleNoContent(res: Response): void {
    res.status(204).send()
  }

  protected handleError(error: unknown, res: Response, context: string): void {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.message,
        ...(error.code && { code: error.code }),
      })
      return
    }
    console.error(`[${context}]`, error)
    res.status(500).json({ success: false, error: 'Internal server error' })
  }
}
