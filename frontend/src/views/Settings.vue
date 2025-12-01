<template>
  <div class="min-h-screen bg-gray-50 pb-8">
    <!-- 顶部导航栏 -->
    <header class="glass-card mx-2 sm:mx-4 mt-2 sm:mt-4 px-3 sm:px-6 py-3 sm:py-4 sticky top-2 sm:top-4 z-50 shadow-sm">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2 sm:gap-3">
          <button
            @click="router.push('/')"
            class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <i class="pi pi-arrow-left text-gray-700"></i>
          </button>
          <h1 class="text-lg sm:text-2xl font-bold text-gray-800">
            {{ t('settings.title') }}
          </h1>
        </div>
        <LanguageSwitcher />
      </div>
    </header>

    <div class="max-w-4xl mx-auto px-2 sm:px-4 mt-4 space-y-4">
      <!-- 主题设置 -->
      <section class="glass-card p-4 sm:p-6">
        <h2 class="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <i class="pi pi-palette"></i>
          {{ t('settings.theme.title') }}
        </h2>
        
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          <button
            v-for="theme in themeStore.themes"
            :key="theme.id"
            @click="handleThemeChange(theme.id)"
            class="relative group"
          >
            <div
              class="aspect-[4/3] rounded-lg p-4 transition-all duration-200"
              :class="themeStore.currentThemeId === theme.id 
                ? 'ring-4 ring-offset-2 scale-105' 
                : 'hover:scale-105'"
              :style="{
                background: `linear-gradient(135deg, ${theme.primary.from}, ${theme.primary.to})`,
                '--tw-ring-color': theme.primary.to
              }"
            >
              <div class="h-full flex flex-col justify-between">
                <!-- 颜色点 -->
                <div class="flex gap-1.5">
                  <div 
                    class="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-white/90"
                  ></div>
                  <div 
                    class="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-white/70"
                  ></div>
                  <div 
                    class="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-white/50"
                  ></div>
                </div>
                
                <!-- 选中标记 -->
                <div 
                  v-if="themeStore.currentThemeId === theme.id"
                  class="flex justify-end"
                >
                  <div class="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center">
                    <i class="pi pi-check text-sm sm:text-base" :style="{ color: theme.primary.to }"></i>
                  </div>
                </div>
              </div>
            </div>
            
            <p class="mt-2 text-xs sm:text-sm font-medium text-gray-700 text-center">
              {{ locale === 'zh-CN' ? theme.name : theme.nameEn }}
            </p>
          </button>
        </div>
      </section>

      <!-- 深色模式设置 -->
      <section class="glass-card p-4 sm:p-6">
        <h2 class="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <i class="pi pi-moon"></i>
          {{ t('settings.darkMode.title') }}
        </h2>
        
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            @click="handleDarkModeChange('light')"
            class="relative p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105"
            :class="themeStore.darkMode === 'light' 
              ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/30 dark:border-cyan-400' 
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'"
          >
            <div class="flex flex-col items-center gap-2">
              <i class="pi pi-sun text-3xl text-amber-500"></i>
              <span class="text-sm font-medium text-gray-700 dark:text-gray-200">
                {{ t('settings.darkMode.light') }}
              </span>
              <i 
                v-if="themeStore.darkMode === 'light'"
                class="pi pi-check text-cyan-500 dark:text-cyan-400 absolute top-2 right-2"
              ></i>
            </div>
          </button>
          
          <button
            @click="handleDarkModeChange('dark')"
            class="relative p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105"
            :class="themeStore.darkMode === 'dark' 
              ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/30 dark:border-cyan-400' 
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'"
          >
            <div class="flex flex-col items-center gap-2">
              <i class="pi pi-moon text-3xl text-indigo-600 dark:text-indigo-400"></i>
              <span class="text-sm font-medium text-gray-700 dark:text-gray-200">
                {{ t('settings.darkMode.dark') }}
              </span>
              <i 
                v-if="themeStore.darkMode === 'dark'"
                class="pi pi-check text-cyan-500 dark:text-cyan-400 absolute top-2 right-2"
              ></i>
            </div>
          </button>
          
          <button
            @click="handleDarkModeChange('system')"
            class="relative p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105"
            :class="themeStore.darkMode === 'system' 
              ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/30 dark:border-cyan-400' 
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'"
          >
            <div class="flex flex-col items-center gap-2">
              <i class="pi pi-desktop text-3xl text-gray-600 dark:text-gray-400"></i>
              <span class="text-sm font-medium text-gray-700 dark:text-gray-200">
                {{ t('settings.darkMode.system') }}
              </span>
              <i 
                v-if="themeStore.darkMode === 'system'"
                class="pi pi-check text-cyan-500 dark:text-cyan-400 absolute top-2 right-2"
              ></i>
            </div>
          </button>
        </div>
      </section>

      <!-- 账户设置 -->
      <section class="glass-card p-4 sm:p-6">
        <h2 class="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <i class="pi pi-user"></i>
          {{ t('settings.account.title') }}
        </h2>
        
        <div class="space-y-4">
          <!-- 头像 -->
          <div class="flex items-center justify-between py-3 border-b border-gray-200">
            <div class="flex items-center gap-4">
              <div class="relative group">
                <!-- 头像显示 -->
                <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  <img 
                    v-if="avatarUrl" 
                    :src="avatarUrl" 
                    :alt="bindings.nickname || 'Avatar'"
                    class="w-full h-full object-cover"
                  />
                  <font-awesome-icon 
                    v-else
                    icon="user" 
                    class="text-3xl sm:text-4xl text-gray-400"
                  />
                </div>
                
                <!-- 悬停提示 -->
                <div class="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer" @click="triggerAvatarUpload">
                  <font-awesome-icon icon="camera" class="text-white text-xl" />
                </div>
              </div>
              
              <div>
                <p class="text-sm text-gray-600">{{ t('settings.account.avatar') }}</p>
                <p class="text-xs text-gray-500 mt-1">{{ t('settings.account.avatarHint') }}</p>
              </div>
            </div>
            
            <div class="flex gap-2">
              <button
                @click="triggerAvatarUpload"
                class="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm gradient-primary text-white rounded-lg hover:shadow-lg transition-all flex-shrink-0"
              >
                {{ avatarUrl ? t('common.edit') : t('settings.account.upload') }}
              </button>
              <button
                v-if="avatarUrl"
                @click="handleDeleteAvatar"
                :disabled="avatarLoading"
                class="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all flex-shrink-0 disabled:opacity-50"
              >
                <i v-if="avatarLoading" class="pi pi-spinner pi-spin"></i>
                <span v-else>{{ t('common.delete') }}</span>
              </button>
            </div>
            
            <!-- 隐藏的文件输入框 -->
            <input
              ref="avatarInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleAvatarChange"
            />
          </div>

          <!-- 昵称 -->
          <div class="flex items-center justify-between py-3 border-b border-gray-200">
            <div class="flex-1 min-w-0 mr-4">
              <p class="text-sm text-gray-600">{{ t('settings.account.nickname') }}</p>
              <p class="text-base font-medium text-gray-800 truncate">{{ bindings.nickname || t('settings.account.notSet') }}</p>
            </div>
            <button
              @click="handleEditNickname"
              class="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm gradient-primary text-white rounded-lg hover:shadow-lg transition-all flex-shrink-0"
            >
              {{ t('common.edit') }}
            </button>
          </div>

          <!-- 用户名 -->
          <div class="flex items-center justify-between py-3 border-b border-gray-200">
            <div class="flex-1 min-w-0 mr-4">
              <p class="text-sm text-gray-600">{{ t('settings.account.username') }}</p>
              <p class="text-base font-medium text-gray-800 truncate">{{ bindings.username || t('settings.account.notSet') }}</p>
            </div>
            <button
              @click="handleEditUsername"
              class="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm gradient-primary text-white rounded-lg hover:shadow-lg transition-all flex-shrink-0"
            >
              {{ bindings.username ? t('common.edit') : t('settings.account.bind') }}
            </button>
          </div>

          <!-- 邮箱 -->
          <div class="flex items-center justify-between py-3 border-b border-gray-200">
            <div class="flex-1 min-w-0 mr-4">
              <p class="text-sm text-gray-600">{{ t('settings.account.email') }}</p>
              <p class="text-base font-medium text-gray-800 truncate">{{ bindings.email || t('settings.account.notBound') }}</p>
            </div>
            <button
              @click="handleEditEmail"
              class="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm gradient-primary text-white rounded-lg hover:shadow-lg transition-all flex-shrink-0"
            >
              {{ bindings.email ? t('settings.account.rebind') : t('settings.account.bind') }}
            </button>
          </div>

          <!-- 手机号 -->
          <div class="flex items-center justify-between py-3 border-b border-gray-200">
            <div class="flex-1 min-w-0 mr-4">
              <p class="text-sm text-gray-600">{{ t('settings.account.phone') }}</p>
              <p class="text-base font-medium text-gray-800 truncate">{{ bindings.phone || t('settings.account.notBound') }}</p>
            </div>
            <button
              @click="handleEditPhone"
              class="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm gradient-primary text-white rounded-lg hover:shadow-lg transition-all flex-shrink-0"
            >
              {{ bindings.phone ? t('settings.account.rebind') : t('settings.account.bind') }}
            </button>
          </div>

          <!-- 微信 -->
          <div class="flex items-center justify-between py-3 border-b border-gray-200">
            <div class="flex-1 min-w-0 mr-4">
              <p class="text-sm text-gray-600 flex items-center gap-2">
                <font-awesome-icon :icon="['fab', 'weixin']" class="text-green-600" />
                {{ t('auth.wechat') }}
              </p>
              <p class="text-base font-medium text-gray-800 truncate">
                {{ bindings.wechat ? t('settings.account.bound') : t('settings.account.notBound') }}
              </p>
            </div>
            <div class="flex gap-2">
              <button
                v-if="bindings.wechat"
                @click="handleUnbindOAuth('wechat')"
                class="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all flex-shrink-0"
              >
                {{ t('settings.account.unbind') }}
              </button>
              <button
                @click="handleRebindOAuth('wechat')"
                class="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm gradient-primary text-white rounded-lg hover:shadow-lg transition-all flex-shrink-0"
              >
                {{ bindings.wechat ? t('settings.account.rebind') : t('settings.account.bind') }}
              </button>
            </div>
          </div>

          <!-- QQ -->
          <div class="flex items-center justify-between py-3 border-b border-gray-200">
            <div class="flex-1 min-w-0 mr-4">
              <p class="text-sm text-gray-600 flex items-center gap-2">
                <font-awesome-icon :icon="['fab', 'qq']" class="text-blue-600" />
                {{ t('auth.qq') }}
              </p>
              <p class="text-base font-medium text-gray-800 truncate">
                {{ bindings.qq ? t('settings.account.bound') : t('settings.account.notBound') }}
              </p>
            </div>
            <div class="flex gap-2">
              <button
                v-if="bindings.qq"
                @click="handleUnbindOAuth('qq')"
                class="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all flex-shrink-0"
              >
                {{ t('settings.account.unbind') }}
              </button>
              <button
                @click="handleRebindOAuth('qq')"
                class="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm gradient-primary text-white rounded-lg hover:shadow-lg transition-all flex-shrink-0"
              >
                {{ bindings.qq ? t('settings.account.rebind') : t('settings.account.bind') }}
              </button>
            </div>
          </div>

          <!-- 密码 -->
          <div class="flex items-center justify-between py-3">
            <div>
              <p class="text-sm text-gray-600">{{ t('settings.account.password') }}</p>
              <p class="text-base font-medium text-gray-800">{{ hasPassword ? '••••••••' : t('settings.account.notSet') }}</p>
            </div>
            <button
              @click="handleChangePassword"
              class="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm gradient-primary text-white rounded-lg hover:shadow-lg transition-all"
            >
              {{ hasPassword ? t('settings.account.changePassword') : t('settings.account.setPassword') }}
            </button>
          </div>
        </div>
      </section>
    </div>

    <!-- 修改/设置密码对话框 -->
    <div
      v-if="showPasswordDialog"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4"
      @click.self="closePasswordDialog"
    >
      <div class="glass-card w-full max-w-md">
        <div class="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-bold text-gray-800">{{ hasPassword ? t('settings.account.changePassword') : t('settings.account.setPassword') }}</h3>
          <button @click="closePasswordDialog" class="text-gray-500 hover:text-gray-700">
            <i class="pi pi-times text-xl"></i>
          </button>
        </div>

        <div class="p-4 sm:p-6 space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">{{ hasPassword ? t('settings.account.newPassword') : t('settings.account.password') }}</label>
            <input
              v-model="passwordForm.password"
              type="password"
              :placeholder="t('auth.enterPassword')"
              class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">{{ t('settings.account.confirmPassword') }}</label>
            <input
              v-model="passwordForm.confirmPassword"
              type="password"
              :placeholder="t('auth.reEnterPassword')"
              class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>

        <div class="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            @click="closePasswordDialog"
            class="px-4 sm:px-6 py-2 sm:py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
          >
            {{ t('common.cancel') }}
          </button>
          <button
            @click="handleUpdatePassword"
            :disabled="passwordLoading"
            class="btn-gradient flex items-center gap-2 px-4 sm:px-6"
          >
            <i v-if="passwordLoading" class="pi pi-spinner pi-spin"></i>
            {{ t('common.save') }}
          </button>
        </div>
      </div>
    </div>

    <!-- 通用绑定对话框 -->
    <BindingDialog
      :visible="bindingDialog.visible"
      :title="bindingDialog.title"
      :input-label="bindingDialog.inputLabel"
      :placeholder="bindingDialog.placeholder"
      :input-type="bindingDialog.inputType"
      :need-code="bindingDialog.needCode"
      :loading="bindingDialog.loading"
      @close="handleCloseBindingDialog"
      @submit="handleBindingSubmit"
      @send-code="handleSendBindingCode"
    />

    <!-- OAuth换绑对话框 -->
    <OAuthRebindDialog
      :visible="oauthRebindDialog.visible"
      :provider="oauthRebindDialog.provider"
      :loading="oauthRebindDialog.loading"
      @close="handleCloseOAuthRebindDialog"
      @start-auth="handleStartOAuthAuth"
    />

    <!-- 解绑确认对话框 -->
    <ConfirmDialog
      :visible="unbindConfirmDialog.visible"
      :title="t('settings.account.unbindConfirmTitle')"
      :message="t('settings.account.unbindConfirmMessage', { 
        provider: unbindConfirmDialog.provider === 'wechat' ? t('auth.wechat') : t('auth.qq') 
      })"
      :confirm-text="t('settings.account.unbind')"
      :cancel-text="t('common.cancel')"
      :dangerous="true"
      :loading="unbindConfirmDialog.loading"
      @confirm="handleConfirmUnbindOAuth"
      @cancel="handleCancelUnbindOAuth"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useThemeStore } from '@/stores/theme'
