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
                ringColor: theme.primary.to
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

      <!-- 账户设置 -->
      <section class="glass-card p-4 sm:p-6">
        <h2 class="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <i class="pi pi-user"></i>
          {{ t('settings.account.title') }}
        </h2>
        
        <div class="space-y-4">
          <!-- 用户名 -->
          <div class="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <p class="text-sm text-gray-600">{{ t('settings.account.username') }}</p>
              <p class="text-base font-medium text-gray-800">{{ userStore.user?.username }}</p>
            </div>
          </div>

          <!-- 邮箱 -->
          <div class="flex items-center justify-between py-3 border-b border-gray-200">
            <div class="flex-1 min-w-0 mr-4">
              <p class="text-sm text-gray-600">{{ t('settings.account.email') }}</p>
              <p class="text-base font-medium text-gray-800 truncate">{{ userStore.user?.email }}</p>
            </div>
            <button
              @click="showEmailDialog = true"
              class="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm gradient-primary text-white rounded-lg hover:shadow-lg transition-all flex-shrink-0"
            >
              {{ t('settings.account.changeEmail') }}
            </button>
          </div>

          <!-- 密码 -->
          <div class="flex items-center justify-between py-3">
            <div>
              <p class="text-sm text-gray-600">{{ t('settings.account.password') }}</p>
              <p class="text-base font-medium text-gray-800">••••••••</p>
            </div>
            <button
              @click="showPasswordDialog = true"
              class="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm gradient-primary text-white rounded-lg hover:shadow-lg transition-all"
            >
              {{ t('settings.account.changePassword') }}
            </button>
          </div>
        </div>
      </section>
    </div>

    <!-- 修改密码对话框 -->
    <div
      v-if="showPasswordDialog"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4"
      @click.self="closePasswordDialog"
    >
      <div class="glass-card w-full max-w-md">
        <div class="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-bold text-gray-800">{{ t('settings.account.changePassword') }}</h3>
          <button @click="closePasswordDialog" class="text-gray-500 hover:text-gray-700">
            <i class="pi pi-times text-xl"></i>
          </button>
        </div>

        <div class="p-4 sm:p-6 space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">{{ t('settings.account.oldPassword') }}</label>
            <input
              v-model="passwordForm.oldPassword"
              type="password"
              class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">{{ t('settings.account.newPassword') }}</label>
            <input
              v-model="passwordForm.newPassword"
              type="password"
              class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">{{ t('settings.account.confirmPassword') }}</label>
            <input
              v-model="passwordForm.confirmPassword"
              type="password"
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

    <!-- 修改邮箱对话框 -->
    <div
      v-if="showEmailDialog"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4"
      @click.self="closeEmailDialog"
    >
      <div class="glass-card w-full max-w-md">
        <div class="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-bold text-gray-800">{{ t('settings.account.changeEmail') }}</h3>
          <button @click="closeEmailDialog" class="text-gray-500 hover:text-gray-700">
            <i class="pi pi-times text-xl"></i>
          </button>
        </div>

        <div class="p-4 sm:p-6 space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">{{ t('settings.account.newEmail') }}</label>
            <input
              v-model="emailForm.email"
              type="email"
              class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">{{ t('settings.account.confirmPassword') }}</label>
            <input
              v-model="emailForm.password"
              type="password"
              class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>

        <div class="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            @click="closeEmailDialog"
            class="px-4 sm:px-6 py-2 sm:py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
          >
            {{ t('common.cancel') }}
          </button>
          <button
            @click="handleUpdateEmail"
            :disabled="emailLoading"
            class="btn-gradient flex items-center gap-2 px-4 sm:px-6"
          >
            <i v-if="emailLoading" class="pi pi-spinner pi-spin"></i>
            {{ t('common.save') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useThemeStore } from '@/stores/theme'
import { useUserStore } from '@/stores/user'
import { useLocaleStore } from '@/stores/locale'
import { updatePasswordApi, updateEmailApi } from '@/api/settings'
import type { UpdatePasswordForm, UpdateEmailForm } from '@/types/settings'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const { t } = useI18n()
const themeStore = useThemeStore()
const userStore = useUserStore()
const localeStore = useLocaleStore()

const locale = localeStore.locale

// 对话框状态
const showPasswordDialog = ref(false)
const showEmailDialog = ref(false)
const passwordLoading = ref(false)
const emailLoading = ref(false)

// 表单数据
const passwordForm = reactive<UpdatePasswordForm>({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const emailForm = reactive<UpdateEmailForm>({
  email: '',
  password: '',
})

// 切换主题
const handleThemeChange = (themeId: string) => {
  themeStore.setTheme(themeId)
  ElMessage.success(t('settings.theme.changed'))
}

// 修改密码
const handleUpdatePassword = async () => {
  if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
    ElMessage.warning(t('settings.account.fillAllFields'))
    return
  }

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    ElMessage.warning(t('settings.account.passwordMismatch'))
    return
  }

  if (passwordForm.newPassword.length < 6) {
    ElMessage.warning(t('settings.account.passwordTooShort'))
    return
  }

  try {
    passwordLoading.value = true
    await updatePasswordApi(passwordForm)
    ElMessage.success(t('settings.account.passwordChanged'))
    closePasswordDialog()
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || t('common.error'))
  } finally {
    passwordLoading.value = false
  }
}

// 修改邮箱
const handleUpdateEmail = async () => {
  if (!emailForm.email || !emailForm.password) {
    ElMessage.warning(t('settings.account.fillAllFields'))
    return
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(emailForm.email)) {
    ElMessage.warning(t('settings.account.invalidEmail'))
    return
  }

  try {
    emailLoading.value = true
    const res = await updateEmailApi(emailForm)
    userStore.user = res.data
    localStorage.setItem('user', JSON.stringify(res.data))
    ElMessage.success(t('settings.account.emailChanged'))
    closeEmailDialog()
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || t('common.error'))
  } finally {
    emailLoading.value = false
  }
}

// 关闭密码对话框
const closePasswordDialog = () => {
  showPasswordDialog.value = false
  passwordForm.oldPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
}

// 关闭邮箱对话框
const closeEmailDialog = () => {
  showEmailDialog.value = false
  emailForm.email = ''
  emailForm.password = ''
}
</script>
