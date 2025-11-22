// 更新密码表单
export interface UpdatePasswordForm {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

// 更新邮箱表单
export interface UpdateEmailForm {
  email: string
  password: string
}

// 更新用户信息表单
export interface UpdateProfileForm {
  username?: string
  email?: string
}
