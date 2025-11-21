import express from 'express';
import { register, login, getCurrentUser } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// 公开路由
router.post('/register', register);
router.post('/login', login);

// 需要认证的路由
router.get('/me', authenticate, getCurrentUser);

export default router;
