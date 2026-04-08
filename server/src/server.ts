import 'dotenv/config'
import { app } from './app'
import { config } from './config'
import { socketService } from './services/socketService'

const server = app.listen(config.PORT, () => {
  console.log(`[server] running on port ${config.PORT} (${config.NODE_ENV})`)
})

socketService.initialize(server)

process.on('SIGTERM', () => {
  console.log('[server] SIGTERM received — shutting down gracefully')
  const io = socketService.getIO()
  io?.close(() => {
    server.close(() => {
      console.log('[server] closed')
      process.exit(0)
    })
  })
})

process.on('SIGINT', () => {
  console.log('[server] SIGINT received — shutting down gracefully')
  const io = socketService.getIO()
  io?.close(() => {
    server.close(() => {
      console.log('[server] closed')
      process.exit(0)
    })
  })
})
