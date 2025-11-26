import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9702';
const API_V2_PREFIX = '/api/v2/auth';

// 创建axios实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器：添加token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器：处理错误
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 只有在Token过期或无效时才跳转登录，其他错误直接返回
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname
      // 如果已经在登录页面，不需要重定向，只清除token
      if (currentPath !== '/login' && currentPath !== '/login-v2') {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      } else {
        // 在登录页面，只清除token，不跳转
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
    return Promise.reject(error)
  }
)

/**
 * 获取图形验证码
 */
export const getCaptcha = async () => {
  const response = await apiClient.get(`${API_V2_PREFIX}/captcha`);
  return response.data;
};

/**
 * 发送邮箱验证码
 */
export const sendEmailCode = async (data: {
  email: string;
  captchaToken: string;
  captchaCode: string;
}) => {
  const response = await apiClient.post(`${API_V2_PREFIX}/send-email-code`, data);
  return response.data;
};

/**
 * 发送手机验证码
 */
export const sendPhoneCode = async (data: {
  phone: string;
  captchaToken: string;
  captchaCode: string;
}) => {
  const response = await apiClient.post(`${API_V2_PREFIX}/send-phone-code`, data);
  return response.data;
};

/**
 * 用户注册（支持邮箱和手机号）
 */
export const register = async (data: {
  email?: string;
  phone?: string;
  password: string;
  code: string;
}) => {
  const response = await apiClient.post(`${API_V2_PREFIX}/register`, data);
  return response.data;
};

/**
 * 用户登录
 */
export const login = async (data: { identifier: string; password: string }) => {
  const response = await apiClient.post(`${API_V2_PREFIX}/login`, data);
  return response.data;
};

/**
 * 获取当前用户信息
 */
export const getCurrentUser = async () => {
  const response = await apiClient.get(`${API_V2_PREFIX}/me`);
  return response.data;
};

/**
 * OAuth登录（微信/QQ）
 */
export const oauthLogin = async (data: { code: string; state: string }) => {
  const response = await apiClient.post(`${API_V2_PREFIX}/oauth/login`, data);
  return response.data;
};

/**
 * OAuth绑定已有账号
 */
export const oauthBind = async (data: {
  unionId: string;
  identifier: string;
  password: string;
}) => {
  const response = await apiClient.post(`${API_V2_PREFIX}/oauth/bind`, data);
  return response.data;
};

/**
 * OAuth注册新账号
 */
export const oauthRegister = async (data: { unionId: string }) => {
  const response = await apiClient.post(`${API_V2_PREFIX}/oauth/register`, data);
  return response.data;
};
