const API_BASE = '/api'

interface RequestOptions {
  method?: string
  body?: any
  headers?: Record<string, string>
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const token = localStorage.getItem('seek-gupiao-storage')
    ? JSON.parse(localStorage.getItem('seek-gupiao-storage') || '{}').state?.token
    : null

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || '请求失败')
  }

  return response.json()
}

export const authService = {
  register: (email: string, password: string, username: string) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: { email, password, username },
    }),

  login: (email: string, password: string) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: { email, password },
    }),

  logout: () => apiRequest('/auth/logout', { method: 'POST' }),

  getProfile: () => apiRequest('/auth/profile'),
}

export const stockService = {
  getStocks: (params?: any) =>
    apiRequest('/stocks', { method: 'GET' }),

  getStockDetail: (code: string) =>
    apiRequest(`/stocks/${code}`),

  runStockPicker: () =>
    apiRequest('/stocks/run', { method: 'POST' }),
}

export const settingsService = {
  getSettings: () => apiRequest('/settings'),

  updateSettings: (settings: any) =>
    apiRequest('/settings', {
      method: 'PUT',
      body: settings,
    }),
}

export const favoriteService = {
  getFavorites: () => apiRequest('/favorites'),

  addFavorite: (stockCode: string, stockName: string) =>
    apiRequest('/favorites', {
      method: 'POST',
      body: { stockCode, stockName },
    }),

  removeFavorite: (id: number) =>
    apiRequest(`/favorites/${id}`, { method: 'DELETE' }),
}