import { useLocaleStore } from '@/stores/locale'
import {
  getBindings,
  updateUsername,
  updateNickname,
  sendBindEmailCode,
  sendBindPhoneCode,
  bindEmail,
  bindPhone,
  unbindOAuth,
  rebindOAuth,
  changePassword,
  uploadAvatar,
  deleteAvatar,
} from '@/api/account'
import { oauthLogin } from '@/api/auth'
import type { DarkModeOption } from '@/types/theme'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import BindingDialog from '@/components/BindingDialog.vue'
import OAuthRebindDialog from '@/components/OAuthRebindDialog.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import { toast } from '@/utils/toast'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const { t } = useI18n()
const themeStore = useThemeStore()
const localeStore = useLocaleStore()
const userStore = useUserStore()

const locale = localeStore.locale

// 获取头像完整 URL
const avatarUrl = computed(() => {
  return userStore.user?.profile?.avatar
})

// 绑定信息
const bindings = reactive({
  username: null as string | null,
  email: null as string | null,
  phone: null as string | null,
  wechat: null as string | null,
  qq: null as string | null,
  nickname: null as string | null,
})

// 判断用户是否有密码（检查是否绑定了username/email/phone）
const hasPassword = computed(() => {
  return !!(bindings.username || bindings.email || bindings.phone)
})

