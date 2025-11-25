import request from './axios'
import type { LoginForm, RegisterForm, AuthResponse, User } from '@/types/user'

interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
}

/**
 * 发送注册验证码
 */
export const sendRegisterCodeApi = (data: RegisterForm): Promise<ApiResponse<{ email: string; expiresIn: number }>> => {
  return request.post('/auth/register', data)
}

/**
 * 验证邮箱并完成注册
 */
export const verifyEmailApi = (data: { email: string; code: string }): Promise<AuthResponse> => {
  return request.post('/auth/verify-email', data)
}

/**
 * 重新发送验证码
 */
export const resendCodeApi = (data: { email: string }): Promise<ApiResponse<{ email: string; expiresIn: number }>> => {
  return request.post('/auth/resend-code', data)
}

/**
 * 用户注册（已废弃，使用 sendRegisterCodeApi + verifyEmailApi）
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
