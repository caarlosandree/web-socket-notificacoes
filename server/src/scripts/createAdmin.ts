import { PrismaClient, Role } from '@prisma/client'
// @ts-ignore - bcryptjs@2.4.3 doesn't have built-in types
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    const email = 'admin@admin.com'
    const password = 'admin123'
    const name = 'Admin'

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      console.log('Usuário admin já existe:', existingUser.email)
      return
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: Role.ADMIN,
      },
    })

    console.log('Usuário admin criado com sucesso:', user.email)
    console.log('Senha:', password)
  } catch (error) {
    console.error('Erro ao criar usuário admin:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()
