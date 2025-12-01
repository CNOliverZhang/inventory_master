import express from 'express';
import multer from 'multer';
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
  oauthRebind,
} from '../controllers/oauthController';
import {
  getBindings,
  updateUsername,
  updateNickname,
  sendBindEmailCode,
  sendBindPhoneCode,
  bindEmail,
  bindPhone,
  unbindOAuth,
  changePassword,
  uploadAvatar,
  deleteAvatar,
} from '../controllers/accountController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// 配置 multer 用于头像上传
const avatarUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (_req, file, cb) => {
    // 只允许图片格式
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('只允许上传图片文件'));
    }
  },
});

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

// OAuth换绑（已登录用户）
router.post('/oauth/rebind', authenticate, oauthRebind);

// 获取当前用户信息（需要认证）
router.get('/me', authenticate, getCurrentUser);

// ========== 账号绑定管理 ==========

// 获取所有绑定信息
router.get('/bindings', authenticate, getBindings);

// 修改用户名
router.post('/update-username', authenticate, updateUsername);

// 修改昵称
router.post('/update-nickname', authenticate, updateNickname);

// 发送绑定邮箱验证码
router.post('/send-bind-email-code', authenticate, sendBindEmailCode);

// 发送绑定手机验证码
router.post('/send-bind-phone-code', authenticate, sendBindPhoneCode);

// 绑定/换绑邮箱
router.post('/bind-email', authenticate, bindEmail);

// 绑定/换绑手机号
router.post('/bind-phone', authenticate, bindPhone);

// 解绑OAuth（微信/QQ）
router.post('/unbind-oauth', authenticate, unbindOAuth);

// 修改/设置密码
router.post('/change-password', authenticate, changePassword);

// 上传头像
router.post('/upload-avatar', authenticate, avatarUpload.single('avatar'), uploadAvatar);

// 删除头像
router.delete('/delete-avatar', authenticate, deleteAvatar);

export default router;
