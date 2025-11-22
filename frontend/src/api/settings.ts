import request from './axios'
import type { UpdatePasswordForm, UpdateEmailForm, UpdateProfileForm } from '@/types/settings'
import type { User } from '@/types/user'

interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
}

/**
 * 更新用户密码
 */
export const updatePasswordApi = (data: UpdatePasswordForm): Promise<ApiResponse> => {
  return request.put('/user/password', data)
}

/**
 * 更新用户邮箱
 */
export const updateEmailApi = (data: UpdateEmailForm): Promise<ApiResponse<User>> => {
  return request.put('/user/email', data)
}

/**
 * 更新用户信息
 */
export const updateProfileApi = (data: UpdateProfileForm): Promise<ApiResponse<User>> => {
  return request.put('/user/profile', data)
}