// 计算总的登录方式数量
const totalLoginMethods = computed(() => {
  let count = 0
  if (bindings.username || bindings.email || bindings.phone) count++ // 密码登录算一种
  if (bindings.wechat) count++
  if (bindings.qq) count++
  return count
})

// 判断是否可以解绑某个OAuth
const canUnbindOAuth = () => {
  // 如果总登录方式只有1种，不能解绑
  return totalLoginMethods.value > 1
}

// 对话框状态
const showPasswordDialog = ref(false)
const passwordLoading = ref(false)
const avatarLoading = ref(false)
const avatarInput = ref<HTMLInputElement>()

// 通用绑定对话框
const bindingDialog = reactive({
  visible: false,
  title: '',
  inputLabel: '',
  placeholder: '',
  inputType: 'text',
  needCode: false,
  loading: false,
  type: '' as 'username' | 'nickname' | 'email' | 'phone' | '',
})

// OAuth换绑对话框
const oauthRebindDialog = reactive({
  visible: false,
  provider: 'wechat' as 'wechat' | 'qq',
  loading: false,
})

// 解绑确认对话框
const unbindConfirmDialog = reactive({
  visible: false,
  provider: 'wechat' as 'wechat' | 'qq',
  loading: false,
})

// 表单数据
const passwordForm = reactive({
  password: '',
  confirmPassword: '',
})

