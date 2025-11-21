import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'

// Element Plus 语言包映射
const elementLocaleMap: Record<string, any> = {
  'zh-CN': zhCn,
  'en-US': en,
}

export const useLocaleStore = defineStore('locale', () => {
  const currentLocale = ref<string>(localStorage.getItem('locale') || 'zh-CN')
  const elementLocale = ref(elementLocaleMap[currentLocale.value] || zhCn)

  // 切换语言
  const setLocale = (locale: string) => {
    currentLocale.value = locale
    elementLocale.value = elementLocaleMap[locale] || zhCn
    localStorage.setItem('locale', locale)
    
    // 更新 HTML lang 属性
    document.documentElement.lang = locale
  }

  return {
    currentLocale,
    elementLocale,
    setLocale,
  }
})
