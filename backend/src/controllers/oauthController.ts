import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { AuthUser, AuthCredential, UserProfile, AuthType } from '../models/auth';
import { generateToken } from '../utils/jwt';
import { getWechatUserInfo, getQQUserInfo, downloadAvatar } from '../services/oauthService';
import redisClient from '../config/redis';
import sharp from 'sharp';
import crypto from 'crypto';

/**
 * OAuth登录（微信/QQ）
 * 完整实现：用code换取用户信息，检查是否已绑定
 */
export const oauthLogin = async (req: Request, res: Response) => {
  try {
    const { code, state } = req.body;

    if (!code || !state) {
      return res.status(400).json({
        success: false,
        message: '缺少必要参数code或state',
      });
    }

    // 验证state是否合法
    if (state !== 'wechat' && state !== 'qq') {
      return res.status(400).json({
        success: false,
        message: '无效的OAuth提供商',
      });
    }

    // 调用第三方API获取用户信息
    let oauthUserInfo: {
      accessToken: string;
      openId: string;
      unionId: string;
      nickname: string;
      avatar: string;
    };

    try {
      if (state === 'wechat') {
        oauthUserInfo = await getWechatUserInfo(code);
      } else {
        const redirectUri = encodeURIComponent('https://potatofield.cn/oauth/callback');
        oauthUserInfo = await getQQUserInfo(code, redirectUri);
      }
    } catch (error) {
      console.error('获取OAuth用户信息失败:', error);
      return res.status(400).json({
        success: false,
        message: '获取第三方用户信息失败',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }

    const { accessToken, openId, unionId, nickname, avatar } = oauthUserInfo;
    const authType = state === 'wechat' ? AuthType.WECHAT : AuthType.QQ;

    // 查找是否已有该unionId的认证凭据
    const credential = await AuthCredential.findOne({
      where: {
        identifier: unionId,
        authType,
      },
    });

    if (credential) {
      // 已绑定，直接登录
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

      // 更新最后登录时间
      await AuthUser.update({ lastLoginAt: new Date() }, { where: { id: user.id } });

      // 生成token
      const token = generateToken({
        userId: user.id,
        identifier: unionId,
      });

      res.json({
        success: true,
        data: {
          needBind: false,
          user,
          token,
        },
      });
    } else {
      // 未绑定，将OAuth信息暂存到Redis
      const oauthKey = `oauth:${state}:${unionId}`;
      await redisClient.setex(
        oauthKey,
        300, // 5分钟有效期
        JSON.stringify({
          accessToken,
          openId,
          unionId,
          nickname,
          avatar,
          state,
          authType,
          timestamp: Date.now(),
        })
      );

      res.json({
        success: true,
        data: {
          needBind: true,
          oauthKey,
          provider: state,
          unionId,
          nickname,
          avatar,
          message: `该${state === 'wechat' ? '微信' : 'QQ'}账号尚未绑定`,
        },
      });
    }
  } catch (error) {
    console.error('OAuth login error:', error);
    res.status(500).json({
      success: false,
      message: 'OAuth登录失败',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * OAuth绑定已有账号
 */
export const oauthBind = async (req: Request, res: Response) => {
  try {
    const { unionId, identifier, password } = req.body;

    if (!unionId || !identifier || !password) {
      return res.status(400).json({
        success: false,
        message: '缺少必要参数',
      });
    }

    // 从Redis获取OAuth信息
    const oauthKeys = await redisClient.keys(`oauth:*:${unionId}`);
    if (!oauthKeys || oauthKeys.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'OAuth信息已过期，请重新登录',
      });
    }

    const oauthDataStr = await redisClient.get(oauthKeys[0]);
    if (!oauthDataStr) {
      return res.status(400).json({
        success: false,
        message: 'OAuth信息已过期，请重新登录',
      });
    }

    const oauthData = JSON.parse(oauthDataStr);

    // 验证账号密码
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

    const isPasswordValid = await bcrypt.compare(password, credential.credential);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: '账号或密码错误',
      });
    }

    // 检查该OAuth账号是否已被其他用户绑定
    const existingOAuthCred = await AuthCredential.findOne({
      where: {
        identifier: unionId,
        authType: oauthData.authType,
      },
    });

    if (existingOAuthCred) {
      return res.status(400).json({
        success: false,
        message: `该${oauthData.state === 'wechat' ? '微信' : 'QQ'}账号已被其他用户绑定`,
      });
    }

    // 创建OAuth认证凭据
    await AuthCredential.create({
      userId: credential.userId,
      authType: oauthData.authType,
      identifier: unionId,
    });

    // 删除临时OAuth数据
    await redisClient.del(oauthKeys[0]);

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
      message: '绑定并登录成功',
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    console.error('OAuth bind error:', error);
    res.status(500).json({
      success: false,
      message: 'OAuth绑定失败',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * OAuth换绑（已登录用户）
 */
export const oauthRebind = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '未认证',
      });
    }

    const { unionId } = req.body;

    if (!unionId) {
      return res.status(400).json({
        success: false,
        message: '缺少必要参数',
      });
    }

    // 从Redis获取OAuth信息
    const oauthKeys = await redisClient.keys(`oauth:*:${unionId}`);
    if (!oauthKeys || oauthKeys.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'OAuth信息已过期，请重新授权',
      });
    }

    const oauthDataStr = await redisClient.get(oauthKeys[0]);
    if (!oauthDataStr) {
      return res.status(400).json({
        success: false,
        message: 'OAuth信息已过期，请重新授权',
      });
    }

    const oauthData = JSON.parse(oauthDataStr);

    // 检查该OAuth账号是否已被其他用户绑定
    const existingOAuthCred = await AuthCredential.findOne({
      where: {
        identifier: unionId,
        authType: oauthData.authType,
      },
    });

    if (existingOAuthCred && existingOAuthCred.userId !== req.user.userId) {
      return res.status(400).json({
        success: false,
        message: `该${oauthData.state === 'wechat' ? '微信' : 'QQ'}账号已被其他用户绑定`,
      });
    }

    // 查找当前用户的该类型OAuth凭据
    const userOAuthCred = await AuthCredential.findOne({
      where: {
        userId: req.user.userId,
        authType: oauthData.authType,
      },
    });

    if (userOAuthCred) {
      // 换绑：更新unionId
      await AuthCredential.update(
        { identifier: unionId },
        {
          where: {
            userId: req.user.userId,
            authType: oauthData.authType,
          },
        }
      );
    } else {
      // 绑定：创建新凭据
      await AuthCredential.create({
        userId: req.user.userId,
        authType: oauthData.authType,
        identifier: unionId,
      });
    }

    // 删除临时OAuth数据
    await redisClient.del(oauthKeys[0]);

    res.json({
      success: true,
      message: userOAuthCred ? `${oauthData.state === 'wechat' ? '微信' : 'QQ'}换绑成功` : `${oauthData.state === 'wechat' ? '微信' : 'QQ'}绑定成功`,
      data: {
        provider: oauthData.state,
        unionId,
      },
    });
  } catch (error) {
    console.error('OAuth rebind error:', error);
    res.status(500).json({
      success: false,
      message: 'OAuth换绑失败',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * OAuth注册新账号
 */
export const oauthRegister = async (req: Request, res: Response) => {
  try {
    const { unionId } = req.body;

    if (!unionId) {
      return res.status(400).json({
        success: false,
        message: '缺少必要参数',
      });
    }

    // 从Redis获取OAuth信息
    const oauthKeys = await redisClient.keys(`oauth:*:${unionId}`);
    if (!oauthKeys || oauthKeys.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'OAuth信息已过期，请重新登录',
      });
    }

    const oauthDataStr = await redisClient.get(oauthKeys[0]);
    if (!oauthDataStr) {
      return res.status(400).json({
        success: false,
        message: 'OAuth信息已过期，请重新登录',
      });
    }

    const oauthData = JSON.parse(oauthDataStr);
    const { openId, nickname, avatar: avatarUrl, authType } = oauthData;

    // 检查该OAuth账号是否已被绑定
    const existingCred = await AuthCredential.findOne({
      where: {
        identifier: unionId,
        authType,
      },
    });

    if (existingCred) {
      return res.status(400).json({
        success: false,
        message: `该${oauthData.state === 'wechat' ? '微信' : 'QQ'}账号已被注册`,
      });
    }

    // 创建新用户
    const user = await AuthUser.create({
      isAdmin: false,
    });

    // 处理头像（下载并上传）
    let processedAvatar = '';
    try {
      // 下载头像
      const avatarBuffer = await downloadAvatar(avatarUrl);
      
      // 使用sharp压缩并转换为webp格式
      const compressedBuffer = await sharp(avatarBuffer)
        .resize(200, 200, { fit: 'cover' })
        .webp({ quality: 80 })
        .toBuffer();

      // 生成文件名
      const hash = crypto.createHash('md5').update(String(user.id)).digest('hex');
      const filename = `user_${hash}_${Date.now()}.webp`;
      
      // TODO: 上传到COS
      // 暂时使用原始头像URL
      processedAvatar = avatarUrl;
    } catch (error) {
      console.error('处理头像失败:', error);
      processedAvatar = avatarUrl; // 使用原始URL
    }

    // 创建用户资料
    await UserProfile.create({
      userId: user.id,
      nickname: nickname || `${oauthData.state === 'wechat' ? '微信' : 'QQ'}用户${user.id}`,
      avatar: processedAvatar,
    });

    // 创建OAuth认证凭据
    await AuthCredential.create({
      userId: user.id,
      authType,
      identifier: unionId,
    });

    // 删除临时OAuth数据
    await redisClient.del(oauthKeys[0]);

    // 获取完整用户信息
    const fullUser = await AuthUser.findByPk(user.id, {
      include: [
        {
          model: UserProfile,
          as: 'profile',
        },
      ],
    });

    // 生成token
    const token = generateToken({
      userId: user.id,
      identifier: unionId,
    });

    res.status(201).json({
      success: true,
      message: 'OAuth注册成功',
      data: {
        user: fullUser,
        token,
      },
    });
  } catch (error) {
    console.error('OAuth register error:', error);
    res.status(500).json({
      success: false,
      message: 'OAuth注册失败',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
