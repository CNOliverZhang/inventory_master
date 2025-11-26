import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { AuthUser, AuthCredential, UserProfile, AuthType } from '../models/auth';
import { sendVerificationEmail } from '../services/emailService';
import { sendSMS } from '../services/smsService';
import redisClient from '../config/redis';

/**
 * 获取用户所有绑定信息
 */
export const getBindings = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '未认证',
      });
    }

    // 获取所有认证凭据
    const credentials = await AuthCredential.findAll({
      where: { userId: req.user.userId },
      attributes: ['authType', 'identifier'],
    });

    // 获取用户资料（包含昵称）
    const profile = await UserProfile.findOne({
      where: { userId: req.user.userId },
      attributes: ['nickname'],
    });

    // 格式化绑定信息
    const bindings = {
      username: credentials.find(c => c.authType === AuthType.USERNAME)?.identifier || null,
      email: credentials.find(c => c.authType === AuthType.EMAIL)?.identifier || null,
      phone: credentials.find(c => c.authType === AuthType.PHONE)?.identifier || null,
      wechat: credentials.find(c => c.authType === AuthType.WECHAT)?.identifier || null,
      qq: credentials.find(c => c.authType === AuthType.QQ)?.identifier || null,
      nickname: profile?.nickname || null,
    };

    res.json({
      success: true,
      data: bindings,
    });
  } catch (error) {
    console.error('Get bindings error:', error);
    res.status(500).json({
      success: false,
      message: '获取绑定信息失败',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * 修改用户名
 */
export const updateUsername = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '未认证',
      });
    }

    const { username } = req.body;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: '用户名不能为空',
      });
    }

    // 验证用户名格式
    if (username.length < 3 || username.length > 50) {
      return res.status(400).json({
        success: false,
        message: '用户名长度应在3-50个字符之间',
      });
    }

    // 检查用户名是否已被占用
    const existingUsername = await AuthCredential.findOne({
      where: {
        identifier: username,
        authType: AuthType.USERNAME,
      },
    });

    if (existingUsername && existingUsername.userId !== req.user.userId) {
      return res.status(400).json({
        success: false,
        message: '该用户名已被使用',
      });
    }

    // 查找或创建用户名凭据
    const usernameCredential = await AuthCredential.findOne({
      where: {
        userId: req.user.userId,
        authType: AuthType.USERNAME,
      },
    });

    if (usernameCredential) {
      // 更新现有用户名
      await AuthCredential.update(
        { identifier: username },
        {
          where: {
            userId: req.user.userId,
            authType: AuthType.USERNAME,
          },
        }
      );
    } else {
      // 创建新的用户名凭据（共享密码）
      const emailOrPhoneCred = await AuthCredential.findOne({
        where: {
          userId: req.user.userId,
          authType: [AuthType.EMAIL, AuthType.PHONE],
        },
      });

      if (!emailOrPhoneCred || !emailOrPhoneCred.credential) {
        return res.status(400).json({
          success: false,
          message: '未找到密码信息',
        });
      }

      await AuthCredential.create({
        userId: req.user.userId,
        authType: AuthType.USERNAME,
        identifier: username,
        credential: emailOrPhoneCred.credential, // 共享密码
      });
    }

    res.json({
      success: true,
      message: '用户名修改成功',
      data: { username },
    });
  } catch (error) {
    console.error('Update username error:', error);
    res.status(500).json({
      success: false,
      message: '修改用户名失败',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * 修改昵称
 */
export const updateNickname = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '未认证',
      });
    }

    const { nickname } = req.body;

    if (!nickname) {
      return res.status(400).json({
        success: false,
        message: '昵称不能为空',
      });
    }

    if (nickname.length > 50) {
      return res.status(400).json({
        success: false,
        message: '昵称长度不能超过50个字符',
      });
    }

    await UserProfile.update(
      { nickname },
      { where: { userId: req.user.userId } }
    );

    res.json({
      success: true,
      message: '昵称修改成功',
      data: { nickname },
    });
  } catch (error) {
    console.error('Update nickname error:', error);
    res.status(500).json({
      success: false,
      message: '修改昵称失败',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * 发送绑定/换绑邮箱验证码
 */
export const sendBindEmailCode = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '未认证',
      });
    }

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: '邮箱不能为空',
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

    // 检查邮箱是否已被其他用户绑定
    const existingEmail = await AuthCredential.findOne({
      where: {
        identifier: email,
        authType: AuthType.EMAIL,
      },
    });

    if (existingEmail && existingEmail.userId !== req.user.userId) {
      return res.status(400).json({
        success: false,
        message: '该邮箱已被其他用户绑定',
      });
    }

    // 检查发送频率限制
    const sendLock = await redisClient.get(`email:bind:${email}`);
    if (sendLock) {
      return res.status(429).json({
        success: false,
        message: '发送过于频繁，请稍后再试',
      });
    }

    // 生成并发送验证码
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await sendVerificationEmail(email, code);

    // 存储验证码到Redis（5分钟有效）
    await redisClient.setex(`email:bind:code:${email}`, 300, code);

    // 设置发送频率限制（60秒）
    await redisClient.setex(`email:bind:${email}`, 60, '1');

    res.json({
      success: true,
      message: '验证码已发送到您的邮箱',
      data: {
        email,
        expiresIn: 300,
      },
    });
  } catch (error) {
    console.error('Send bind email code error:', error);
    res.status(500).json({
      success: false,
      message: '发送验证码失败',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * 发送绑定/换绑手机验证码
 */
export const sendBindPhoneCode = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '未认证',
      });
    }

    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: '手机号不能为空',
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

    // 检查手机号是否已被其他用户绑定
    const existingPhone = await AuthCredential.findOne({
      where: {
        identifier: phone,
        authType: AuthType.PHONE,
      },
    });

    if (existingPhone && existingPhone.userId !== req.user.userId) {
      return res.status(400).json({
        success: false,
        message: '该手机号已被其他用户绑定',
      });
    }

    // 检查发送频率限制
    const sendLock = await redisClient.get(`phone:bind:${phone}`);
    if (sendLock) {
      return res.status(429).json({
        success: false,
        message: '发送过于频繁，请稍后再试',
      });
    }

    // 生成验证码
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // 发送短信验证码
    await sendSMS(phone, code, 5);

    // 存储验证码到Redis（5分钟有效）
    await redisClient.setex(`phone:bind:code:${phone}`, 300, code);

    // 设置发送频率限制（60秒）
    await redisClient.setex(`phone:bind:${phone}`, 60, '1');

    res.json({
      success: true,
      message: '验证码已发送到您的手机',
      data: {
        phone,
        expiresIn: 300,
      },
    });
  } catch (error) {
    console.error('Send bind phone code error:', error);
    res.status(500).json({
      success: false,
      message: '发送验证码失败',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * 绑定/换绑邮箱
 */
export const bindEmail = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '未认证',
      });
    }

    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: '邮箱和验证码不能为空',
      });
    }

    // 验证验证码
    const correctCode = await redisClient.get(`email:bind:code:${email}`);
    if (!correctCode || correctCode !== code) {
      return res.status(400).json({
        success: false,
        message: '验证码错误或已过期',
      });
    }

    // 检查邮箱是否已被其他用户绑定
    const existingEmail = await AuthCredential.findOne({
      where: {
        identifier: email,
        authType: AuthType.EMAIL,
      },
    });

    if (existingEmail && existingEmail.userId !== req.user.userId) {
      return res.status(400).json({
        success: false,
        message: '该邮箱已被其他用户绑定',
      });
    }

    // 查找用户的邮箱凭据
    const emailCredential = await AuthCredential.findOne({
      where: {
        userId: req.user.userId,
        authType: AuthType.EMAIL,
      },
    });

    // 获取现有密码（从其他凭据）
    const existingCred = await AuthCredential.findOne({
      where: {
        userId: req.user.userId,
        authType: [AuthType.EMAIL, AuthType.USERNAME, AuthType.PHONE],
      },
    });

    const password = existingCred?.credential || null;

    if (emailCredential) {
      // 换绑：更新现有邮箱
      await AuthCredential.update(
        { identifier: email },
        {
          where: {
            userId: req.user.userId,
            authType: AuthType.EMAIL,
          },
        }
      );
    } else {
      // 绑定：创建新的邮箱凭据
      await AuthCredential.create({
        userId: req.user.userId,
        authType: AuthType.EMAIL,
        identifier: email,
        credential: password,
      });
    }

    // 删除验证码
    await redisClient.del(`email:bind:code:${email}`);

    res.json({
      success: true,
      message: emailCredential ? '邮箱换绑成功' : '邮箱绑定成功',
      data: { email },
    });
  } catch (error) {
    console.error('Bind email error:', error);
    res.status(500).json({
      success: false,
      message: '绑定邮箱失败',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * 绑定/换绑手机号
 */
export const bindPhone = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '未认证',
      });
    }

    const { phone, code } = req.body;

    if (!phone || !code) {
      return res.status(400).json({
        success: false,
        message: '手机号和验证码不能为空',
      });
    }

    // 验证验证码
    const correctCode = await redisClient.get(`phone:bind:code:${phone}`);
    if (!correctCode || correctCode !== code) {
      return res.status(400).json({
        success: false,
        message: '验证码错误或已过期',
      });
    }

    // 检查手机号是否已被其他用户绑定
    const existingPhone = await AuthCredential.findOne({
      where: {
        identifier: phone,
        authType: AuthType.PHONE,
      },
    });

    if (existingPhone && existingPhone.userId !== req.user.userId) {
      return res.status(400).json({
        success: false,
        message: '该手机号已被其他用户绑定',
      });
    }

    // 查找用户的手机凭据
    const phoneCredential = await AuthCredential.findOne({
      where: {
        userId: req.user.userId,
        authType: AuthType.PHONE,
      },
    });

    // 获取现有密码（从其他凭据）
    const existingCred = await AuthCredential.findOne({
      where: {
        userId: req.user.userId,
        authType: [AuthType.EMAIL, AuthType.USERNAME, AuthType.PHONE],
      },
    });

    const password = existingCred?.credential || null;

    if (phoneCredential) {
      // 换绑：更新现有手机号
      await AuthCredential.update(
        { identifier: phone },
        {
          where: {
            userId: req.user.userId,
            authType: AuthType.PHONE,
          },
        }
      );
    } else {
      // 绑定：创建新的手机凭据
      await AuthCredential.create({
        userId: req.user.userId,
        authType: AuthType.PHONE,
        identifier: phone,
        credential: password,
      });
    }

    // 删除验证码
    await redisClient.del(`phone:bind:code:${phone}`);

    res.json({
      success: true,
      message: phoneCredential ? '手机号换绑成功' : '手机号绑定成功',
      data: { phone },
    });
  } catch (error) {
    console.error('Bind phone error:', error);
    res.status(500).json({
      success: false,
      message: '绑定手机号失败',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * 解绑OAuth（微信/QQ）
 */
export const unbindOAuth = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '未认证',
      });
    }

    const { provider } = req.body; // 'wechat' 或 'qq'

    if (!provider || (provider !== 'wechat' && provider !== 'qq')) {
      return res.status(400).json({
        success: false,
        message: '无效的提供商',
      });
    }

    const authType = provider === 'wechat' ? AuthType.WECHAT : AuthType.QQ;

    // 检查是否有其他登录方式
    const allCredentials = await AuthCredential.findAll({
      where: { userId: req.user.userId },
    });

    // 至少需要保留一种登录方式
    if (allCredentials.length <= 1) {
      return res.status(400).json({
        success: false,
        message: `无法解绑：${provider === 'wechat' ? '微信' : 'QQ'}是您唯一的登录方式，请先绑定其他登录方式后再解绑`,
      });
    }

    // 删除OAuth凭据
    const deleted = await AuthCredential.destroy({
      where: {
        userId: req.user.userId,
        authType,
      },
    });

    if (deleted === 0) {
      return res.status(404).json({
        success: false,
        message: `未找到${provider === 'wechat' ? '微信' : 'QQ'}绑定`,
      });
    }

    res.json({
      success: true,
      message: `${provider === 'wechat' ? '微信' : 'QQ'}解绑成功`,
    });
  } catch (error) {
    console.error('Unbind OAuth error:', error);
    res.status(500).json({
      success: false,
      message: '解绑失败',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * 修改/设置密码
 */
export const changePassword = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '未认证',
      });
    }

    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: '密码不能为空',
      });
    }

    // 验证密码强度
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: '密码长度至少为 6 位',
      });
    }

    // 检查用户是否有密码类凭据（username/email/phone）
    const passwordCredentials = await AuthCredential.findAll({
      where: {
        userId: req.user.userId,
        authType: [AuthType.USERNAME, AuthType.EMAIL, AuthType.PHONE],
      },
    });

    // 如果没有任何密码类凭据，提示需要先绑定账号
    if (passwordCredentials.length === 0) {
      return res.status(400).json({
        success: false,
        message: '请先绑定手机号、邮箱或用户名后再设置密码',
      });
    }

    // 检查是否已有密码（判断credential字段是否为null）
    const hasPassword = passwordCredentials.some(cred => cred.credential !== null);

    // 加密密码
    const encryptedPassword = await bcrypt.hash(password, 10);

    // 更新所有密码类凭据的密码
    await AuthCredential.update(
      { credential: encryptedPassword },
      {
        where: {
          userId: req.user.userId,
          authType: [AuthType.USERNAME, AuthType.EMAIL, AuthType.PHONE],
        },
      }
    );

    res.json({
      success: true,
      message: hasPassword ? '密码修改成功' : '密码设置成功',
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: '操作失败',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
