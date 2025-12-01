import request from "./axios";

const AUTH_API_PREFIX = '/auth';

/**
 * 获取图形验证码
 */
export const getCaptcha = async () => {
  const response = await request.get(`${AUTH_API_PREFIX}/captcha`);
  return response;
};

/**
 * 发送邮箱验证码
 */
export const sendEmailCode = async (data: {
  email: string;
  captchaToken: string;
  captchaCode: string;
}) => {
  const response = await request.post(`${AUTH_API_PREFIX}/send-email-code`, data);
  return response;
};

/**
 * 发送手机验证码
 */
export const sendPhoneCode = async (data: {
  phone: string;
  captchaToken: string;
  captchaCode: string;
}) => {
  const response = await request.post(`${AUTH_API_PREFIX}/send-phone-code`, data);
  return response;
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
  const response = await request.post(`${AUTH_API_PREFIX}/register`, data);
  return response;
};

/**
 * 用户登录
 */
export const loginApi = async (data: { identifier: string; password: string }) => {
  const response = await request.post(`${AUTH_API_PREFIX}/login`, data);
  return response;
};

/**
 * 获取当前用户信息
 */
export const getCurrentUser = async () => {
  const response = await request.get(`${AUTH_API_PREFIX}/me`);
  return response;
};

/**
 * OAuth登录（微信/QQ）
 */
export const oauthLogin = async (data: { code: string; state: string }) => {
  const response = await request.post(`${AUTH_API_PREFIX}/oauth/login`, data);
  return response;
};

/**
 * OAuth绑定已有账号
 */
export const oauthBind = async (data: {
  unionId: string;
  identifier: string;
  password: string;
}) => {
  const response = await request.post(`${AUTH_API_PREFIX}/oauth/bind`, data);
  return response;
};

/**
 * OAuth注册新账号
 */
export const oauthRegister = async (data: { unionId: string }) => {
  const response = await request.post(`${AUTH_API_PREFIX}/oauth/register`, data);
  return response;
};
