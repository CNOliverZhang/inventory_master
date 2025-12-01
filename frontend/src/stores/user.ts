import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User, LoginForm } from '@/types/user'
import { loginApi, getCurrentUser } from '@/api/auth'
import { toast } from '@/utils/toast'

export const useUserStore = defineStore('user', () => {
  // 状态
  const user = ref<User | null>(null)
  const token = ref<string>('')
  const isLoggedIn = ref(false)

  // 初始化：从 localStorage 恢复状态
  const initAuth = () => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    
    if (savedToken && savedUser) {
      token.value = savedToken
      user.value = JSON.parse(savedUser)
      isLoggedIn.value = true
    }
  }

  // 保存认证信息到 localStorage
  const saveAuth = (newToken: string, newUser: User) => {
    token.value = newToken
    user.value = newUser
    isLoggedIn.value = true
    
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
  }

  // 清除认证信息
  const clearAuth = () => {
    token.value = ''
    user.value = null
    isLoggedIn.value = false
    
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  // 用户登录
  const login = async (loginForm: LoginForm) => {
    try {
      const res = await loginApi(loginForm)
      saveAuth(res.data.token, res.data.user)
      toast.success(res.data.message || '登录成功')
      return res.data.user
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  // 退出登录
  const logout = () => {
    clearAuth()
    toast.success('已退出登录')
  }

  // 获取当前用户信息（用于验证 token 有效性和刷新用户数据）
  const fetchCurrentUser = async () => {
    try {
      const res = await getCurrentUser()
      user.value = res.data
			console.log('fetchCurrentUser:', res.data)
      // 同步更新 localStorage
      localStorage.setItem('user', JSON.stringify(res.data))
      return res.data
    } catch (error) {
      // Token 无效，清除认证信息
      clearAuth()
      throw error
    }
  }

  // 更新用户信息（用于上传头像等操作后同步）
  const updateUser = (updatedUser: User) => {
    user.value = updatedUser
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  return {
    // 状态
    user,
    token,
    isLoggedIn,
    // 方法
    initAuth,
    login,
    logout,
    fetchCurrentUser,
    updateUser,
  }
})
