import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { THEME_PRESETS, type ThemeConfig } from '@/types/theme'

export const useThemeStore = defineStore('theme', () => {
  // 当前主题 ID
  const currentThemeId = ref<string>('ocean')
  
  // 当前主题配置
  const currentTheme = ref<ThemeConfig>(THEME_PRESETS[0])

  // 初始化：从 localStorage 恢复主题
  const initTheme = () => {
    const savedThemeId = localStorage.getItem('themeId')
    if (savedThemeId) {
      const theme = THEME_PRESETS.find(t => t.id === savedThemeId)
      if (theme) {
        currentThemeId.value = savedThemeId
        currentTheme.value = theme
        applyTheme(theme)
      }
    } else {
      // 默认主题
      applyTheme(THEME_PRESETS[0])
    }
  }

  // 应用主题到 CSS 变量
  const applyTheme = (theme: ThemeConfig) => {
    const root = document.documentElement
    
    // 设置主色调渐变
    root.style.setProperty('--color-primary-from', theme.primary.from)
    root.style.setProperty('--color-primary-to', theme.primary.to)
    
    // 设置次要色调渐变
    root.style.setProperty('--color-secondary-from', theme.secondary.from)
    root.style.setProperty('--color-secondary-to', theme.secondary.to)
    
    // 设置强调色渐变
    root.style.setProperty('--color-accent-from', theme.accent.from)
    root.style.setProperty('--color-accent-to', theme.accent.to)
    
    // 提取RGB值用于透明度背景
    const toRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result
        ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
        : '0, 0, 0'
    }
    
    root.style.setProperty('--color-primary-rgb', toRgb(theme.primary.to))
  }

  // 设置主题
  const setTheme = (themeId: string) => {
    const theme = THEME_PRESETS.find(t => t.id === themeId)
    if (theme) {
      currentThemeId.value = themeId
      currentTheme.value = theme
      localStorage.setItem('themeId', themeId)
      applyTheme(theme)
    }
  }

  // 监听主题变化
  watch(currentThemeId, (newThemeId) => {
    const theme = THEME_PRESETS.find(t => t.id === newThemeId)
    if (theme) {
      currentTheme.value = theme
    }
  })

  return {
    currentThemeId,
    currentTheme,
    themes: THEME_PRESETS,
    initTheme,
    setTheme,
  }
})
