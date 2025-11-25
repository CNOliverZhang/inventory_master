import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User, LoginForm, RegisterForm } from '@/types/user'
import { loginApi, sendRegisterCodeApi, verifyEmailApi, resendCodeApi, getCurrentUserApi } from '@/api/auth'
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

  // 发送注册验证码
  const sendRegisterCode = async (registerForm: RegisterForm) => {
    try {
      const res = await sendRegisterCodeApi(registerForm)
      toast.success(res.message || '验证码已发送')
      return res.data
    } catch (error) {
      console.error('Send code failed:', error)
      throw error
    }
  }

  // 验证邮箱并完成注册
  const verifyEmail = async (email: string, code: string) => {
    try {
      const res = await verifyEmailApi({ email, code })
      saveAuth(res.data.token, res.data.user)
      toast.success(res.message || '注册成功')
      return res.data.user
    } catch (error) {
      console.error('Verify email failed:', error)
      throw error
    }
  }

  // 重新发送验证码
  const resendCode = async (email: string) => {
    try {
      const res = await resendCodeApi({ email })
      toast.success(res.message || '验证码已重新发送')
      return res.data
    } catch (error) {
      console.error('Resend code failed:', error)
      throw error
    }
  }

  // 用户注册（已废弃，保留用于兼容）
  const register = async (registerForm: RegisterForm) => {
    try {
      // 现在使用两步验证流程
      await sendRegisterCode(registerForm)
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
    sendRegisterCode,
    verifyEmail,
    resendCode,
    logout,
    fetchCurrentUser,
  }
})
