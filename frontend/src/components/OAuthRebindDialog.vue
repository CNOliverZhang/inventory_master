<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4"
    @click.self="handleClose"
  >
    <div class="glass-card w-full max-w-md">
      <!-- 头部 -->
      <div class="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 class="text-lg font-bold text-gray-800">
          {{ t('settings.account.rebindOAuth', { provider: providerName }) }}
        </h3>
        <button @click="handleClose" class="text-gray-500 hover:text-gray-700">
          <i class="pi pi-times text-xl"></i>
        </button>
      </div>

      <!-- 内容 -->
      <div class="p-4 sm:p-6 space-y-4">
        <div class="text-center space-y-4">
          <div class="flex justify-center">
            <div class="w-16 h-16 rounded-full flex items-center justify-center"
              :class="provider === 'wechat' ? 'bg-green-100' : 'bg-blue-100'">
              <i class="text-3xl" :class="provider === 'wechat' ? 'pi pi-comments text-green-600' : 'pi pi-comment text-blue-600'"></i>
            </div>
          </div>
          <div>
            <p class="text-gray-700 mb-2">{{ t('settings.account.rebindOAuthHint', { provider: providerName }) }}</p>
            <p class="text-sm text-gray-500">{{ t('settings.account.rebindOAuthNote') }}</p>
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
          @click="handleStartAuth"
          :disabled="loading"
          class="btn-gradient flex items-center gap-2 px-4 sm:px-6"
        >
          <i v-if="loading" class="pi pi-spinner pi-spin"></i>
          {{ t('settings.account.startAuth') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface Props {
  visible: boolean
  provider: 'wechat' | 'qq'
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<{
  close: []
  startAuth: []
}>()

const providerName = computed(() => props.provider === 'wechat' ? t('auth.wechat') : t('auth.qq'))

const handleClose = () => {
  emit('close')
}

const handleStartAuth = () => {
  emit('startAuth')
}
</script>