// 加载绑定信息
const loadBindings = async () => {
  try {
    const res = await getBindings()
    Object.assign(bindings, res.data)
  } catch (error: any) {
    console.error('Load bindings error:', error)
    toast.error(error.response?.data?.message || t('common.error'))
  }
}

// 检查OAuth回调
const checkOAuthRebindCallback = async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')
  const state = urlParams.get('state')
  
  if (code && (state === 'wechat_rebind' || state === 'qq_rebind')) {
    try {
      // 调用OAuth登录API获取unionId
      const provider = state === 'wechat_rebind' ? 'wechat' : 'qq'
      const res = await oauthLogin({ code, state: provider })
      
      if (res.data.needBind) {
        // 需要绑定，调用换绑API
        const rebindRes = await rebindOAuth({ unionId: res.data.unionId })
        
        if (provider === 'wechat') {
          bindings.wechat = res.data.unionId
        } else {
          bindings.qq = res.data.unionId
        }
        
        toast.success(t('settings.account.rebindSuccess'))
      } else {
        // 已经绑定到其他账号
        toast.error(t('settings.account.alreadyBound'))
      }
    } catch (error: any) {
      console.error('OAuth rebind callback error:', error)
      toast.error(error.response?.data?.message || t('common.error'))
    } finally {
      // 清除URL参数
      window.history.replaceState({}, '', '/settings')
    }
  }
}

