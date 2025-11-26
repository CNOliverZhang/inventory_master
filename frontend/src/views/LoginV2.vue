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
          @click="switchTab('login')"
          :class="[
            'flex-1 py-2 sm:py-2.5 text-sm sm:text-base rounded-md font-medium transition-all duration-200',
            isLogin
              ? 'bg-white text-cyan-600 shadow-sm'
              : 'text-gray-600 hover:text-cyan-600'
          ]"
        >
          {{ t('auth.login') }}
        </button>
        <button
          @click="switchTab('register')"
          :class="[
            'flex-1 py-2 sm:py-2.5 text-sm sm:text-base rounded-md font-medium transition-all duration-200',
            !isLogin
              ? 'bg-white text-cyan-600 shadow-sm'
              : 'text-gray-600 hover:text-cyan-600'
          ]"
        >
          {{ t('auth.register') }}
        </button>
      </div>

      <!-- 登录表单 -->
      <form v-if="isLogin" @submit.prevent="handleLogin" class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">{{ t('auth.emailOrUsername') }}</label>
          <div class="relative group">
            <i class="pi pi-user absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors icon-focus"></i>
            <input
              v-model="loginForm.identifier"
              type="text"
              required
              :placeholder="t('auth.enterEmailOrUsername')"
              class="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all input-focus"
            />
          </div>
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
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="btn-gradient w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold"
        >
          <i v-if="loading" class="pi pi-spinner pi-spin"></i>
          {{ t('auth.loginBtn') }}
        </button>
        <div class="pt-4">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200"></div>
            </div>
            <div class="relative flex justify-center text-xs">
              <span class="px-3 bg-white text-gray-500">{{ t('auth.orLoginWith') }}</span>
            </div>
          </div>
          <div class="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              @click="handleWechatLogin"
              class="flex items-center justify-center gap-2 px-4 py-2.5 border border-green-500 text-green-600 rounded-lg hover:bg-green-50 transition-all text-sm font-medium"
            >
              <i class="pi pi-wechat text-lg"></i>
              {{ t('auth.wechat') }}
            </button>
            <button
              type="button"
              @click="handleQQLogin"
              class="flex items-center justify-center gap-2 px-4 py-2.5 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-all text-sm font-medium"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879-.11-.937-.209-2.373.044-3.396.228-.919 1.476-6.257 1.476-6.257s-.377-.753-.377-1.867c0-1.75 1.014-3.058 2.278-3.058 1.074 0 1.593.807 1.593 1.774 0 1.08-.688 2.696-.104 4.196.307 1.297 1.315 2.35 2.61 2.35 3.13 0 5.538-3.301 5.538-8.062 0-4.213-3.027-7.156-7.351-7.156-5.009 0-7.95 3.757-7.95 7.645 0 1.514.583 3.137 1.311 4.018.144.173.164.325.122.502-.134.563-.435 1.771-.494 2.018-.077.324-.252.393-.582.237-2.185-.917-3.549-3.797-3.549-6.104 0-4.97 3.608-9.533 10.413-9.533 5.464 0 9.711 3.894 9.711 9.095 0 5.428-3.424 9.794-8.174 9.794-1.596 0-3.096-.83-3.608-1.81 0 0-.79 3.007-.983 3.743-.355 1.372-1.317 3.09-1.96 4.137C9.405 21.844 10.69 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
              </svg>
              {{ t('auth.qq') }}
            </button>
          </div>
        </div>
      </form>

      <!-- 注册表单 -->
      <form v-if="!isLogin" @submit.prevent="handleRegisterStep" class="space-y-4">
        <!-- 注册方式选择 -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">{{ t('auth.registerMethod') }}</label>
          <div class="relative">
            <select
              v-model="registerType"
              :disabled="codeSent"
              :class="[
                'w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all appearance-none cursor-pointer',
                codeSent ? 'opacity-60 cursor-not-allowed' : ''
              ]"
            >
              <option value="email">{{ t('auth.emailRegister') }}</option>
              <option value="phone">{{ t('auth.phoneRegister') }}</option>
            </select>
            <i class="pi pi-chevron-down absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs"></i>
          </div>
        </div>

        <!-- 邮箱 -->
        <div v-if="registerType === 'email'" class="space-y-2">
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
        </div>

        <!-- 手机号 -->
        <div v-if="registerType === 'phone'" class="space-y-2">
          <label class="text-sm font-medium text-gray-700">{{ t('auth.phone') }}</label>
          <div class="relative group">
            <i class="pi pi-mobile absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors icon-focus"></i>
            <input
              v-model="registerForm.phone"
              type="tel"
              maxlength="11"
              required
              :disabled="codeSent"
              :placeholder="t('auth.enterPhone')"
              :class="[
                'w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all input-focus',
                codeSent ? 'opacity-60 cursor-not-allowed' : ''
              ]"
            />
          </div>
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
        </div>

        <!-- 图形验证码（第一步） -->
        <div v-if="!codeSent" class="space-y-2">
          <label class="text-sm font-medium text-gray-700">{{ t('auth.graphicCaptcha') }}</label>
          <div class="flex gap-2 items-center">
            <div class="relative group flex-1">
              <i class="pi pi-shield absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors icon-focus"></i>
              <input
                v-model="captchaCode"
                type="text"
                maxlength="4"
                required
                :placeholder="t('auth.enterCaptcha')"
                class="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all input-focus uppercase"
              />
            </div>
            <img
              v-if="captchaImage"
              :src="captchaImage"
              alt="验证码"
              @click="refreshCaptcha"
              class="h-10 w-28 rounded-lg cursor-pointer border border-gray-200 hover:border-cyan-400 transition-colors flex-shrink-0"
              title="点击刷新"
            />
          </div>
        </div>

        <!-- 邮箱验证码（第二步） -->
        <div v-if="codeSent" class="space-y-2 pt-2">
          <label class="text-sm font-medium text-gray-700">{{ t('auth.verificationCode') }}</label>
          <div class="relative group">
            <i class="pi pi-shield absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors icon-focus"></i>
            <input
              v-model="emailCode"
              type="text"
              maxlength="6"
              required
              :placeholder="t('auth.enterVerificationCode')"
              class="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all input-focus tracking-widest text-center text-lg font-semibold"
              @input="handleCodeInput"
            />
          </div>
          <p class="text-xs text-cyan-600">
            <i class="pi pi-info-circle mr-1"></i>{{ t('auth.codeSentHint') }}
          </p>
        </div>

        <!-- 发送验证码按钮（第一步） -->
        <button
          v-if="!codeSent"
          type="submit"
          :disabled="!canSendCode || sendingCode"
          class="btn-gradient w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i v-if="sendingCode" class="pi pi-spinner pi-spin"></i>
          {{ t('auth.sendCode') }}
        </button>

        <!-- 完成注册按钮（第二步） -->
        <button
          v-if="codeSent"
          type="submit"
          :disabled="loading || !canCompleteRegister"
          class="btn-gradient w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i v-if="loading" class="pi pi-spinner pi-spin"></i>
          {{ t('auth.completeRegistration') }}
        </button>

        <!-- 重新发送验证码（第二步） -->
        <button
          v-if="codeSent"
          type="button"
          @click="resendEmailCode"
          :disabled="countdown > 0"
          class="w-full py-2.5 text-sm text-cyan-600 hover:text-cyan-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <template v-if="countdown > 0">{{ t('auth.resendAfter') }} ({{ countdown }}s)</template>
          <template v-else>{{ t('auth.resendCode') }}</template>
        </button>

        <!-- 第三方注册（第一步） -->
        <div v-if="!codeSent" class="pt-4">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200"></div>
            </div>
            <div class="relative flex justify-center text-xs">
              <span class="px-3 bg-white text-gray-500">{{ t('auth.orRegisterWith') }}</span>
            </div>
          </div>
          <div class="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              @click="handleWechatLogin"
              class="flex items-center justify-center gap-2 px-4 py-2.5 border border-green-500 text-green-600 rounded-lg hover:bg-green-50 transition-all text-sm font-medium"
            >
              <i class="pi pi-wechat text-lg"></i>
              {{ t('auth.wechat') }}
            </button>
            <button
              type="button"
              @click="handleQQLogin"
              class="flex items-center justify-center gap-2 px-4 py-2.5 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-all text-sm font-medium"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879-.11-.937-.209-2.373.044-3.396.228-.919 1.476-6.257 1.476-6.257s-.377-.753-.377-1.867c0-1.75 1.014-3.058 2.278-3.058 1.074 0 1.593.807 1.593 1.774 0 1.08-.688 2.696-.104 4.196.307 1.297 1.315 2.35 2.61 2.35 3.13 0 5.538-3.301 5.538-8.062 0-4.213-3.027-7.156-7.351-7.156-5.009 0-7.95 3.757-7.95 7.645 0 1.514.583 3.137 1.311 4.018.144.173.164.325.122.502-.134.563-.435 1.771-.494 2.018-.077.324-.252.393-.582.237-2.185-.917-3.549-3.797-3.549-6.104 0-4.97 3.608-9.533 10.413-9.533 5.464 0 9.711 3.894 9.711 9.095 0 5.428-3.424 9.794-8.174 9.794-1.596 0-3.096-.83-3.608-1.81 0 0-.79 3.007-.983 3.743-.355 1.372-1.317 3.09-1.96 4.137C9.405 21.844 10.69 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
              </svg>
              {{ t('auth.qq') }}
            </button>
          </div>
        </div>
      </form>
    </div>

    <!-- OAuth绑定/注册对话框 -->
    <OAuthBindDialog
      :visible="oauthDialogVisible"
      :oauth-data="oauthData"
      :loading="loading"
      @close="oauthDialogVisible = false"
      @bind="handleOAuthBind"
      @register="handleOAuthRegister"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import * as authV2API from '@/api/authV2'
