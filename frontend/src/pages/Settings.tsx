import { useState, useEffect } from 'react'
import { useStore } from '../store'
import { settingsService, stockService } from '../services/api'
import { Save, RotateCcw, TrendingUp, DollarSign, AlertCircle } from 'lucide-react'

export default function Settings() {
  const { settings, setSettings } = useStore()
  const [technical, setTechnical] = useState(settings.technical)
  const [fundamental, setFundamental] = useState(settings.fundamental)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [running, setRunning] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const response = await settingsService.getSettings()
      if (response.data) {
        setTechnical(response.data.technical)
        setFundamental(response.data.fundamental)
        setSettings(response.data)
      }
    } catch (err) {
      // 使用默认设置
    }
  }

  const handleSave = async () => {
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const newSettings = { technical, fundamental }
      await settingsService.updateSettings(newSettings)
      setSettings(newSettings)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message || '保存失败')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setTechnical({
      consolidationDays: 120,
      maxAmplitude: 0.15,
      chipConcentration: 0.3,
    })
    setFundamental({
      minNetProfit: 500000000,
      minCirculatingShares: 500000000,
      minProfitYears: 5,
    })
  }

  const handleRunPicker = async () => {
    setRunning(true)
    try {
      await handleSave()
      await stockService.runStockPicker()
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message || '执行失败')
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="animate-fade-in max-w-4xl">
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">条件设置</h1>
        <p className="text-gray-400">自定义您的选股参数</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3 text-green-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>保存成功！</span>
        </div>
      )}

      {/* 技术指标设置 */}
      <div className="glass-card rounded-xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">技术面指标</h2>
            <p className="text-sm text-gray-400">股价走势和技术形态筛选</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* 盘振天数 */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-300">
                盘振天数
              </label>
              <span className="text-sm text-accent-400">
                {technical.consolidationDays} 天
              </span>
            </div>
            <input
              type="range"
              min="60"
              max="240"
              step="10"
              value={technical.consolidationDays}
              onChange={(e) =>
                setTechnical({
                  ...technical,
                  consolidationDays: Number(e.target.value),
                })
              }
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-accent-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>60天</span>
              <span>240天</span>
            </div>
          </div>

          {/* 最大振幅 */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-300">
                最大振幅
              </label>
              <span className="text-sm text-accent-400">
                {(technical.maxAmplitude * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              step="1"
              value={technical.maxAmplitude * 100}
              onChange={(e) =>
                setTechnical({
                  ...technical,
                  maxAmplitude: Number(e.target.value) / 100,
                })
              }
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-accent-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>5%</span>
              <span>30%</span>
            </div>
          </div>

          {/* 筹码集中度 */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-300">
                筹码集中度阈值
              </label>
              <span className="text-sm text-accent-400">
                {(technical.chipConcentration * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              step="5"
              value={technical.chipConcentration * 100}
              onChange={(e) =>
                setTechnical({
                  ...technical,
                  chipConcentration: Number(e.target.value) / 100,
                })
              }
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-accent-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>10%</span>
              <span>50%</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              价格偏离阈值越小，筹码越集中
            </p>
          </div>
        </div>
      </div>

      {/* 基本面指标设置 */}
      <div className="glass-card rounded-xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-accent-500/20 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-accent-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">基本面指标</h2>
            <p className="text-sm text-gray-400">财务数据和盈利能力筛选</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* 最低净利润 */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-300">
                最低净利润
              </label>
              <span className="text-sm text-accent-400">
                {(fundamental.minNetProfit / 100000000).toFixed(0)} 亿元
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={fundamental.minNetProfit / 100000000}
              onChange={(e) =>
                setFundamental({
                  ...fundamental,
                  minNetProfit: Number(e.target.value) * 100000000,
                })
              }
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-accent-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1亿</span>
              <span>50亿</span>
            </div>
          </div>

          {/* 最低流通股 */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-300">
                最低流通股
              </label>
              <span className="text-sm text-accent-400">
                {(fundamental.minCirculatingShares / 100000000).toFixed(0)} 亿股
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              step="1"
              value={fundamental.minCirculatingShares / 100000000}
              onChange={(e) =>
                setFundamental({
                  ...fundamental,
                  minCirculatingShares: Number(e.target.value) * 100000000,
                })
              }
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-accent-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1亿</span>
              <span>100亿</span>
            </div>
          </div>

          {/* 持续盈利年限 */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-300">
                持续盈利年限
              </label>
              <span className="text-sm text-accent-400">
                {fundamental.minProfitYears} 年
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={fundamental.minProfitYears}
              onChange={(e) =>
                setFundamental({
                  ...fundamental,
                  minProfitYears: Number(e.target.value),
                })
              }
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-accent-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1年</span>
              <span>10年</span>
            </div>
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-4">
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex-1 py-3 bg-gradient-to-r from-accent-500 to-accent-600 text-gray-900 font-semibold rounded-lg shadow-lg shadow-accent-500/30 hover:shadow-xl hover:shadow-accent-500/40 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          {loading ? '保存中...' : '保存设置'}
        </button>

        <button
          onClick={handleReset}
          className="px-6 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white hover:bg-gray-700/50 transition-colors flex items-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          恢复默认
        </button>
      </div>

      {/* 执行选股按钮 */}
      <div className="mt-6">
        <button
          onClick={handleRunPicker}
          disabled={running}
          className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-lg shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <TrendingUp className="w-5 h-5" />
          {running ? '执行选股中...' : '立即执行选股'}
        </button>
      </div>
    </div>
  )
}
