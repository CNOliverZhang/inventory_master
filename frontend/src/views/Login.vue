<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 relative">
    <!-- 语言切换器 -->
    <div class="absolute top-3 right-3 sm:top-5 sm:right-5 z-10">
      <LanguageSwitcher />
    </div>

    <!-- 登录卡片 -->
    <div class="glass-card w-full max-w-md p-6 sm:p-8 space-y-5 sm:space-y-6">
      <!-- 头部 -->
      <div class="text-center space-y-2 sm:space-y-3">
        <div class="flex justify-center">
          <div class="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-md">
            <i class="pi pi-box text-2xl sm:text-3xl text-white"></i>
          </div>
        </div>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-800">
          {{ t('auth.appTitle') }}
        </h1>
        <p class="text-gray-600 text-xs sm:text-sm">
          {{ isLogin ? t('auth.welcomeBack') : t('auth.createAccount') }}
        </p>
      </div>

      <!-- 标签切换 -->
      <div class="flex gap-2 p-1 bg-gray-100 rounded-lg">
        <button
          @click="activeTab = 'login'"
          :class="[
            'flex-1 py-2 sm:py-2.5 text-sm sm:text-base rounded-md font-medium transition-all duration-200',
            activeTab === 'login'
              ? 'bg-white text-cyan-600 shadow-sm'
              : 'text-gray-600 hover:text-cyan-600'
          ]"
        >
          {{ t('auth.login') }}
        </button>
        <button
          @click="activeTab = 'register'"
          :class="[
            'flex-1 py-2 sm:py-2.5 text-sm sm:text-base rounded-md font-medium transition-all duration-200',
            activeTab === 'register'
              ? 'bg-white text-cyan-600 shadow-sm'
              : 'text-gray-600 hover:text-cyan-600'
          ]"
        >
          {{ t('auth.register') }}
        </button>
      </div>

      <!-- 登录表单 -->
      <form v-if="activeTab === 'login'" @submit.prevent="handleLogin" class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">{{ t('auth.email') }}</label>
          <div class="relative">
            <i class="pi pi-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
              v-model="loginForm.email"
              type="email"
              required
              :placeholder="t('auth.enterEmail')"
              class="w-full pl-10 pr-4 py-2 sm:py-2.5 text-sm sm:text-base bg-white/50 border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
            />
          </div>
          <p v-if="loginErrors.email" class="text-xs text-red-500">{{ loginErrors.email }}</p>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">{{ t('auth.password') }}</label>
          <div class="relative">
            <i class="pi pi-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
              v-model="loginForm.password"
              :type="showLoginPassword ? 'text' : 'password'"
              required
              :placeholder="t('auth.enterPassword')"
              class="w-full pl-10 pr-12 py-2 sm:py-2.5 text-sm sm:text-base bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
            />
            <button
              type="button"
              @click="showLoginPassword = !showLoginPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <i :class="showLoginPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
            </button>
          </div>
          <p v-if="loginErrors.password" class="text-xs text-red-500">{{ loginErrors.password }}</p>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="btn-gradient w-full flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <i v-if="loading" class="pi pi-spinner pi-spin"></i>
          {{ t('auth.loginBtn') }}
        </button>
      </form>

      <!-- 注册表单 -->
      <form v-if="activeTab === 'register'" @submit.prevent="handleRegister" class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">{{ t('auth.username') }}</label>
          <div class="relative">
            <i class="pi pi-user absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
              v-model="registerForm.username"
              type="text"
              required
              :placeholder="t('auth.enterUsername')"
              class="w-full pl-10 pr-4 py-2 sm:py-2.5 text-sm sm:text-base bg-white/50 border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
            />
          </div>
          <p v-if="registerErrors.username" class="text-xs text-red-500">{{ registerErrors.username }}</p>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">{{ t('auth.email') }}</label>
          <div class="relative">
            <i class="pi pi-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
              v-model="registerForm.email"
              type="email"
              required
              :placeholder="t('auth.enterEmail')"
              class="w-full pl-10 pr-4 py-2 sm:py-2.5 text-sm sm:text-base bg-white/50 border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
            />
          </div>
          <p v-if="registerErrors.email" class="text-xs text-red-500">{{ registerErrors.email }}</p>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">{{ t('auth.password') }}</label>
          <div class="relative">
            <i class="pi pi-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
              v-model="registerForm.password"
              :type="showRegPassword ? 'text' : 'password'"
              required
              :placeholder="t('auth.enterPassword')"
              class="w-full pl-10 pr-12 py-2 sm:py-2.5 text-sm sm:text-base bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
            />
            <button
              type="button"
              @click="showRegPassword = !showRegPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <i :class="showRegPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
            </button>
          </div>
          <p v-if="registerErrors.password" class="text-xs text-red-500">{{ registerErrors.password }}</p>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">{{ t('auth.confirmPassword') }}</label>
          <div class="relative">
            <i class="pi pi-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
              v-model="registerForm.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              required
              :placeholder="t('auth.reEnterPassword')"
              class="w-full pl-10 pr-12 py-2 sm:py-2.5 text-sm sm:text-base bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <i :class="showConfirmPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
            </button>
          </div>
          <p v-if="registerErrors.confirmPassword" class="text-xs text-red-500">{{ registerErrors.confirmPassword }}</p>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="btn-gradient w-full flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <i v-if="loading" class="pi pi-spinner pi-spin"></i>
          {{ t('auth.registerBtn') }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'
import type { LoginForm, RegisterForm } from '@/types/user'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

const router = useRouter()
const userStore = useUserStore()
const { t } = useI18n()

const activeTab = ref('login')
const loading = ref(false)
const showLoginPassword = ref(false)
const showRegPassword = ref(false)
const showConfirmPassword = ref(false)

const isLogin = computed(() => activeTab.value === 'login')

// 登录表单
const loginForm = reactive<LoginForm>({
  email: '',
  password: '',
})

const loginErrors = reactive({
  email: '',
  password: '',
})

// 注册表单
const registerForm = reactive<RegisterForm>({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const registerErrors = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

// 验证登录表单
const validateLoginForm = () => {
  loginErrors.email = ''
  loginErrors.password = ''
  
  let isValid = true
  
  if (!loginForm.email) {
    loginErrors.email = t('auth.emailRequired')
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginForm.email)) {
    loginErrors.email = t('auth.emailInvalid')
    isValid = false
  }
  
  if (!loginForm.password) {
    loginErrors.password = t('auth.passwordRequired')
    isValid = false
  }
  
  return isValid
}

// 验证注册表单
const validateRegisterForm = () => {
  registerErrors.username = ''
  registerErrors.email = ''
  registerErrors.password = ''
  registerErrors.confirmPassword = ''
  
  let isValid = true
  
  if (!registerForm.username) {
    registerErrors.username = t('auth.usernameRequired')
    isValid = false
  } else if (registerForm.username.length < 3 || registerForm.username.length > 50) {
    registerErrors.username = t('auth.usernameLength')
    isValid = false
  }
  
  if (!registerForm.email) {
    registerErrors.email = t('auth.emailRequired')
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.email)) {
    registerErrors.email = t('auth.emailInvalid')
    isValid = false
  }
  
  if (!registerForm.password) {
    registerErrors.password = t('auth.passwordRequired')
    isValid = false
  } else if (registerForm.password.length < 6) {
    registerErrors.password = t('auth.passwordLength')
    isValid = false
  }
  
  if (!registerForm.confirmPassword) {
    registerErrors.confirmPassword = t('auth.confirmPasswordRequired')
    isValid = false
  } else if (registerForm.confirmPassword !== registerForm.password) {
    registerErrors.confirmPassword = t('auth.passwordMismatch')
    isValid = false
  }
  
  return isValid
}

// 处理登录
const handleLogin = async () => {
  if (!validateLoginForm()) return

  loading.value = true
  try {
    await userStore.login(loginForm)
    router.push('/')
  } catch (error) {
    console.error('Login error:', error)
  } finally {
    loading.value = false
  }
}

// 处理注册
const handleRegister = async () => {
  if (!validateRegisterForm()) return

  loading.value = true
  try {
    await userStore.register(registerForm)
    router.push('/')
  } catch (error) {
    console.error('Register error:', error)
  } finally {
    loading.value = false
  }
}
</script>