import { toast } from '@/utils/toast'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import OAuthBindDialog from '@/components/OAuthBindDialog.vue'

const router = useRouter()
const { t } = useI18n()

const isLogin = ref(true)
const loading = ref(false)
const sendingCode = ref(false)
const showLoginPassword = ref(false)
const showRegPassword = ref(false)
const codeSent = ref(false)

// OAuth相关状态
const oauthDialogVisible = ref(false)
const oauthData = ref<{
  unionId: string
  nickname: string
  avatar: string
  provider: string
} | null>(null)
const registerType = ref<'email' | 'phone'>('email')

// 图形验证码
const captchaImage = ref('')
const captchaToken = ref('')
const captchaCode = ref('')

// 邮箱验证码倒计时
const countdown = ref(0)
let countdownTimer: number | null = null

// 登录表单
const loginForm = reactive({
  identifier: '',
  password: '',
})

// 注册表单
const registerForm = reactive({
  email: '',
  phone: '',
  password: '',
})
const emailCode = ref('')

// 验证邮箱格式
const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// 验证手机号格式
const isValidPhone = (phone: string): boolean => {
  return /^1[3-9]\d{9}$/.test(phone)
}

// 能否发送验证码
const canSendCode = computed(() => {
  if (registerType.value === 'email') {
    return (
      isValidEmail(registerForm.email) &&
      registerForm.password.length >= 6 &&
      captchaCode.value.length === 4
    )
  } else {
    return (
      isValidPhone(registerForm.phone) &&
      registerForm.password.length >= 6 &&
      captchaCode.value.length === 4
    )
  }
})

