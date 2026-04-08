import jwt from 'jsonwebtoken'
// @ts-ignore - bcryptjs@2.4.3 doesn't have built-in types
import bcrypt from 'bcryptjs'
import { AppError } from '../utils/AppError'
import { userRepository } from '../repositories/UserRepository'
import { config } from '../config'
import type { RegisterInput, LoginInput } from '../validators/auth.schema'

export class AuthService {
  async register(data: RegisterInput) {
    const existingUser = await userRepository.findByEmail(data.email)
    if (existingUser) {
      throw new AppError('Email já cadastrado', 409)
    }

    const user = await userRepository.create(data)

    const { accessToken, refreshToken } = this.generateTokens(user.id)

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      accessToken,
      refreshToken,
    }
  }

  async login(data: LoginInput) {
    const user = await userRepository.findByEmail(data.email)
    if (!user) {
      throw new AppError('Credenciais inválidas', 401)
    }

    const isValidPassword = await bcrypt.compare(data.password, user.password)
    if (!isValidPassword) {
      throw new AppError('Credenciais inválidas', 401)
    }

    const { accessToken, refreshToken } = this.generateTokens(user.id)

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      accessToken,
      refreshToken,
    }
  }

  async refreshTokens(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET) as { userId: string }

      const user = await userRepository.findById(decoded.userId)
      if (!user) {
        throw new AppError('Usuário não encontrado', 404)
      }

      const tokens = this.generateTokens(user.id)

      return tokens
    } catch (error) {
      throw new AppError('Refresh token inválido ou expirado', 401)
    }
  }

  private generateTokens(userId: string) {
    const accessToken = jwt.sign(
      { userId },
      config.JWT_SECRET,
      { expiresIn: '1h', issuer: 'api', audience: 'client' }
    )

    const refreshToken = jwt.sign(
      { userId },
      config.JWT_REFRESH_SECRET,
      { expiresIn: '7d', issuer: 'api', audience: 'client' }
    )

    return { accessToken, refreshToken }
  }
}

export const authService = new AuthService()
