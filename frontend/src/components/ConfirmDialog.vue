<template>
  <teleport to="body">
    <transition name="fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] px-4"
        @click.self="handleCancel"
      >
        <div
          class="glass-card max-w-md w-full p-6 space-y-4 animate-scale-in"
          @click.stop
        >
          <!-- 标题 -->
          <div class="flex items-start gap-3">
            <div
              class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
              :class="iconClass"
            >
              <i :class="iconName" class="text-xl"></i>
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-800">{{ title }}</h3>
            </div>
          </div>

          <!-- 内容 -->
          <div class="text-gray-600 text-sm pl-13">
            {{ message }}
          </div>

          <!-- 按钮 -->
          <div class="flex gap-3 pt-2">
            <button
              v-if="cancelText"
              @click="handleCancel"
              class="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-all"
            >
              {{ cancelText }}
            </button>
            <button
              @click="handleConfirm"
              class="px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
              :class="[confirmButtonClass, cancelText ? 'flex-1' : 'w-full']"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: boolean
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'warning' | 'danger' | 'info'
}

const props = withDefaults(defineProps<Props>(), {
  title: '提示',
  confirmText: '确认',
  cancelText: '取消',
  type: 'warning'
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
  cancel: []
}>()

const iconName = computed(() => {
  const icons = {
    warning: 'pi pi-exclamation-triangle',
    danger: 'pi pi-times-circle',
    info: 'pi pi-info-circle'
  }
  return icons[props.type]
})

const iconClass = computed(() => {
  const classes = {
    warning: 'bg-orange-100 text-orange-600',
    danger: 'bg-red-100 text-red-600',
    info: 'bg-blue-100 text-blue-600'
  }
  return classes[props.type]
})

const confirmButtonClass = computed(() => {
  const classes = {
    warning: 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white hover:shadow-lg',
    danger: 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white hover:shadow-lg',
    info: 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white hover:shadow-lg'
  }
  return classes[props.type]
})

const handleConfirm = () => {
  emit('confirm')
  emit('update:modelValue', false)
}

const handleCancel = () => {
  emit('cancel')
  emit('update:modelValue', false)
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes scale-in {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-scale-in {
  animation: scale-in 0.2s ease;
}
</style>
