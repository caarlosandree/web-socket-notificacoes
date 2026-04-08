import express, { Express } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import { config } from './config'
import { errorHandler } from './middleware/errorHandler'
import { notificationRoutes } from './routes/notificationRoutes'
import { authRoutes } from './routes/authRoutes'
import { userRoutes } from './routes/userRoutes'

const app: Express = express()

app.use(helmet())
app.use(cors({ origin: config.CORS_ORIGIN, credentials: true }))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Log todas as requisições
app.use((req, res, next) => {
  console.log('[app] request:', req.method, req.url, req.headers.authorization ? 'com token' : 'sem token')
  next()
})

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
})

app.use(globalLimiter)
app.use('/api/v1/auth', authLimiter)

app.get('/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } })
})

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/notifications', notificationRoutes)

app.use(errorHandler)

export { app }
