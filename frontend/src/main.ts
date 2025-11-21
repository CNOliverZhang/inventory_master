import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from './router'
import i18n from './locales'
import App from './App.vue'
import './style.css'
import { useUserStore } from './stores/user'
import { useLocaleStore } from './stores/locale'

const app = createApp(App)
const pinia = createPinia()

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(pinia)
app.use(i18n)

// 初始化用户认证状态
const userStore = useUserStore()
userStore.initAuth()

// 初始化语言设置
const localeStore = useLocaleStore()
const savedLocale = localStorage.getItem('locale') || 'zh-CN'
localeStore.setLocale(savedLocale)
i18n.global.locale.value = savedLocale as any

app.use(router)
app.use(ElementPlus, {
  locale: localeStore.elementLocale,
})

app.mount('#app')
