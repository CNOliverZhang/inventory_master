import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User, LoginForm, RegisterForm } from '@/types/user'
import { loginApi, registerApi, getCurrentUserApi } from '@/api/auth'
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
      toast.success(res.message || '登录成功')
      return res.data.user
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  // 用户注册
  const register = async (registerForm: RegisterForm) => {
    try {
      const res = await registerApi(registerForm)
      saveAuth(res.data.token, res.data.user)
      toast.success(res.message || '注册成功')
      return res.data.user
    } catch (error) {
      console.error('Register failed:', error)
      throw error
    }
  }

  // 退出登录
  const logout = () => {
    clearAuth()
    toast.success('已退出登录')
  }

  // 获取当前用户信息（用于验证 token 有效性）
  const fetchCurrentUser = async () => {
    try {
      const res = await getCurrentUserApi()
      user.value = res.data
      return res.data
    } catch (error) {
      // Token 无效，清除认证信息
      clearAuth()
      throw error
    }
  }

  return {
    // 状态
    user,
    token,
    isLoggedIn,
    // 方法
    initAuth,
    login,
    register,
    logout,
    fetchCurrentUser,
  }
})
