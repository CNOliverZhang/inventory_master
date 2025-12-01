// 用户资料
export interface UserProfile {
  userId: number
  nickname: string | null
  avatar: string | null
  intro: string | null
  createdAt?: string
  updatedAt?: string
}

export enum AuthType {
  USERNAME = 1,
  PHONE = 2,
  EMAIL = 3,
  WECHAT = 4,
  QQ = 5,
}

// 用户接口
export interface User {
  id: number
  isAdmin: boolean
  createdAt: string
  lastLoginAt?: string
  profile?: UserProfile
	credentials?: {
		authType: AuthType
		identifier: string
	}[]
}

// 登录表单
export interface LoginForm {
  identifier: string
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
