import express from 'express';
import {
  getCaptcha,
  sendEmailCode,
  sendPhoneCode,
  register,
  login,
  getCurrentUser,
} from '../controllers/authV2Controller';
import {
  oauthLogin,
  oauthBind,
  oauthRegister,
} from '../controllers/oauthController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// 图形验证码
router.get('/captcha', getCaptcha);

// 发送邮箱验证码
router.post('/send-email-code', sendEmailCode);

// 发送手机验证码
router.post('/send-phone-code', sendPhoneCode);

// 注册
router.post('/register', register);

// 登录
router.post('/login', login);

// OAuth登录（微信/QQ）
router.post('/oauth/login', oauthLogin);

// OAuth绑定已有账号
router.post('/oauth/bind', oauthBind);

// OAuth注册新账号
router.post('/oauth/register', oauthRegister);

// 获取当前用户信息（需要认证）
router.get('/me', authenticate, getCurrentUser);

export default router;
