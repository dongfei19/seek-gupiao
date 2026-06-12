import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import db from '../models/database.js'

const JWT_SECRET = process.env.JWT_SECRET || 'seek-gupiao-secret-key-2024'

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({
      success: false,
      message: '请先登录'
    })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Token已过期，请重新登录'
    })
  }
}

export async function register(req, res) {
  try {
    const { email, password, username } = req.body

    // 检查邮箱是否已存在
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email)
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: '该邮箱已被注册'
      })
    }

    // 加密密码
    const passwordHash = await bcrypt.hash(password, 10)

    // 创建用户
    const result = db.prepare(
      'INSERT INTO users (email, password_hash, username) VALUES (?, ?, ?)'
    ).run(email, passwordHash, username)

    const userId = result.lastInsertRowid

    // 创建默认设置
    const defaultTechnicalSettings = JSON.stringify({
      consolidationDays: 120,
      maxAmplitude: 0.15,
      chipConcentration: 0.3
    })
    const defaultFundamentalSettings = JSON.stringify({
      minNetProfit: 500000000,
      minCirculatingShares: 500000000,
      minProfitYears: 5
    })

    db.prepare(
      'INSERT INTO user_settings (user_id, technical_settings, fundamental_settings) VALUES (?, ?, ?)'
    ).run(userId, defaultTechnicalSettings, defaultFundamentalSettings)

    res.status(201).json({
      success: true,
      data: {
        id: userId,
        email,
        username
      }
    })
  } catch (error) {
    console.error('注册错误:', error)
    res.status(500).json({
      success: false,
      message: '注册失败，请稍后重试'
    })
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body

    // 查找用户
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '邮箱或密码错误'
      })
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password_hash)
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: '邮箱或密码错误'
      })
    }

    // 生成token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username
        }
      }
    })
  } catch (error) {
    console.error('登录错误:', error)
    res.status(500).json({
      success: false,
      message: '登录失败，请稍后重试'
    })
  }
}

export function logout(req, res) {
  res.json({
    success: true,
    message: '已退出登录'
  })
}

export function getProfile(req, res) {
  try {
    const user = db.prepare(
      'SELECT id, email, username, created_at FROM users WHERE id = ?'
    ).get(req.user.userId)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      })
    }

    res.json({
      success: true,
      data: user
    })
  } catch (error) {
    console.error('获取用户信息错误:', error)
    res.status(500).json({
      success: false,
      message: '获取用户信息失败'
    })
  }
}