// 能否完成注册
const canCompleteRegister = computed(() => {
  return emailCode.value.length === 6
})

// 处理验证码输入（只允许数字）
const handleCodeInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  input.value = input.value.replace(/\D/g, '')
  emailCode.value = input.value
}

// 切换登录/注册
const switchTab = (tab: 'login' | 'register') => {
  isLogin.value = tab === 'login'
  codeSent.value = false
  captchaCode.value = ''
  emailCode.value = ''
  countdown.value = 0
  registerType.value = 'email'
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
  if (tab === 'register') {
    refreshCaptcha()
  }
}

// 刷新图形验证码
const refreshCaptcha = async () => {
  try {
    const res = await authV2API.getCaptcha()
    captchaImage.value = res.data.image
    captchaToken.value = res.data.token
    captchaCode.value = ''
  } catch (error: any) {
    console.error('获取验证码失败:', error)
    toast.error(error.response?.data?.message || t('auth.getCaptchaFailed'))
  }
}

// 登录
const handleLogin = async () => {
  loading.value = true
  try {
    const res = await authV2API.login(loginForm)
    // 保存token和用户信息到localStorage
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    toast.success(t('auth.loginSuccess'))
    // 跳转到首页
    await router.push('/')
  } catch (error: any) {
    toast.error(error.response?.data?.message || t('auth.loginFailed'))
  } finally {
    loading.value = false
  }
}

