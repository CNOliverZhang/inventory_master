import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import router from './router'
import i18n from './locales'
import App from './App.vue'
import './style.css'
import { useUserStore } from './stores/user'
import { useLocaleStore } from './stores/locale'
import { useThemeStore } from './stores/theme'

// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faWeixin, faQq } from '@fortawesome/free-brands-svg-icons'

// 将图标添加到库中
library.add(
  faWeixin, faQq
)

// PrimeVue样式
import 'primeicons/primeicons.css'

const app = createApp(App)
const pinia = createPinia()

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

// 初始化主题
const themeStore = useThemeStore()
themeStore.initTheme()

app.use(router)

// 使用 PrimeVue
app.use(PrimeVue, {
  ripple: true,
})

// 使用 Toast 服务
app.use(ToastService)

// 全局注册 Font Awesome 组件
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
