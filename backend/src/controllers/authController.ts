import { Request, Response } from 'express';
import { User } from '../models';
import { generateToken } from '../utils/jwt';

/**
 * 用户注册
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

    // 检查用户名是否已存在
    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: '用户名已被使用',
      });
    }

    // 检查邮箱是否已存在
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: '邮箱已被注册',
      });
    }

    // 创建用户
    const user = await User.create({
      username,
      email,
      password,
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
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: '注册失败',
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
