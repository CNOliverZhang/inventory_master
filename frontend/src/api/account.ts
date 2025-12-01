import request from "./axios";

const API_V2_PREFIX = '/v2/auth';

/**
 * 获取用户所有绑定信息
 */
export const getBindings = async () => {
  const response = await request.get(`${API_V2_PREFIX}/bindings`);
  return response;
};

/**
 * 修改用户名
 */
export const updateUsername = async (data: { username: string }) => {
  const response = await request.post(`${API_V2_PREFIX}/update-username`, data);
  return response;
};

/**
 * 修改昵称
 */
export const updateNickname = async (data: { nickname: string }) => {
  const response = await request.post(`${API_V2_PREFIX}/update-nickname`, data);
  return response;
};

/**
 * 发送绑定邮箱验证码
 */
export const sendBindEmailCode = async (data: { email: string }) => {
  const response = await request.post(`${API_V2_PREFIX}/send-bind-email-code`, data);
  return response;
};

/**
 * 发送绑定手机验证码
 */
export const sendBindPhoneCode = async (data: { phone: string }) => {
  const response = await request.post(`${API_V2_PREFIX}/send-bind-phone-code`, data);
  return response;
};

/**
 * 绑定/换绑邮箱
 */
export const bindEmail = async (data: { email: string; code: string }) => {
  const response = await request.post(`${API_V2_PREFIX}/bind-email`, data);
  return response;
};

/**
 * 绑定/换绑手机号
 */
export const bindPhone = async (data: { phone: string; code: string }) => {
  const response = await request.post(`${API_V2_PREFIX}/bind-phone`, data);
  return response;
};

/**
 * 解绑OAuth（微信/QQ）
 */
export const unbindOAuth = async (data: { provider: 'wechat' | 'qq' }) => {
  const response = await request.post(`${API_V2_PREFIX}/unbind-oauth`, data);
  return response;
};

/**
 * OAuth换绑（需要重新授权）
 */
export const rebindOAuth = async (data: { unionId: string }) => {
  const response = await request.post(`${API_V2_PREFIX}/oauth/rebind`, data);
  return response;
};

/**
 * 修改/设置密码
 */
export const changePassword = async (data: { password: string }) => {
  const response = await request.post(`${API_V2_PREFIX}/change-password`, data);
  return response;
};

/**
 * 上传用户头像
 */
export const uploadAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append('avatar', file);
  
  const response = await request.post(`${API_V2_PREFIX}/upload-avatar`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response;
};

/**
 * 删除用户头像
 */
export const deleteAvatar = async () => {
  const response = await request.delete(`${API_V2_PREFIX}/delete-avatar`);
  return response;
};
