import express from 'express';
import { register, login, getCurrentUser, verifyEmail, resendCode } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// 公开路由
router.post('/register', register); // 发送验证码
router.post('/verify-email', verifyEmail); // 验证邮箱并完成注册
router.post('/resend-code', resendCode); // 重新发送验证码
router.post('/login', login);

// 需要认证的路由
router.get('/me', authenticate, getCurrentUser);

export default router;
