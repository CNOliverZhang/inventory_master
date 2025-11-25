import { Request, Response } from 'express';
import { User } from '../models';
import { generateToken } from '../utils/jwt';
import {
  generateVerificationCode,
  savePendingUser,
  verifyCode,
  hasPendingRegistration,
  resendVerificationCode,
  getCodeTTL,
} from '../services/verificationService';
import { sendVerificationEmail } from '../services/emailService';

/**
 * 用户注册 - 第一步：发送验证码
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // 验证必填字段
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: '用户名、邮箱和密码为必填项',
      });
    }

    // 验证密码强度
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: '密码长度至少为 6 位',
      });
    }

    // 验证用户名长度
    if (username.length < 3 || username.length > 50) {
      return res.status(400).json({
        success: false,
        message: '用户名长度必须在 3-50 位之间',
      });
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: '邮箱格式不正确',
      });
    }

    // 检查用户名是否已存在（在数据库中）
    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: '用户名已被使用',
      });
    }

    // 检查邮箱是否已存在（在数据库中）
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: '邮箱已被注册',
      });
    }

    // 生成验证码
    const code = generateVerificationCode();

    // 保存待验证用户信息到 Redis（30分钟有效期）
    await savePendingUser(email, { username, email, password }, code, 1800);

    // 发送验证码邮件
    try {
      await sendVerificationEmail(email, code, username);
    } catch (emailError) {
      console.error('发送邮件失败:', emailError);
      return res.status(500).json({
        success: false,
        message: '发送验证邮件失败，请稍后重试',
      });
    }

    res.status(200).json({
      success: true,
      message: '验证码已发送到您的邮箱，请查收（有效期30分钟）',
      data: {
        email,
        expiresIn: 1800, // 30分钟
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: '注册失败',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * 验证邮箱并完成注册 - 第二步
 */
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;

    // 验证必填字段
    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: '邮箱和验证码为必填项',
      });
    }

    // 验证验证码并获取用户数据
    const userData = await verifyCode(email, code);

    if (!userData) {
      return res.status(400).json({
        success: false,
        message: '验证码错误或已过期',
      });
    }

    // 再次检查用户名和邮箱是否被占用（防止并发注册）
    const existingUsername = await User.findOne({ where: { username: userData.username } });
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: '用户名已被使用',
      });
    }

    const existingEmail = await User.findOne({ where: { email: userData.email } });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: '邮箱已被注册',
      });
    }

    // 创建用户（密码会在 User 模型的 hook 中自动加密）
    const user = await User.create({
      username: userData.username,
      email: userData.email,
      password: userData.password,
    });

    // 生成 token
    const token = generateToken({
      userId: user.id,
      username: user.username,
      email: user.email,
    });

    res.status(201).json({
      success: true,
      message: '注册成功',
      data: {
        user: user.toJSON(),
        token,
      },
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: '验证失败',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * 重新发送验证码
 */
export const resendCode = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // 验证必填字段
    if (!email) {
      return res.status(400).json({
        success: false,
        message: '邮箱为必填项',
      });
    }

    // 检查是否有待验证的注册
    const hasPending = await hasPendingRegistration(email);
    if (!hasPending) {
      return res.status(400).json({
        success: false,
        message: '未找到待验证的注册信息，请重新注册',
      });
    }

    // 检查上次发送的验证码剩余时间
    const ttl = await getCodeTTL(email);
    if (ttl > 1740) { // 如果距离上次发送不到1分钟（1800-1740=60秒）
      return res.status(429).json({
        success: false,
        message: '发送过于频繁，请稍后再试',
        data: {
          retryAfter: 1800 - ttl,
        },
      });
    }

    // 生成新验证码
    const code = generateVerificationCode();

    // 更新验证码
    const success = await resendVerificationCode(email, code, 1800);

    if (!success) {
      return res.status(400).json({
        success: false,
        message: '重新发送失败，请重新注册',
      });
    }

    // 发送验证码邮件
    try {
      await sendVerificationEmail(email, code);
    } catch (emailError) {
      console.error('发送邮件失败:', emailError);
      return res.status(500).json({
        success: false,
        message: '发送验证邮件失败，请稍后重试',
      });
    }

    res.status(200).json({
      success: true,
      message: '验证码已重新发送',
      data: {
        email,
        expiresIn: 1800,
      },
    });
  } catch (error) {
    console.error('Resend code error:', error);
    res.status(500).json({
      success: false,
      message: '重新发送失败',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * 用户登录
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 验证必填字段
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: '邮箱和密码为必填项',
      });
    }

    // 查找用户
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '邮箱或密码错误',
      });
    }

    // 验证密码
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: '邮箱或密码错误',
      });
    }

    // 生成 token
    const token = generateToken({
      userId: user.id,
      username: user.username,
      email: user.email,
    });

    res.json({
      success: true,
      message: '登录成功',
      data: {
        user: user.toJSON(),
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: '登录失败',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * 获取当前用户信息
 */
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '未认证',
      });
    }

    const user = await User.findByPk(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在',
      });
    }

    res.json({
      success: true,
      data: user.toJSON(),
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: '获取用户信息失败',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
