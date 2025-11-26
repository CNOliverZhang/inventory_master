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
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/login-v2') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

/**
 * 获取用户所有绑定信息
 */
export const getBindings = async () => {
  const response = await apiClient.get(`${API_V2_PREFIX}/bindings`);
  return response.data;
};

/**
 * 修改用户名
 */
export const updateUsername = async (data: { username: string }) => {
  const response = await apiClient.post(`${API_V2_PREFIX}/update-username`, data);
  return response.data;
};

/**
 * 修改昵称
 */
export const updateNickname = async (data: { nickname: string }) => {
  const response = await apiClient.post(`${API_V2_PREFIX}/update-nickname`, data);
  return response.data;
};

/**
 * 发送绑定邮箱验证码
 */
export const sendBindEmailCode = async (data: { email: string }) => {
  const response = await apiClient.post(`${API_V2_PREFIX}/send-bind-email-code`, data);
  return response.data;
};

/**
 * 发送绑定手机验证码
 */
export const sendBindPhoneCode = async (data: { phone: string }) => {
  const response = await apiClient.post(`${API_V2_PREFIX}/send-bind-phone-code`, data);
  return response.data;
};

/**
 * 绑定/换绑邮箱
 */
export const bindEmail = async (data: { email: string; code: string }) => {
  const response = await apiClient.post(`${API_V2_PREFIX}/bind-email`, data);
  return response.data;
};

/**
 * 绑定/换绑手机号
 */
export const bindPhone = async (data: { phone: string; code: string }) => {
  const response = await apiClient.post(`${API_V2_PREFIX}/bind-phone`, data);
  return response.data;
};

/**
 * 解绑OAuth（微信/QQ）
 */
export const unbindOAuth = async (data: { provider: 'wechat' | 'qq' }) => {
  const response = await apiClient.post(`${API_V2_PREFIX}/unbind-oauth`, data);
  return response.data;
};

/**
 * OAuth换绑（需要重新授权）
 */
export const rebindOAuth = async (data: { unionId: string }) => {
  const response = await apiClient.post(`${API_V2_PREFIX}/oauth/rebind`, data);
  return response.data;
};

/**
 * 修改/设置密码
 */
export const changePassword = async (data: { password: string }) => {
  const response = await apiClient.post(`${API_V2_PREFIX}/change-password`, data);
  return response.data;
};
