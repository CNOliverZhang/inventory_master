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
          <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center">
            <img src="@/assets/images/logo.png" alt="Logo" class="w-full h-full object-contain" />
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
          <div class="relative group">
            <i class="pi pi-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors icon-focus"></i>
            <input
              v-model="loginForm.email"
              type="email"
              required
              :placeholder="t('auth.enterEmail')"
              class="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all input-focus"
            />
          </div>
          <p v-if="loginErrors.email" class="text-xs text-red-500">{{ loginErrors.email }}</p>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">{{ t('auth.password') }}</label>
          <div class="relative group">
            <i class="pi pi-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors icon-focus"></i>
            <input
              v-model="loginForm.password"
              :type="showLoginPassword ? 'text' : 'password'"
              required
              :placeholder="t('auth.enterPassword')"
              class="w-full pl-10 pr-12 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all input-focus"
            />
            <button
              type="button"
              @click="showLoginPassword = !showLoginPassword"
              class="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i :class="showLoginPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
            </button>
          </div>
          <p v-if="loginErrors.password" class="text-xs text-red-500">{{ loginErrors.password }}</p>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="btn-gradient w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold"
        >
          <i v-if="loading" class="pi pi-spinner pi-spin"></i>
          {{ t('auth.loginBtn') }}
        </button>
      </form>

      <!-- 注册表单 -->
      <form v-if="activeTab === 'register'" @submit.prevent="handleSendCodeOrVerify" class="space-y-4">
        <!-- 用户名 -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">{{ t('auth.username') }}</label>
          <div class="relative group">
            <i class="pi pi-user absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors icon-focus"></i>
            <input
              v-model="registerForm.username"
              type="text"
              required
              :disabled="codeSent"
              :placeholder="t('auth.enterUsername')"
              :class="[
                'w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all input-focus',
                codeSent ? 'opacity-60 cursor-not-allowed' : ''
              ]"
            />
          </div>
          <p v-if="registerErrors.username" class="text-xs text-red-500">{{ registerErrors.username }}</p>
        </div>

        <!-- 邮箱 -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">{{ t('auth.email') }}</label>
          <div class="relative group">
            <i class="pi pi-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors icon-focus"></i>
            <input
              v-model="registerForm.email"
              type="email"
              required
              :disabled="codeSent"
              :placeholder="t('auth.enterEmail')"
              :class="[
                'w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all input-focus',
                codeSent ? 'opacity-60 cursor-not-allowed' : ''
              ]"
            />
          </div>
          <p v-if="registerErrors.email" class="text-xs text-red-500">{{ registerErrors.email }}</p>
        </div>

        <!-- 密码 -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">{{ t('auth.password') }}</label>
          <div class="relative group">
            <i class="pi pi-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors icon-focus"></i>
            <input
              v-model="registerForm.password"
              :type="showRegPassword ? 'text' : 'password'"
              required
              :disabled="codeSent"
              :placeholder="t('auth.enterPassword')"
              :class="[
                'w-full pl-10 pr-12 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all input-focus',
                codeSent ? 'opacity-60 cursor-not-allowed' : ''
              ]"
            />
            <button
              type="button"
              @click="showRegPassword = !showRegPassword"
              :disabled="codeSent"
              class="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i :class="showRegPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
            </button>
          </div>
          <p v-if="registerErrors.password" class="text-xs text-red-500">{{ registerErrors.password }}</p>
        </div>

        <!-- 确认密码 -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">{{ t('auth.confirmPassword') }}</label>
          <div class="relative group">
            <i class="pi pi-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors icon-focus"></i>
            <input
              v-model="registerForm.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              required
              :disabled="codeSent"
              :placeholder="t('auth.reEnterPassword')"
              :class="[
                'w-full pl-10 pr-12 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all input-focus',
                codeSent ? 'opacity-60 cursor-not-allowed' : ''
              ]"
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              :disabled="codeSent"
              class="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i :class="showConfirmPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
            </button>
          </div>
          <p v-if="registerErrors.confirmPassword" class="text-xs text-red-500">{{ registerErrors.confirmPassword }}</p>
        </div>

        <!-- 注册/重发验证码按钮 -->
        <button
          type="submit"
          :disabled="!canSendCode || sendingCode"
          class="btn-gradient w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i v-if="sendingCode" class="pi pi-spinner pi-spin"></i>
          <template v-if="!codeSent">{{ t('auth.registerBtn') }}</template>
          <template v-else-if="countdown > 0">{{ t('auth.resendCodeBtn') }} ({{ countdown }}s)</template>
          <template v-else>{{ t('auth.resendCodeBtn') }}</template>
        </button>

        <!-- 验证码输入框（只在发送验证码后显示） -->
        <div v-if="codeSent" class="space-y-2 pt-2">
          <label class="text-sm font-medium text-gray-700">{{ t('auth.verificationCode') }}</label>
          <div class="relative group">
            <i class="pi pi-shield absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors icon-focus"></i>
            <input
              v-model="verificationCode"
              type="text"
              maxlength="6"
              required
              :placeholder="t('auth.enterVerificationCode')"
              class="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all input-focus tracking-widest text-center text-lg font-semibold"
              @input="handleCodeInput"
            />
          </div>
          <p v-if="registerErrors.verificationCode" class="text-xs text-red-500">{{ registerErrors.verificationCode }}</p>
          <p class="text-xs text-cyan-600">
            <i class="pi pi-info-circle mr-1"></i>{{ t('auth.codeSentHint') }}
          </p>
        </div>

        <!-- 验证邮箱并完成注册按钮（只在发送验证码后显示） -->
        <button
          v-if="codeSent"
          type="button"
          @click="handleCompleteRegister"
          :disabled="loading || !canCompleteRegister"
          class="btn-gradient w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i v-if="loading" class="pi pi-spinner pi-spin"></i>
          {{ t('auth.verifyAndCompleteBtn') }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onUnmounted, watch } from 'vue'
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

