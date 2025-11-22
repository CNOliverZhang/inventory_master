<template>
  <div class="relative">
    <button
      @click="showDropdown = !showDropdown"
      class="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg hover:bg-white/30 transition-all flex items-center gap-2"
    >
      <i class="pi pi-globe"></i>
      <span class="font-medium hidden sm:inline">{{ currentLanguage }}</span>
      <i :class="showDropdown ? 'pi pi-chevron-up' : 'pi pi-chevron-down'" class="text-xs hidden sm:block"></i>
    </button>
    
    <div
      v-if="showDropdown"
      class="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50"
    >
      <button
        v-for="lang in languages"
        :key="lang.value"
        @click="changeLanguage(lang.value)"
        :class="[
          'w-full px-4 py-2 text-sm text-left transition-colors',
          currentLocale === lang.value ? 'lang-active font-medium' : 'text-gray-700 hover:bg-gray-50'
        ]"
      >
        {{ lang.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useLocaleStore } from '@/stores/locale'

const localeStore = useLocaleStore()
const showDropdown = ref(false)

const languages = [
  { value: 'zh-CN', label: '中文' },
  { value: 'en-US', label: 'English' },
]

const currentLocale = computed(() => localeStore.locale)
const currentLanguage = computed(() => {
  const lang = languages.find(l => l.value === currentLocale.value)
  return lang?.label || '中文'
})

const changeLanguage = (locale: string) => {
  localeStore.setLocale(locale)
  showDropdown.value = false
}

// 点击外部关闭下拉菜单
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    showDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.lang-active {
  background-color: rgba(var(--color-primary-rgb), 0.1);
  color: var(--color-primary-to);
}

.lang-active:hover {
  background-color: rgba(var(--color-primary-rgb), 0.15);
}
</style>
