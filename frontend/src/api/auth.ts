import request from './axios'
import type { LoginForm, RegisterForm, AuthResponse, User } from '@/types/user'

interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
}

/**
 * 用户注册
 */
export const registerApi = (data: RegisterForm): Promise<AuthResponse> => {
  return request.post('/auth/register', data)
}

/**
 * 用户登录
 */
export const loginApi = (data: LoginForm): Promise<AuthResponse> => {
  return request.post('/auth/login', data)
}

/**
 * 获取当前用户信息
 */
export const getCurrentUserApi = (): Promise<ApiResponse<User>> => {
  return request.get('/auth/me')
}
