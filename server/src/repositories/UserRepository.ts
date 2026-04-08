import { PrismaClient, Role } from '@prisma/client'
// @ts-ignore - bcryptjs@2.4.3 doesn't have built-in types
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export class UserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } })
  }

  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } })
  }

  async create(data: { email: string; password: string; name: string; role?: Role }) {
    const hashedPassword = await bcrypt.hash(data.password, 10)
    return prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        role: data.role || 'USER',
      },
    })
  }

  async list(options?: { skip?: number; take?: number }) {
    return prisma.user.findMany({
      skip: options?.skip,
      take: options?.take,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    })
  }

  async count() {
    return prisma.user.count()
  }
}

export const userRepository = new UserRepository()
