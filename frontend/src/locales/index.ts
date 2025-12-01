import { createI18n } from 'vue-i18n'
import zhCN from './zh-CN'
import zhHK from './zh-HK'
import enUS from './en-US'

// 支持的语言列表
export const SUPPORT_LOCALES = [
  { value: 'zh-CN', label: '简体中文', flag: '🇨🇳' },
  { value: 'zh-HK', label: '繁體中文', flag: '🇭🇰' },
  { value: 'en-US', label: 'English', flag: '🇺🇸' },
]

// 获取默认语言
const getDefaultLocale = (): string => {
  // 优先从 localStorage 获取
  const savedLocale = localStorage.getItem('locale')
  if (savedLocale && SUPPORT_LOCALES.find(l => l.value === savedLocale)) {
    return savedLocale
  }
  
  // 从浏览器语言推断
  const browserLang = navigator.language
  if (browserLang.startsWith('zh')) {
    // 根据具体的地区代码返回对应的繁简体
    if (browserLang === 'zh-HK' || browserLang === 'zh-Hant-HK') {
      return 'zh-HK'
    }
    return 'zh-CN'
  }
  
  return 'en-US'
}

const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: getDefaultLocale(),
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': zhCN,
    'zh-HK': zhHK,
    'en-US': enUS,
  },
  globalInjection: true, // 全局注入 $t 函数
})

export default i18n
