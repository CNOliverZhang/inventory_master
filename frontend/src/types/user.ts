// 用户接口
export interface User {
  id: number
  username: string
  email: string
  createdAt: string
  updatedAt: string
}

// 登录表单
export interface LoginForm {
  email: string
  password: string
}

// 注册表单
export interface RegisterForm {
  username: string
  email: string
  password: string
  confirmPassword?: string
}

// 登录/注册响应
export interface AuthResponse {
  success: boolean
  message?: string
  data: {
    user: User
    token: string
  }
}