onMounted(() => {
  loadBindings()
  checkOAuthRebindCallback()
})

// 切换主题
const handleThemeChange = (themeId: string) => {
  themeStore.setTheme(themeId)
  toast.success(t('settings.theme.changed'))
}

// 切换深色模式
const handleDarkModeChange = (mode: DarkModeOption) => {
  themeStore.setDarkMode(mode)
  toast.success(t('settings.darkMode.changed'))
}

// 编辑昵称
const handleEditNickname = () => {
  bindingDialog.type = 'nickname'
  bindingDialog.title = t('settings.account.editNickname')
  bindingDialog.inputLabel = t('settings.account.nickname')
  bindingDialog.placeholder = t('settings.account.enterNickname')
  bindingDialog.inputType = 'text'
  bindingDialog.needCode = false
  bindingDialog.visible = true
}

// 编辑用户名
const handleEditUsername = () => {
  bindingDialog.type = 'username'
  bindingDialog.title = bindings.username ? t('settings.account.editUsername') : t('settings.account.bindUsername')
  bindingDialog.inputLabel = t('settings.account.username')
  bindingDialog.placeholder = t('auth.enterUsername')
  bindingDialog.inputType = 'text'
  bindingDialog.needCode = false
  bindingDialog.visible = true
}

// 编辑邮箱
const handleEditEmail = () => {
  bindingDialog.type = 'email'
  bindingDialog.title = bindings.email ? t('settings.account.rebindEmail') : t('settings.account.bindEmail')
  bindingDialog.inputLabel = t('settings.account.email')
  bindingDialog.placeholder = t('auth.enterEmail')
  bindingDialog.inputType = 'email'
  bindingDialog.needCode = true
  bindingDialog.visible = true
}

