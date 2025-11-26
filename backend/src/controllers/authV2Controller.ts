import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { AuthUser, AuthCredential, UserProfile, AuthType } from '../models/auth';
import { generateToken } from '../utils/jwt';
import {
  generateCaptcha,
  generateCaptchaToken,
  saveCaptcha,
  verifyCaptcha,
} from '../services/captchaService';
import {
  generateVerificationCode,
  savePendingUser,
  verifyCode,
  hasPendingRegistration,
  resendVerificationCode,
  getCodeTTL,
} from '../services/verificationService';
import { sendVerificationEmail } from '../services/emailService';
import { sendSMS } from '../services/smsService';
import { getWechatUserInfo, getQQUserInfo } from '../services/oauthService';
import redisClient from '../config/redis';

/**
 * 获取图形验证码
 */
export const getCaptcha = async (req: Request, res: Response) => {
  try {
    const { code, image } = generateCaptcha({
      width: 120,
      height: 40,
      length: 4,
    });

    const token = generateCaptchaToken();
    await saveCaptcha(token, code, 300); // 5分钟有效期

    res.json({
      success: true,
      data: {
        token,
        image,
      },
    });
  } catch (error) {
    console.error('Get captcha error:', error);
    res.status(500).json({
      success: false,
      message: '获取验证码失败',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * 发送邮箱验证码（需要先验证图形验证码）
 */
export const sendEmailCode = async (req: Request, res: Response) => {
  try {
    const { email, captchaToken, captchaCode } = req.body;

    if (!email || !captchaToken || !captchaCode) {
      return res.status(400).json({
        success: false,
        message: '邮箱、图形验证码token和验证码为必填项',
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

    // 验证图形验证码
    const isCaptchaValid = await verifyCaptcha(captchaToken, captchaCode);
    if (!isCaptchaValid) {
      return res.status(400).json({
        success: false,
        message: '图形验证码错误或已过期',
      });
    }

    // 检查发送频率限制
    const sendLock = await redisClient.get(`email:send:${email}`);
    if (sendLock) {
      return res.status(429).json({
        success: false,
        message: '发送过于频繁，请稍后再试',
      });
    }

    // 检查邮箱是否已注册
    const existingCredential = await AuthCredential.findOne({
      where: { identifier: email, authType: AuthType.EMAIL },
    });
    if (existingCredential) {
      return res.status(400).json({
        success: false,
        message: '该邮箱已被注册',
      });
    }

    // 生成并发送验证码
    const code = generateVerificationCode();
    await sendVerificationEmail(email, code);

    // 存储验证码到Redis（5分钟有效）
    await redisClient.set(`email:code:${email}`, code);
    await redisClient.expire(`email:code:${email}`, 300);

    // 设置发送频率限制（60秒）
    await redisClient.set(`email:send:${email}`, '1');
    await redisClient.expire(`email:send:${email}`, 60);

    res.json({
      success: true,
      message: '验证码已发送到您的邮箱',
      data: {
        email,
        expiresIn: 300,
      },
    });
  } catch (error) {
    console.error('Send email code error:', error);
    res.status(500).json({
      success: false,
      message: '发送验证码失败',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * 发送手机验证码（需要先验证图形验证码）
 */
export const sendPhoneCode = async (req: Request, res: Response) => {
  try {
    const { phone, captchaToken, captchaCode } = req.body;

    if (!phone || !captchaToken || !captchaCode) {
      return res.status(400).json({
        success: false,
        message: '手机号、图形验证码token和验证码为必填项',
      });
    }

    // 验证手机号格式
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: '手机号格式不正确',
      });
    }

    // 验证图形验证码
    const isCaptchaValid = await verifyCaptcha(captchaToken, captchaCode);
    if (!isCaptchaValid) {
      return res.status(400).json({
        success: false,
        message: '图形验证码错误或已过期',
      });
    }

    // 检查发送频率限制
    const sendLock = await redisClient.get(`phone:send:${phone}`);
    if (sendLock) {
      return res.status(429).json({
        success: false,
        message: '发送过于频繁，请稍后再试',
      });
    }

    // 检查手机号是否已注册
    const existingCredential = await AuthCredential.findOne({
      where: { identifier: phone, authType: AuthType.PHONE },
    });
    if (existingCredential) {
      return res.status(400).json({
        success: false,
        message: '该手机号已被注册',
      });
    }

    // 生成验证码
    const code = generateVerificationCode();
    
    // 发送短信验证码
    await sendSMS(phone, code, 5);

    // 存储验证码到Redis（5分钟有效）
    await redisClient.set(`phone:code:${phone}`, code);
    await redisClient.expire(`phone:code:${phone}`, 300);

    // 设置发送频率限制（60秒）
    await redisClient.set(`phone:send:${phone}`, '1');
    await redisClient.expire(`phone:send:${phone}`, 60);

    res.json({
      success: true,
      message: '验证码已发送到您的手机',
      data: {
        phone,
        expiresIn: 300,
      },
    });
  } catch (error) {
    console.error('Send phone code error:', error);
    res.status(500).json({
      success: false,
      message: '发送验证码失败',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * 用户注册（支持邮箱和手机号注册）
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { email, phone, password, code } = req.body;

    // 必须提供邮箱或手机号其中之一
    if ((!email && !phone) || !password || !code) {
      return res.status(400).json({
        success: false,
        message: '邮箱或手机号、密码和验证码为必填项',
      });
    }

    // 验证密码强度
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: '密码长度至少为6位',
      });
    }

    let identifier: string;
    let authType: AuthType;
    let codeKey: string;

    // 判断是邮箱还是手机号注册
    if (email) {
      identifier = email;
      authType = AuthType.EMAIL;
      codeKey = `email:code:${email}`;
    } else {
      identifier = phone;
      authType = AuthType.PHONE;
      codeKey = `phone:code:${phone}`;
    }

    // 验证验证码
    const correctCode = await redisClient.get(codeKey);
    if (!correctCode || correctCode !== code) {
      return res.status(400).json({
        success: false,
        message: '验证码错误或已过期',
      });
    }

    // 再次检查账号是否被占用
    const existingCredential = await AuthCredential.findOne({
      where: { identifier, authType },
    });
    if (existingCredential) {
      return res.status(400).json({
        success: false,
        message: authType === AuthType.EMAIL ? '该邮箱已被注册' : '该手机号已被注册',
      });
    }

    // 创建用户
    const user = await AuthUser.create({
      isAdmin: false,
    });

    // 加密密码
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 创建认证凭据
    await AuthCredential.create({
      userId: user.id,
      authType,
      identifier,
      credential: hashedPassword,
    });

    // 创建用户资料
    await UserProfile.create({
      userId: user.id,
      nickname: authType === AuthType.EMAIL ? email.split('@')[0] : phone.slice(-4), // 默认昵称
    });

    // 删除验证码
    await redisClient.del(codeKey);

    // 生成token
    const token = generateToken({
      userId: user.id,
      identifier,
    });

    // 获取完整用户信息
    const fullUser = await AuthUser.findByPk(user.id, {
      include: [
        {
          model: UserProfile,
          as: 'profile',
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: '注册成功',
      data: {
        user: fullUser,
        token,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: '注册失败',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * 用户登录（支持邮箱、用户名、手机号）
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: '账号和密码为必填项',
      });
    }

    // 查找认证凭据（邮箱、用户名或手机号）
    const credential = await AuthCredential.findOne({
      where: {
        identifier,
        authType: [AuthType.EMAIL, AuthType.USERNAME, AuthType.PHONE],
      },
    });

    if (!credential || !credential.credential) {
      return res.status(401).json({
        success: false,
        message: '账号或密码错误',
      });
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, credential.credential);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: '账号或密码错误',
      });
    }

    // 更新最后登录时间
    await AuthUser.update(
      { lastLoginAt: new Date() },
      { where: { id: credential.userId } }
    );

    // 获取用户完整信息
    const user = await AuthUser.findByPk(credential.userId, {
      include: [
        {
          model: UserProfile,
          as: 'profile',
        },
      ],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在',
      });
    }

    // 生成token
    const token = generateToken({
      userId: user.id,
      identifier,
    });

    res.json({
      success: true,
      message: '登录成功',
      data: {
        user,
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

    const user = await AuthUser.findByPk(req.user.userId, {
      include: [
        {
          model: UserProfile,
          as: 'profile',
        },
        {
          model: AuthCredential,
          as: 'credentials',
          attributes: ['authType', 'identifier'],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在',
      });
    }

    res.json({
      success: true,
      data: user,
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
