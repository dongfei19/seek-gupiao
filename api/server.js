import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import stockRoutes from './routes/stocks.js'
import settingsRoutes from './routes/settings.js'
import favoriteRoutes from './routes/favorites.js'
import { initDatabase } from './models/database.js'

const app = express()
const PORT = process.env.PORT || 3001

// 中间件
app.use(cors())
app.use(express.json())

// 初始化数据库
initDatabase()

// 路由
app.use('/api/auth', authRoutes)
app.use('/api/stocks', stockRoutes)
app.use('/api/settings', settingsRoutes)
app.use('/api/favorites', favoriteRoutes)

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API服务运行中' })
})

// 错误处理
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(500).json({
    success: false,
    message: err.message || '服务器内部错误'
  })
})

app.listen(PORT, () => {
  console.log(`API服务运行在 http://localhost:${PORT}`)
})
