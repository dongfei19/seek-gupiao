import { Router } from 'express'
import { authenticateToken } from '../middleware/auth.js'

const router = Router()

// 模拟股票数据
const mockStocks = [
  {
    code: '600519',
    name: '贵州茅台',
    industry: '白酒',
    price: 1850.5,
    change: 2.35,
    amplitude: 0.08,
    netProfit: 70000000000,
    isChipConcentrated: true,
    hasMoat: true
  },
  {
    code: '000858',
    name: '五粮液',
    industry: '白酒',
    price: 168.3,
    change: 1.82,
    amplitude: 0.10,
    netProfit: 30000000000,
    isChipConcentrated: true,
    hasMoat: true
  },
  {
    code: '600036',
    name: '招商银行',
    industry: '金融',
    price: 35.8,
    change: -0.56,
    amplitude: 0.12,
    netProfit: 140000000000,
    isChipConcentrated: true,
    hasMoat: true
  },
  {
    code: '601318',
    name: '中国平安',
    industry: '金融',
    price: 48.5,
    change: 0.85,
    amplitude: 0.09,
    netProfit: 120000000000,
    isChipConcentrated: false,
    hasMoat: true
  },
  {
    code: '000333',
    name: '美的集团',
    industry: '家电',
    price: 62.3,
    change: 1.23,
    amplitude: 0.11,
    netProfit: 35000000000,
    isChipConcentrated: true,
    hasMoat: true
  }
]

// 获取股票列表
router.get('/', authenticateToken, (req, res) => {
  res.json({
    success: true,
    data: {
      stocks: mockStocks,
      total: mockStocks.length,
      page: 1,
      pageSize: 20
    }
  })
})

// 获取股票详情
router.get('/:code', authenticateToken, (req, res) => {
  const stock = mockStocks.find(s => s.code === req.params.code)
  
  if (!stock) {
    return res.status(404).json({
      success: false,
      message: '股票不存在'
    })
  }

  res.json({
    success: true,
    data: stock
  })
})

// 执行选股
router.post('/run', authenticateToken, (req, res) => {
  // 这里可以调用Python选股脚本
  // 目前返回模拟数据
  res.json({
    success: true,
    message: '选股执行完成',
    data: {
      stocks: mockStocks,
      total: mockStocks.length
    }
  })
})

export default router