// 编辑手机号
const handleEditPhone = () => {
  bindingDialog.type = 'phone'
  bindingDialog.title = bindings.phone ? t('settings.account.rebindPhone') : t('settings.account.bindPhone')
  bindingDialog.inputLabel = t('settings.account.phone')
  bindingDialog.placeholder = t('auth.enterPhone')
  bindingDialog.inputType = 'tel'
  bindingDialog.needCode = true
  bindingDialog.visible = true
}

// 处理绑定对话框提交
const handleBindingSubmit = async (data: { input: string; code?: string }) => {
  try {
    bindingDialog.loading = true

    if (bindingDialog.type === 'nickname') {
      await updateNickname({ nickname: data.input })
      bindings.nickname = data.input
      toast.success(t('settings.account.nicknameChanged'))
    } else if (bindingDialog.type === 'username') {
      await updateUsername({ username: data.input })
      bindings.username = data.input
      toast.success(t('settings.account.usernameChanged'))
    } else if (bindingDialog.type === 'email' && data.code) {
      await bindEmail({ email: data.input, code: data.code })
      bindings.email = data.input
      toast.success(bindings.email ? t('settings.account.emailRebound') : t('settings.account.emailBound'))
    } else if (bindingDialog.type === 'phone' && data.code) {
      await bindPhone({ phone: data.input, code: data.code })
      bindings.phone = data.input
      toast.success(bindings.phone ? t('settings.account.phoneRebound') : t('settings.account.phoneBound'))
    }

    bindingDialog.visible = false
  } catch (error: any) {
    toast.error(error.response?.data?.message || t('common.error'))
  } finally {
    bindingDialog.loading = false
  }
}

// 发送绑定验证码
const handleSendBindingCode = async (value: string) => {
  try {
    if (bindingDialog.type === 'email') {
      await sendBindEmailCode({ email: value })
      toast.success(t('auth.codeSentSuccess'))
    } else if (bindingDialog.type === 'phone') {
      await sendBindPhoneCode({ phone: value })
      toast.success(t('auth.codeSentSuccess'))
    }
  } catch (error: any) {
    toast.error(error.response?.data?.message || t('common.error'))
  }
}

// 关闭绑定对话框
const handleCloseBindingDialog = () => {
  bindingDialog.visible = false
}

// OAuth换绑
const handleRebindOAuth = (provider: 'wechat' | 'qq') => {
  oauthRebindDialog.provider = provider
  oauthRebindDialog.visible = true
}

// 开始OAuth授权
const handleStartOAuthAuth = () => {
  const provider = oauthRebindDialog.provider
  const wechatAppId = import.meta.env.VITE_WECHAT_APPID || 'wxbcf6b197b348b750'
  const qqAppId = import.meta.env.VITE_QQ_APPID || '101966175'
  
  const returnUrl = encodeURIComponent(window.location.origin + '/settings?oauth_rebind=' + provider)
  const callbackUrl = encodeURIComponent(`https://potatofield.cn/oauth/callback?return_url=${returnUrl}`)
  
  if (provider === 'wechat') {
    window.location.href = `https://open.weixin.qq.com/connect/qrconnect?appid=${wechatAppId}&redirect_uri=${callbackUrl}&response_type=code&scope=snsapi_login&state=wechat_rebind`
  } else {
    window.location.href = `https://graph.qq.com/oauth2.0/authorize?client_id=${qqAppId}&redirect_uri=${callbackUrl}&response_type=code&state=qq_rebind`
  }
}