// 验证码相关状态
const codeSent = ref(false)
const sendingCode = ref(false)
const verificationCode = ref('')
const countdown = ref(0)
let countdownTimer: number | null = null

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
  verificationCode: '',
})

// 验证邮箱格式
const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// 验证验证码格式（6位数字）
const isValidCode = (code: string): boolean => {
  return /^\d{6}$/.test(code)
}

// 验证注册表单基本字段
const validateBasicRegisterFields = (): boolean => {
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
  } else if (!isValidEmail(registerForm.email)) {
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

// 能否发送验证码（所有字段都填写完整且格式正确）
const canSendCode = computed(() => {
  return (
    registerForm.username.trim() !== '' &&
    registerForm.username.length >= 3 &&
    registerForm.username.length <= 50 &&
    isValidEmail(registerForm.email) &&
    registerForm.password.length >= 6 &&
    registerForm.password === registerForm.confirmPassword &&
    countdown.value === 0
  )
})

// 能否完成注册（验证码格式正确）
const canCompleteRegister = computed(() => {
  return isValidCode(verificationCode.value)
})

// 处理验证码输入（只允许数字）
const handleCodeInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  input.value = input.value.replace(/\D/g, '')
  verificationCode.value = input.value
}

// 开始倒计时
const startCountdown = () => {
  countdown.value = 60
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
  countdownTimer = window.setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      if (countdownTimer) {
        clearInterval(countdownTimer)
        countdownTimer = null
      }
    }
  }, 1000)
}

// 发送验证码或重发
const handleSendCodeOrVerify = async () => {
  // 验证基本字段
  if (!validateBasicRegisterFields()) return

  sendingCode.value = true
  
  try {
    if (codeSent.value) {
      // 重新发送
      await userStore.resendCode(registerForm.email)
    } else {
      // 首次发送
      await userStore.sendRegisterCode(registerForm)
      codeSent.value = true
    }
    startCountdown()
  } catch (error: any) {
    console.error('Send code error:', error)
    // 错误已在 store 中通过 toast 显示
  } finally {
    sendingCode.value = false
  }
}

// 验证登录表单
const validateLoginForm = () => {
  loginErrors.email = ''
  loginErrors.password = ''
  
  let isValid = true
  
  if (!loginForm.email) {
    loginErrors.email = t('auth.emailRequired')
    isValid = false
  } else if (!isValidEmail(loginForm.email)) {
    loginErrors.email = t('auth.emailInvalid')
    isValid = false
  }
  
  if (!loginForm.password) {
    loginErrors.password = t('auth.passwordRequired')
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

// 完成注册
const handleCompleteRegister = async () => {
  // 验证验证码
  registerErrors.verificationCode = ''
  
  if (!verificationCode.value) {
    registerErrors.verificationCode = t('auth.verificationCodeRequired')
    return
  }
  
  if (!isValidCode(verificationCode.value)) {
    registerErrors.verificationCode = t('auth.verificationCodeInvalid')
    return
  }

  loading.value = true
  try {
    await userStore.verifyEmail(registerForm.email, verificationCode.value)
    router.push('/')
  } catch (error) {
    console.error('Register error:', error)
  } finally {
    loading.value = false
  }
}

// 切换标签时重置状态
watch(activeTab, () => {
  // 重置表单
  if (activeTab.value === 'login') {
    loginForm.email = ''
    loginForm.password = ''
    loginErrors.email = ''
    loginErrors.password = ''
  } else {
    registerForm.username = ''
    registerForm.email = ''
    registerForm.password = ''
    registerForm.confirmPassword = ''
    verificationCode.value = ''
    codeSent.value = false
    countdown.value = 0
    registerErrors.username = ''
    registerErrors.email = ''
    registerErrors.password = ''
    registerErrors.confirmPassword = ''
    registerErrors.verificationCode = ''
    if (countdownTimer) {
      clearInterval(countdownTimer)
      countdownTimer = null
    }
  }
})

// 组件卸载时清理定时器
onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
})
</script>