// 注册步骤处理
const handleRegisterStep = async () => {
  if (!codeSent.value) {
    await sendEmailCode()
  } else {
    await completeRegister()
  }
}

// 发送邮箱验证码
const sendEmailCode = async () => {
  if (!canSendCode.value) return

  sendingCode.value = true
  try {
    if (registerType.value === 'email') {
      await authV2API.sendEmailCode({
        email: registerForm.email,
        captchaToken: captchaToken.value,
        captchaCode: captchaCode.value,
      })
    } else {
      await authV2API.sendPhoneCode({
        phone: registerForm.phone,
        captchaToken: captchaToken.value,
        captchaCode: captchaCode.value,
      })
    }
    codeSent.value = true
    startCountdown()
    toast.success(t('auth.codeSentSuccess'))
  } catch (error: any) {
    toast.error(error.response?.data?.message || t('auth.sendCodeFailed'))
    refreshCaptcha()
  } finally {
    sendingCode.value = false
  }
}

// 重新发送邮箱验证码
const resendEmailCode = async () => {
  if (countdown.value > 0) return
  
  // 回到第一步重新获取图形验证码
  codeSent.value = false
  await refreshCaptcha()
}

// 完成注册
const completeRegister = async () => {
  if (!emailCode.value || emailCode.value.length !== 6) {
    toast.warning(t('auth.verificationCodeInvalid'))
    return
  }

  loading.value = true
  try {
    const registerData: any = {
      password: registerForm.password,
      code: emailCode.value,
    }
    
    if (registerType.value === 'email') {
      registerData.email = registerForm.email
    } else {
      registerData.phone = registerForm.phone
    }
    
    const res = await authV2API.register(registerData)
    // 保存token和用户信息到localStorage
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    toast.success(t('auth.registerSuccess'))
    // 跳转到首页
    await router.push('/')
  } catch (error: any) {
    toast.error(error.response?.data?.message || t('auth.registerFailed'))
  } finally {
    loading.value = false
  }
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

// 微信登录
const handleWechatLogin = () => {
  // 构建回调URL：微信授权后会跳转到站群的OAuth回调页
  // 站群OAuth回调页会再跳转回我们的登录页（带上code和state参数）
  const returnUrl = encodeURIComponent(`${window.location.origin}/login`)
  const callbackUrl = `https://potatofield.cn/oauth/callback?return_url=${returnUrl}`
  const encodedCallback = encodeURIComponent(callbackUrl)
  
  // 微信网站应用AppID（需要配置）
  const wechatAppId = import.meta.env.VITE_WECHAT_APPID || 'wxbcf6b197b348b750'
  
  // 跳转到微信授权页
  window.location.href = `https://open.weixin.qq.com/connect/qrconnect?appid=${wechatAppId}&redirect_uri=${encodedCallback}&response_type=code&scope=snsapi_login&state=wechat#wechat_redirect`
}

// QQ登录
const handleQQLogin = () => {
  // 构建回调URL：QQ授权后会跳转到站群的OAuth回调页
  // 站群OAuth回调页会再跳转回我们的登录页（带上code和state参数）
  const returnUrl = encodeURIComponent(`${window.location.origin}/login`)
  const callbackUrl = `https://potatofield.cn/oauth/callback?return_url=${returnUrl}`
  const encodedCallback = encodeURIComponent(callbackUrl)
  
  // QQ互联AppID（需要配置）
  const qqAppId = import.meta.env.VITE_QQ_APPID || '101966175'
  
  // 检测是否为移动设备
  const isMobile = /ipod|iphone|android|coolpad|mmp|smartphone|midp|wap|xoom|symbian|j2me|blackberry|wince/i.test(navigator.userAgent)
  
  // 跳转到QQ授权页
  window.location.href = `https://graph.qq.com/oauth2.0/authorize?client_id=${qqAppId}&redirect_uri=${encodedCallback}&response_type=code&scope=get_user_info&state=qq${isMobile ? '&display=mobile' : ''}`
}

// 处理OAuth回调（从站群跳回来带着code和state参数）
const handleOAuthCallback = async (code: string, state: string) => {
  loading.value = true
  try {
    const res = await authV2API.oauthLogin({ code, state })
    
    if (res.data.needBind) {
      // 需要绑定账号或注册，显示对话框
      oauthData.value = {
        unionId: res.data.unionId,
        nickname: res.data.nickname,
        avatar: res.data.avatar,
        provider: res.data.provider,
      }
      oauthDialogVisible.value = true
      // 清除URL中的code和state参数
      window.history.replaceState({}, '', '/login')
    } else {
      // 已绑定，直接登录成功
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      toast.success(t('auth.oauthLoginSuccess'))
      await router.push('/')
    }
  } catch (error: any) {
    console.error('OAuth登录失败:', error)
    toast.error(error.response?.data?.message || t('auth.oauthLoginFailed'))
    // 清除URL中的code和state参数
    window.history.replaceState({}, '', '/login')
  } finally {
    loading.value = false
  }
}

// OAuth绑定已有账号
const handleOAuthBind = async (identifier: string, password: string) => {
  if (!oauthData.value) return
  
  loading.value = true
  try {
    const res = await authV2API.oauthBind({
      unionId: oauthData.value.unionId,
      identifier,
      password,
    })
    
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    toast.success(t('auth.oauthBindSuccess'))
    oauthDialogVisible.value = false
    await router.push('/')
  } catch (error: any) {
    toast.error(error.response?.data?.message || t('auth.oauthBindFailed'))
  } finally {
    loading.value = false
  }
}

// OAuth注册新账号
const handleOAuthRegister = async () => {
  if (!oauthData.value) return
  
  loading.value = true
  try {
    const res = await authV2API.oauthRegister({
      unionId: oauthData.value.unionId,
    })
    
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    toast.success(t('auth.registerSuccess'))
    oauthDialogVisible.value = false
    await router.push('/')
  } catch (error: any) {
    toast.error(error.response?.data?.message || t('auth.registerFailed'))
  } finally {
    loading.value = false
  }
}

// 检查URL中是否有OAuth回调参数
const checkOAuthCallback = () => {
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')
  const state = urlParams.get('state')
  
  if (code && state) {
    // 有OAuth回调参数，处理登录
    handleOAuthCallback(code, state)
  }
}

// 初始化
onMounted(() => {
  refreshCaptcha()
  checkOAuthCallback()
})

// 清理
onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
})
</script>
