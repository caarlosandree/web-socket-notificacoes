import { z } from 'zod'

export const createUserSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').max(100),
  role: z.enum(['ADMIN', 'USER']).default('USER'),
})

export type CreateUserInput = z.infer<typeof createUserSchema>
