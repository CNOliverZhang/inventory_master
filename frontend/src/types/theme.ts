// 主题配置
export interface ThemeConfig {
  id: string
  name: string
  nameEn: string
  primary: {
    from: string
    to: string
  }
  secondary: {
    from: string
    to: string
  }
  accent: {
    from: string
    to: string
  }
}

// 预设主题
export const THEME_PRESETS: ThemeConfig[] = [
  {
    id: 'ocean',
    name: '海洋蓝',
    nameEn: 'Ocean Blue',
    primary: { from: '#06b6d4', to: '#3b82f6' }, // cyan-500 to blue-500
    secondary: { from: '#0891b2', to: '#2563eb' }, // cyan-600 to blue-600
    accent: { from: '#0e7490', to: '#1d4ed8' }, // cyan-700 to blue-700
  },
  {
    id: 'purple',
    name: '紫罗兰',
    nameEn: 'Purple Dream',
    primary: { from: '#8b5cf6', to: '#d946ef' }, // violet-500 to fuchsia-500
    secondary: { from: '#7c3aed', to: '#c026d3' }, // violet-600 to fuchsia-600
    accent: { from: '#6d28d9', to: '#a21caf' }, // violet-700 to fuchsia-700
  },
  {
    id: 'sunset',
    name: '日落橙',
    nameEn: 'Sunset Orange',
    primary: { from: '#f59e0b', to: '#ef4444' }, // amber-500 to red-500
    secondary: { from: '#d97706', to: '#dc2626' }, // amber-600 to red-600
    accent: { from: '#b45309', to: '#b91c1c' }, // amber-700 to red-700
  },
  {
    id: 'forest',
    name: '森林绿',
    nameEn: 'Forest Green',
    primary: { from: '#10b981', to: '#059669' }, // emerald-500 to emerald-600
    secondary: { from: '#059669', to: '#047857' }, // emerald-600 to emerald-700
    accent: { from: '#047857', to: '#065f46' }, // emerald-700 to emerald-800
  },
  {
    id: 'rose',
    name: '玫瑰粉',
    nameEn: 'Rose Pink',
    primary: { from: '#ec4899', to: '#f43f5e' }, // pink-500 to rose-500
    secondary: { from: '#db2777', to: '#e11d48' }, // pink-600 to rose-600
    accent: { from: '#be185d', to: '#be123c' }, // pink-700 to rose-700
  },
  {
    id: 'indigo',
    name: '靛青紫',
    nameEn: 'Indigo Night',
    primary: { from: '#6366f1', to: '#8b5cf6' }, // indigo-500 to violet-500
    secondary: { from: '#4f46e5', to: '#7c3aed' }, // indigo-600 to violet-600
    accent: { from: '#4338ca', to: '#6d28d9' }, // indigo-700 to violet-700
  },
  {
    id: 'mint',
    name: '薄荷绿',
    nameEn: 'Mint Fresh',
    primary: { from: '#14b8a6', to: '#06b6d4' }, // teal-500 to cyan-500
    secondary: { from: '#0d9488', to: '#0891b2' }, // teal-600 to cyan-600
    accent: { from: '#0f766e', to: '#0e7490' }, // teal-700 to cyan-700
  },
  {
    id: 'cherry',
    name: '樱花粉',
    nameEn: 'Cherry Blossom',
    primary: { from: '#f472b6', to: '#fb7185' }, // pink-400 to rose-400
    secondary: { from: '#ec4899', to: '#f43f5e' }, // pink-500 to rose-500
    accent: { from: '#db2777', to: '#e11d48' }, // pink-600 to rose-600
  },
]

// 用户设置
export interface UserSettings {
  themeId: string
}
