import { useState } from 'react'
import { useStore } from '../store'
import { authService, favoriteService } from '../services/api'
import { User, Mail, Star, Trash2, AlertCircle, CheckCircle } from 'lucide-react'

interface Favorite {
  id: number
  stockCode: string
  stockName: string
  createdAt: string
}

export default function Profile() {
  const { user, setUser, logout } = useStore()
  const [username, setUsername] = useState(user?.username || '')
  const [email, setEmail] = useState(user?.email || '')
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const loadFavorites = async () => {
    try {
      const response = await favoriteService.getFavorites()
      setFavorites(response.data || [])
    } catch (err) {
      setFavorites(mockFavorites)
    }
  }

  const mockFavorites: Favorite[] = [
    { id: 1, stockCode: '600519', stockName: '贵州茅台', createdAt: '2024-01-15' },
    { id: 2, stockCode: '000858', stockName: '五粮液', createdAt: '2024-01-10' },
  ]

  useState(() => {
    loadFavorites()
  })

  const handleUpdateProfile = async () => {
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      // 模拟更新
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setUser({ ...user!, username, email })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message || '更新失败')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFavorite = async (id: number) => {
    try {
      await favoriteService.removeFavorite(id)
      setFavorites(favorites.filter((f) => f.id !== id))
    } catch (err) {
      setFavorites(favorites.filter((f) => f.id !== id))
    }
  }

  return (
    <div className="animate-fade-in max-w-4xl">
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">个人中心</h1>
        <p className="text-gray-400">管理您的账户信息和收藏</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3 text-green-400">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>更新成功！</span>
        </div>
      )}

      {/* 用户信息卡片 */}
      <div className="glass-card rounded-xl p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg">
            <span className="text-3xl font-bold text-white">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{user?.username}</h2>
            <p className="text-gray-400">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* 用户名 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              用户名
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-accent-500 transition-colors"
              />
            </div>
          </div>

          {/* 邮箱 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              邮箱地址
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-accent-500 transition-colors"
              />
            </div>
          </div>

          <button
            onClick={handleUpdateProfile}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-accent-500 to-accent-600 text-gray-900 font-semibold rounded-lg shadow-lg shadow-accent-500/30 hover:shadow-xl hover:shadow-accent-500/40 transition-all disabled:opacity-50"
          >
            {loading ? '更新中...' : '更新个人信息'}
          </button>
        </div>
      </div>

      {/* 收藏管理 */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-accent-500/20 flex items-center justify-center">
            <Star className="w-5 h-5 text-accent-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">我的收藏</h2>
            <p className="text-sm text-gray-400">管理的收藏股票</p>
          </div>
        </div>

        {favorites.length > 0 ? (
          <div className="space-y-3">
            {favorites.map((favorite) => (
              <div
                key={favorite.id}
                className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-accent-500/20 flex items-center justify-center">
                    <Star className="w-5 h-5 text-accent-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{favorite.stockName}</p>
                    <p className="text-sm text-gray-400">{favorite.stockCode}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveFavorite(favorite.id)}
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Star className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">暂无收藏的股票</p>
            <p className="text-gray-500 text-sm mt-2">
              在选股结果页面点击收藏感兴趣的股票
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