// 关闭OAuth换绑对话框
const handleCloseOAuthRebindDialog = () => {
  oauthRebindDialog.visible = false
}

// 解绑OAuth
const handleUnbindOAuth = (provider: 'wechat' | 'qq') => {
  // 检查是否可以解绑
  if (!canUnbindOAuth()) {
    toast.warning(
      provider === 'wechat' 
        ? t('settings.account.cannotUnbindWechat') 
        : t('settings.account.cannotUnbindQQ')
    )
    return
  }

  unbindConfirmDialog.provider = provider
  unbindConfirmDialog.visible = true
}

// 确认解绑OAuth
const handleConfirmUnbindOAuth = async () => {
  try {
    unbindConfirmDialog.loading = true
    await unbindOAuth({ provider: unbindConfirmDialog.provider })
    
    if (unbindConfirmDialog.provider === 'wechat') {
      bindings.wechat = null
    } else {
      bindings.qq = null
    }
    
    toast.success(t('settings.account.unbindSuccess'))
    unbindConfirmDialog.visible = false
  } catch (error: any) {
    toast.error(error.response?.data?.message || t('common.error'))
  } finally {
    unbindConfirmDialog.loading = false
  }
}

// 取消解绑
const handleCancelUnbindOAuth = () => {
  unbindConfirmDialog.visible = false
}

// 处理修改/设置密码
const handleChangePassword = () => {
  showPasswordDialog.value = true
}

// 修改/设置密码
const handleUpdatePassword = async () => {
  if (!passwordForm.password || !passwordForm.confirmPassword) {
    toast.warning(t('settings.account.fillAllFields'))
    return
  }

  if (passwordForm.password !== passwordForm.confirmPassword) {
    toast.warning(t('settings.account.passwordMismatch'))
    return
  }

  if (passwordForm.password.length < 6) {
    toast.warning(t('settings.account.passwordTooShort'))
    return
  }

  try {
    passwordLoading.value = true
    await changePassword({ password: passwordForm.password })
    toast.success(t('settings.account.passwordChanged'))
    closePasswordDialog()
  } catch (error: any) {
    toast.error(error.response?.data?.message || t('common.error'))
  } finally {
    passwordLoading.value = false
  }
}

// 关闭密码对话框
const closePasswordDialog = () => {
  showPasswordDialog.value = false
  passwordForm.password = ''
  passwordForm.confirmPassword = ''
}

// 触发头像上传
const triggerAvatarUpload = () => {
  avatarInput.value?.click()
}

// 处理头像文件选择
const handleAvatarChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    toast.error(t('settings.account.invalidImageType'))
    return
  }
  
  // 验证文件大小（5MB）
  if (file.size > 5 * 1024 * 1024) {
    toast.error(t('settings.account.imageTooLarge'))
    return
  }
  
  try {
    avatarLoading.value = true
    await uploadAvatar(file)
    await userStore.fetchCurrentUser();
    toast.success(t('settings.account.avatarUploadSuccess'))
  } catch (error: any) {
    console.error('Upload avatar error:', error)
    toast.error(error.response?.data?.message || t('common.error'))
  } finally {
    avatarLoading.value = false
    // 清空 input，允许再次选择相同文件
    if (avatarInput.value) {
      avatarInput.value.value = ''
    }
  }
}

// 删除头像
const handleDeleteAvatar = async () => {
  if (!confirm(t('settings.account.confirmDeleteAvatar'))) {
    return
  }
  
  try {
    avatarLoading.value = true
    await deleteAvatar()
    // 刷新 userStore 中的用户信息
    await userStore.fetchCurrentUser()
    toast.success(t('settings.account.avatarDeleteSuccess'))
  } catch (error: any) {
    console.error('Delete avatar error:', error)
    toast.error(error.response?.data?.message || t('common.error'))
  } finally {
    avatarLoading.value = false
  }
}
</script>
