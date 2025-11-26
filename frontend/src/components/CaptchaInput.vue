<template>
  <div class="captcha-input-wrapper">
    <div class="flex gap-2">
      <!-- 验证码输入框 -->
      <div class="flex-1 relative group">
        <i class="pi pi-shield absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors icon-focus"></i>
        <input
          v-model="localCode"
          type="text"
          maxlength="4"
          :placeholder="placeholder"
          :disabled="disabled"
          class="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all input-focus uppercase"
          @input="handleInput"
        />
      </div>
      
      <!-- 验证码图片 -->
      <div 
        class="relative flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
        @click="refreshCaptcha"
        :title="t('auth.refreshCaptcha')"
      >
        <img
          v-if="imageData"
          :src="imageData"
          alt="Captcha"
          class="h-12 w-28 rounded-xl border border-gray-200"
        />
        <div
          v-else
          class="h-12 w-28 rounded-xl border border-gray-200 bg-gray-100 flex items-center justify-center"
        >
          <i class="pi pi-spin pi-spinner text-gray-400"></i>
        </div>
        <!-- 刷新图标 -->
        <div
          class="absolute top-0 right-0 bg-white rounded-full p-1 m-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <i class="pi pi-refresh text-xs text-gray-600"></i>
        </div>
      </div>
    </div>
    
    <!-- 错误提示 -->
    <p v-if="error" class="text-xs text-red-500 mt-1">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, defineProps, defineEmits } from 'vue';
import { useI18n } from 'vue-i18n';
import { getCaptcha } from '@/api/authV2';
import { useToast } from 'primevue/usetoast';

const { t } = useI18n();
const toast = useToast();

// Props
const props = defineProps<{
  modelValue?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}>();

// Emits
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'update:token', value: string): void;
  (e: 'ready'): void;
}>();

// State
const localCode = ref('');
const imageData = ref('');
const token = ref('');

// 处理输入（只允许字母和数字）
const handleInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const value = input.value.replace(/[^a-zA-Z0-9]/g, '');
  localCode.value = value;
  emit('update:modelValue', value);
};

// 刷新验证码
const refreshCaptcha = async () => {
  try {
    const response = await getCaptcha();
    if (response.success) {
      imageData.value = response.data.image;
      token.value = response.data.token;
      emit('update:token', response.data.token);
      emit('ready');
    }
  } catch (error) {
    console.error('Get captcha error:', error);
    toast.add({
      severity: 'error',
      summary: t('common.error'),
      detail: t('auth.getCaptchaFailed'),
      life: 3000,
    });
  }
};

// 监听外部值变化
watch(() => props.modelValue, (newValue) => {
  if (newValue !== undefined && newValue !== localCode.value) {
    localCode.value = newValue;
  }
});

// 挂载时加载验证码
onMounted(() => {
  refreshCaptcha();
});

// 暴露刷新方法给父组件
defineExpose({
  refresh: refreshCaptcha,
});
</script>

<style scoped>
.captcha-input-wrapper .group:hover .group-hover\:opacity-100 {
  opacity: 1;
}
</style>
