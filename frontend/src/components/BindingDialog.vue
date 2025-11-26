<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4"
    @click.self="handleClose"
  >
    <div class="glass-card w-full max-w-md">
      <!-- 头部 -->
      <div class="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 class="text-lg font-bold text-gray-800">{{ title }}</h3>
        <button @click="handleClose" class="text-gray-500 hover:text-gray-700">
          <i class="pi pi-times text-xl"></i>
        </button>
      </div>

      <!-- 内容 -->
      <div class="p-4 sm:p-6 space-y-4">
        <!-- 输入框 -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">{{ inputLabel }}</label>
          <input
            v-model="inputValue"
            :type="inputType"
            :placeholder="placeholder"
            class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <!-- 验证码输入 -->
        <div v-if="needCode" class="space-y-2">
          <label class="text-sm font-medium text-gray-700">{{ t('auth.verificationCode') }}</label>
          <div class="flex gap-2">
            <input
              v-model="codeValue"
              type="text"
              maxlength="6"
              :placeholder="t('auth.enterVerificationCode')"
              class="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <button
              @click="handleSendCode"
              :disabled="countdown > 0 || !inputValue"
              class="px-4 py-2.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
              :class="countdown > 0 || !inputValue 
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                : 'gradient-primary text-white hover:shadow-lg'"
            >
              {{ countdown > 0 ? `${countdown}s` : t('auth.sendCode') }}
            </button>
          </div>
        </div>
      </div>

      <!-- 底部按钮 -->
      <div class="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 flex justify-end gap-3">
        <button
          @click="handleClose"
          class="px-4 sm:px-6 py-2 sm:py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
        >
          {{ t('common.cancel') }}
        </button>
        <button
          @click="handleSubmit"
          :disabled="loading || (needCode && !codeValue)"
          class="btn-gradient flex items-center gap-2 px-4 sm:px-6"
        >
          <i v-if="loading" class="pi pi-spinner pi-spin"></i>
          {{ t('common.save') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface Props {
  visible: boolean
  title: string
  inputLabel: string
  placeholder: string
  inputType?: string
  needCode?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  inputType: 'text',
  needCode: false,
  loading: false,
})

const emit = defineEmits<{
  close: []
  submit: [value: { input: string; code?: string }]
  sendCode: [value: string]
}>()

const inputValue = ref('')
const codeValue = ref('')
const countdown = ref(0)
let countdownTimer: number | null = null

watch(() => props.visible, (newVal) => {
  if (!newVal) {
    inputValue.value = ''
    codeValue.value = ''
    countdown.value = 0
    if (countdownTimer) {
      clearInterval(countdownTimer)
      countdownTimer = null
    }
  }
})

const handleClose = () => {
  emit('close')
}

const handleSubmit = () => {
  const data: { input: string; code?: string } = { input: inputValue.value }
  if (props.needCode) {
    data.code = codeValue.value
  }
  emit('submit', data)
}

const handleSendCode = () => {
  if (!inputValue.value || countdown.value > 0) return
  
  emit('sendCode', inputValue.value)
  
  // 开始倒计时
  countdown.value = 60
  countdownTimer = window.setInterval(() => {
    countdown.value--
    if (countdown.value <= 0 && countdownTimer) {
      clearInterval(countdownTimer)
      countdownTimer = null
    }
  }, 1000)
}
</script>
