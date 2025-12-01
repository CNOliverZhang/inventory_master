<template>
  <router-view />
  <Toast position="top-right" />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import { setToastInstance } from '@/utils/toast'
import { useUserStore } from '@/stores/user'

const toast = useToast()
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

onMounted(async () => {
  // 初始化全局 Toast 实例
  setToastInstance(toast)
  
  // 初始化认证状态（从 localStorage 恢复）
  userStore.initAuth()
  
  // 如果用户已登录，刷新用户信息
  if (userStore.isLoggedIn) {
    try {
      await userStore.fetchCurrentUser()
    } catch (error) {
      console.error('Failed to fetch current user:', error)
      // fetchCurrentUser 内部会处理 401 错误并清除认证信息
      // 如果不是登录页，跳转到登录页
      if (route.path !== '/login') {
        router.push('/login')
      }
    }
  }
})
</script>
