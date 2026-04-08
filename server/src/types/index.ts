import { Request } from 'express'

export interface AuthPayload {
  userId: string
  iat?: number
  exp?: number
}

export interface AuthRequest extends Request {
  user?: AuthPayload
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
}

export interface ApiResponse<T> {
  success: true
  data: T
}

export interface ApiListResponse<T> {
  success: true
  data: T[]
  meta: PaginationMeta
}

export interface ApiError {
  success: false
  error: string
  code?: string
}

export interface ApiValidationError {
  success: false
  error: 'Validation failed'
  details: Record<string, string[]>
}
