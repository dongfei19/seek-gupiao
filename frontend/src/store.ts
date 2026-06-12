import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: number
  email: string
  username: string
}

interface Settings {
  technical: {
    consolidationDays: number
    maxAmplitude: number
    chipConcentration: number
  }
  fundamental: {
    minNetProfit: number
    minCirculatingShares: number
    minProfitYears: number
  }
}

interface AppState {
  user: User | null
  token: string | null
  settings: Settings
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  setSettings: (settings: Settings) => void
  logout: () => void
}

const defaultSettings: Settings = {
  technical: {
    consolidationDays: 120,
    maxAmplitude: 0.15,
    chipConcentration: 0.3,
  },
  fundamental: {
    minNetProfit: 500000000,
    minCirculatingShares: 500000000,
    minProfitYears: 5,
  },
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      settings: defaultSettings,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setSettings: (settings) => set({ settings }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'seek-gupiao-storage',
    }
  )
)
