import { defineStore } from 'pinia'
import { ref } from 'vue'
import i18n from '@/locales'

export const useLocaleStore = defineStore('locale', () => {
  const currentLocale = ref<string>(localStorage.getItem('locale') || 'zh-CN')

  // 切换语言
  const setLocale = (locale: string) => {
    currentLocale.value = locale
    localStorage.setItem('locale', locale)
    
    // 更新 i18n 的 locale
    i18n.global.locale.value = locale as any
    
    // 更新 HTML lang 属性
    document.documentElement.lang = locale
  }

  return {
    locale: currentLocale,
    currentLocale,
    setLocale,
  }
})
