import { useState, useEffect } from 'react'
import { stockService } from '../services/api'
import { TrendingUp, Star, RefreshCw, ArrowUpDown, Search } from 'lucide-react'

interface Stock {
  code: string
  name: string
  industry: string
  price: number
  change: number
  amplitude: number
  netProfit: number
  isChipConcentrated: boolean
  hasMoat: boolean
}

export default function Dashboard() {
  const [stocks, setStocks] = useState<Stock[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<keyof Stock>('change')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const loadStocks = async () => {
    setLoading(true)
    try {
      const response = await stockService.getStocks()
      setStocks(response.data?.stocks || mockStocks)
    } catch (error) {
      setStocks(mockStocks)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStocks()
  }, [])

  const mockStocks: Stock[] = [
    {
      code: '600519',
      name: '贵州茅台',
      industry: '白酒',
      price: 1850.5,
      change: 2.35,
      amplitude: 0.08,
      netProfit: 70000000000,
      isChipConcentrated: true,
      hasMoat: true,
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
      hasMoat: true,
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
      hasMoat: true,
    },
  ]

  const handleSort = (field: keyof Stock) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('desc')
    }
  }

  const filteredAndSortedStocks = stocks
    .filter(
      (stock) =>
        stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.code.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = a[sortField]
      const bVal = b[sortField]
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal
      }
      return 0
    })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 2,
    }).format(price)
  }

  const formatProfit = (profit: number) => {
    if (profit >= 100000000) {
      return `${(profit / 100000000).toFixed(0)}亿`
    }
    return `${(profit / 10000).toFixed(0)}万`
  }

  return (
    <div className="animate-fade-in">
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">选股结果</h1>
        <p className="text-gray-400">基于您的条件筛选出的优质股票</p>
      </div>

      {/* 操作栏 */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* 搜索框 */}
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜索股票代码或名称..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-500 transition-colors"
          />
        </div>

        {/* 刷新按钮 */}
        <button
          onClick={loadStocks}
          disabled={loading}
          className="px-6 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white hover:bg-gray-700/50 transition-colors flex items-center gap-2"
        >
          <RefreshCw
            className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`}
          />
          刷新
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-card rounded-xl p-6 hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">符合条件的股票</p>
              <p className="text-3xl font-bold text-white mt-1">
                {stocks.length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary-400" />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">筹码集中</p>
              <p className="text-3xl font-bold text-accent-400 mt-1">
                {stocks.filter((s) => s.isChipConcentrated).length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-accent-500/20 flex items-center justify-center">
              <Star className="w-6 h-6 text-accent-400" />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">有护城河</p>
              <p className="text-3xl font-bold text-green-400 mt-1">
                {stocks.filter((s) => s.hasMoat).length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">平均涨幅</p>
              <p className="text-3xl font-bold text-white mt-1">
                {stocks.length > 0
                  ? (
                      stocks.reduce((sum, s) => sum + s.change, 0) /
                      stocks.length
                    ).toFixed(2)
                  : '0.00'}
                %
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <ArrowUpDown className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* 股票列表 */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                  股票代码
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                  股票名称
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                  行业
                </th>
                <th
                  className="px-6 py-4 text-right text-sm font-medium text-gray-400 cursor-pointer hover:text-white"
                  onClick={() => handleSort('price')}
                >
                  <div className="flex items-center justify-end gap-1">
                    最新价
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </th>
                <th
                  className="px-6 py-4 text-right text-sm font-medium text-gray-400 cursor-pointer hover:text-white"
                  onClick={() => handleSort('change')}
                >
                  <div className="flex items-center justify-end gap-1">
                    涨跌幅
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-400">
                  振幅
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-400">
                  净利润
                </th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-400">
                  标签
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedStocks.map((stock, index) => (
                <tr
                  key={stock.code}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <td className="px-6 py-4 text-white font-mono">
                    {stock.code}
                  </td>
                  <td className="px-6 py-4 text-white font-medium">
                    {stock.name}
                  </td>
                  <td className="px-6 py-4 text-gray-400">{stock.industry}</td>
                  <td className="px-6 py-4 text-right text-white">
                    {formatPrice(stock.price)}
                  </td>
                  <td
                    className={`px-6 py-4 text-right font-medium ${
                      stock.change >= 0 ? 'text-red-400' : 'text-green-400'
                    }`}
                  >
                    {stock.change >= 0 ? '+' : ''}
                    {stock.change.toFixed(2)}%
                  </td>
                  <td className="px-6 py-4 text-right text-gray-400">
                    {(stock.amplitude * 100).toFixed(2)}%
                  </td>
                  <td className="px-6 py-4 text-right text-gray-400">
                    {formatProfit(stock.netProfit)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {stock.isChipConcentrated && (
                        <span className="px-2 py-1 text-xs bg-accent-500/20 text-accent-400 rounded">
                          筹码集中
                        </span>
                      )}
                      {stock.hasMoat && (
                        <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded">
                          护城河
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAndSortedStocks.length === 0 && !loading && (
          <div className="p-12 text-center">
            <TrendingUp className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">暂无符合条件的股票</p>
            <p className="text-gray-500 text-sm mt-2">
              请调整您的选股条件后再试
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
