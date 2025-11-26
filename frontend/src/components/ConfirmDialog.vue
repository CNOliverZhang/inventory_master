<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4"
    @click.self="handleCancel"
  >
    <div class="glass-card w-full max-w-md">
      <div class="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 class="text-lg font-bold text-gray-800">{{ title }}</h3>
        <button @click="handleCancel" class="text-gray-500 hover:text-gray-700">
          <i class="pi pi-times text-xl"></i>
        </button>
      </div>

      <div class="p-4 sm:p-6">
        <p class="text-gray-700 text-base">{{ message }}</p>
      </div>

      <div class="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 flex justify-end gap-3">
        <button
          @click="handleCancel"
          class="px-4 sm:px-6 py-2 sm:py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
        >
          {{ cancelText }}
        </button>
        <button
          @click="handleConfirm"
          :disabled="loading"
          :class="[
            'px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-medium transition-all flex items-center gap-2',
            dangerous 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'gradient-primary text-white hover:shadow-lg'
          ]"
        >
          <i v-if="loading" class="pi pi-spinner pi-spin"></i>
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

interface Props {
  visible: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  dangerous?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  confirmText: '确定',
  cancelText: '取消',
  dangerous: false,
  loading: false,
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
}
</script>
