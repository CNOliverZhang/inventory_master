<template>
  <router-view />
  <Toast position="top-right" />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import { setToastInstance } from '@/utils/toast'

const toast = useToast()

onMounted(() => {
  // 初始化全局 Toast 实例
  setToastInstance(toast)
})
</script>
