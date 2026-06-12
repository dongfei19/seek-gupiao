import { Router } from 'express'
import { authenticateToken } from '../middleware/auth.js'
import db from '../models/database.js'

const router = Router()

// 获取用户设置
router.get('/', authenticateToken, (req, res) => {
  try {
    const settings = db.prepare(
      'SELECT * FROM user_settings WHERE user_id = ?'
    ).get(req.user.userId)

    if (!settings) {
      // 返回默认设置
      return res.json({
        success: true,
        data: {
          technical: {
            consolidationDays: 120,
            maxAmplitude: 0.15,
            chipConcentration: 0.3
          },
          fundamental: {
            minNetProfit: 500000000,
            minCirculatingShares: 500000000,
            minProfitYears: 5
          }
        }
      })
    }

    res.json({
      success: true,
      data: {
        technical: JSON.parse(settings.technical_settings),
        fundamental: JSON.parse(settings.fundamental_settings)
      }
    })
  } catch (error) {
    console.error('获取设置错误:', error)
    res.status(500).json({
      success: false,
      message: '获取设置失败'
    })
  }
})

// 更新用户设置
router.put('/', authenticateToken, (req, res) => {
  try {
    const { technical, fundamental } = req.body

    const settings = db.prepare(
      'SELECT id FROM user_settings WHERE user_id = ?'
    ).get(req.user.userId)

    if (settings) {
      // 更新现有设置
      db.prepare(`
        UPDATE user_settings 
        SET technical_settings = ?, fundamental_settings = ?, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
      `).run(
        JSON.stringify(technical),
        JSON.stringify(fundamental),
        req.user.userId
      )
    } else {
      // 创建新设置
      db.prepare(`
        INSERT INTO user_settings (user_id, technical_settings, fundamental_settings)
        VALUES (?, ?, ?)
      `).run(
        req.user.userId,
        JSON.stringify(technical),
        JSON.stringify(fundamental)
      )
    }

    res.json({
      success: true,
      message: '设置已保存',
      data: { technical, fundamental }
    })
  } catch (error) {
    console.error('保存设置错误:', error)
    res.status(500).json({
      success: false,
      message: '保存设置失败'
    })
  }
})

export default router
