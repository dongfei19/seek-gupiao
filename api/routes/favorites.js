import { Router } from 'express'
import { authenticateToken } from '../middleware/auth.js'
import db from '../models/database.js'

const router = Router()

// 获取收藏列表
router.get('/', authenticateToken, (req, res) => {
  try {
    const favorites = db.prepare(
      'SELECT * FROM favorites WHERE user_id = ? ORDER BY created_at DESC'
    ).all(req.user.userId)

    res.json({
      success: true,
      data: favorites
    })
  } catch (error) {
    console.error('获取收藏错误:', error)
    res.status(500).json({
      success: false,
      message: '获取收藏失败'
    })
  }
})

// 添加收藏
router.post('/', authenticateToken, (req, res) => {
  try {
    const { stockCode, stockName } = req.body

    // 检查是否已收藏
    const existing = db.prepare(
      'SELECT id FROM favorites WHERE user_id = ? AND stock_code = ?'
    ).get(req.user.userId, stockCode)

    if (existing) {
      return res.status(400).json({
        success: false,
        message: '该股票已在收藏夹中'
      })
    }

    const result = db.prepare(
      'INSERT INTO favorites (user_id, stock_code, stock_name) VALUES (?, ?, ?)'
    ).run(req.user.userId, stockCode, stockName)

    res.status(201).json({
      success: true,
      data: {
        id: result.lastInsertRowid,
        stockCode,
        stockName
      }
    })
  } catch (error) {
    console.error('添加收藏错误:', error)
    res.status(500).json({
      success: false,
      message: '添加收藏失败'
    })
  }
})

// 删除收藏
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const result = db.prepare(
      'DELETE FROM favorites WHERE id = ? AND user_id = ?'
    ).run(req.params.id, req.user.userId)

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: '收藏不存在或无权删除'
      })
    }

    res.json({
      success: true,
      message: '已取消收藏'
    })
  } catch (error) {
    console.error('删除收藏错误:', error)
    res.status(500).json({
      success: false,
      message: '删除收藏失败'
    })
  }
})

export default router
