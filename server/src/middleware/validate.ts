import { Request, Response, NextFunction } from 'express'
import { ZodSchema } from 'zod'

type Target = 'body' | 'params' | 'query'

export function validate(schema: ZodSchema, target: Target = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target])
    if (!result.success) {
      res.status(422).json({
        success: false,
        error: 'Validation failed',
        details: result.error.flatten().fieldErrors,
      })
      return
    }
    req[target] = result.data
    next()
  }
}
