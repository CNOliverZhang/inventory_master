<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
    <!-- 对话框 -->
    <div class="glass-card w-full max-w-md p-6 space-y-5 relative">
      <!-- 关闭按钮 -->
      <button
        @click="$emit('close')"
        class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <i class="pi pi-times text-xl"></i>
      </button>

      <!-- 标题 -->
      <div class="text-center space-y-3">
        <div v-if="oauthData" class="flex items-center justify-center gap-3">
          <img 
            :src="oauthData.avatar" 
            alt="avatar" 
            class="w-16 h-16 rounded-full border-2 border-cyan-500"
          />
          <div class="text-left">
            <p class="text-gray-800 font-medium">{{ oauthData.nickname }}</p>
            <p class="text-sm text-gray-500">
              {{ oauthData.provider === 'wechat' ? '微信' : 'QQ' }}账号
            </p>
          </div>
        </div>
        <h2 class="text-xl font-bold text-gray-800">
          {{ bindMode ? t('auth.bindExistingAccount') : t('auth.chooseAction') }}
        </h2>
        <p v-if="!bindMode" class="text-sm text-gray-600">
          {{ t('auth.oauthNotBoundHint') }}
        </p>
      </div>

      <!-- 绑定模式 - 输入账号密码 -->
      <form v-if="bindMode" @submit.prevent="handleBind" class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">
            {{ t('auth.emailOrPhone') }}
          </label>
          <div class="relative group">
            <i class="pi pi-user absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors icon-focus"></i>
            <input
              v-model="bindForm.identifier"
              type="text"
              required
              :placeholder="t('auth.enterEmailOrPhone')"
              class="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all input-focus"
            />
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">
            {{ t('auth.password') }}
          </label>
          <div class="relative group">
            <i class="pi pi-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors icon-focus"></i>
            <input
              v-model="bindForm.password"
              :type="showPassword ? 'text' : 'password'"
              required
              :placeholder="t('auth.enterPassword')"
              class="w-full pl-10 pr-12 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all input-focus"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
            </button>
          </div>
        </div>

        <div class="flex gap-3 pt-2">
          <button
            type="button"
            @click="bindMode = false"
            class="flex-1 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
          >
            {{ t('common.cancel') }}
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="flex-1 btn-gradient py-3 text-sm font-semibold"
          >
            <i v-if="loading" class="pi pi-spinner pi-spin mr-2"></i>
            {{ t('auth.bindAndLogin') }}
          </button>
        </div>
      </form>

      <!-- 选择模式 - 绑定或注册 -->
      <div v-else class="space-y-3">
        <button
          @click="bindMode = true"
          class="w-full flex items-center justify-between px-5 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl"
        >
          <div class="flex items-center gap-3">
            <i class="pi pi-link text-xl"></i>
            <div class="text-left">
              <p class="font-semibold">{{ t('auth.bindExistingAccount') }}</p>
              <p class="text-xs opacity-90">{{ t('auth.bindExistingAccountHint') }}</p>
            </div>
          </div>
          <i class="pi pi-chevron-right"></i>
        </button>

        <button
          @click="handleRegister"
          :disabled="loading"
          class="w-full flex items-center justify-between px-5 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
        >
          <div class="flex items-center gap-3">
            <i v-if="loading" class="pi pi-spinner pi-spin text-xl"></i>
            <i v-else class="pi pi-user-plus text-xl"></i>
            <div class="text-left">
              <p class="font-semibold">{{ t('auth.registerNewAccount') }}</p>
              <p class="text-xs opacity-90">{{ t('auth.registerNewAccountHint') }}</p>
            </div>
          </div>
          <i v-if="!loading" class="pi pi-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface OAuthData {
  unionId: string
  nickname: string
  avatar: string
  provider: string
}

interface Props {
  visible: boolean
  oauthData: OAuthData | null
  loading: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  bind: [identifier: string, password: string]
  register: []
}>()

const bindMode = ref(false)
const showPassword = ref(false)
const bindForm = reactive({
  identifier: '',
  password: '',
})

const handleBind = () => {
  if (!bindForm.identifier || !bindForm.password) return
  emit('bind', bindForm.identifier, bindForm.password)
}

const handleRegister = () => {
  emit('register')
}
</script>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 1.5rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.btn-gradient {
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
  color: white;
  border-radius: 0.75rem;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-gradient:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(6, 182, 212, 0.3);
}

.btn-gradient:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.input-focus:focus {
  ring-color: #06b6d4;
  border-color: #06b6d4;
}

.icon-focus {
  transition: color 0.2s;
}

input:focus + .icon-focus {
  color: #06b6d4;
}
</style>
