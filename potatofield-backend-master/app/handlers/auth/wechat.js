const CryptoJS = require('crypto-js');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const sharp = require('sharp');

const uploadToCos = require('../../utils/file/upload_to_cos');
const api = require('../../apis');
const jwtSecret = require('../../config/jwt_secret');
const wechatWebsiteConfig = require('../../config/wechat_website');

const AUTH_TYPE = require('../../constants/auth_type');

module.exports = {
  login: async (ctx) => {
    ctx.verifyParams({
      code: { type: 'string', required: true },
    });
    const { Auth_user, Auth_credential, User_profile } = ctx.db;
    const { code } = ctx.params;
    try {
      const accessTokenRes = await axios.get(
        `${api.wechat.getUserAccessToken}?appid=${wechatWebsiteConfig.appid}&secret=${wechatWebsiteConfig.secret}&code=${code}&grant_type=authorization_code`,
      );
      if (accessTokenRes?.status !== 200) {
        throw new Error('get access token error');
      }
      const accessToken = accessTokenRes?.data?.access_token;
      const openId = accessTokenRes?.data?.openid;
      const userInfoRes = await axios.get(
        `${api.wechat.getUserInfo}?access_token=${accessToken}&openid=${openId}&lang=zh_CN`,
      );
      if (userInfoRes?.status !== 200) {
        throw new Error('get user info error');
      }
      const unionId = userInfoRes?.data?.unionid;
      const credentialInstance = await Auth_credential.findOne({
        where: {
          identifier: unionId,
        },
      });
      if (!credentialInstance) {
        await ctx.redis.set(accessToken, unionId);
        await ctx.redis.expire(accessToken, 5 * 60);
        ctx.body = {
          success: false,
          accessToken,
          openId,
          unionId,
        };
      } else {
        const { userId } = credentialInstance;
        const user = await Auth_user.findOne({
          where: {
            id: userId,
          },
          include: {
            model: User_profile,
            attributes: ['nickname', 'avatar', 'intro'],
            as: 'profile',
          },
        });
        const token = jwt.sign({ userId: user.id, isAdmin: user.isAdmin }, jwtSecret, { expiresIn: '30d' });
        ctx.body = {
          success: true,
          token,
          user,
        };
      }
    } catch (err) {
      ctx.throw(403, `Login error: ${err.message}.`);
    }
  },
  register: async (ctx) => {
    ctx.verifyParams({
      openId: { type: 'string', required: true },
      unionId: { type: 'string', required: true },
      accessToken: { type: 'string', required: true },
    });
    const { Auth_user, Auth_credential, User_profile } = ctx.db;
    const { openId, unionId, accessToken } = ctx.params;
    try {
      const correctUnionId = await ctx.redis.get(accessToken);
      if (unionId !== correctUnionId) {
        throw new Error('invalid union id');
      }
      await ctx.redis.del(accessToken);
      const credentialInstance = await Auth_credential.findOne({
        where: {
          identifier: unionId,
        },
      });
      if (credentialInstance) {
        throw new Error('wechat already bound to another user');
      }
      const userInfoRes = await axios.get(
        `${api.wechat.getUserInfo}?access_token=${accessToken}&openid=${openId}&lang=zh_CN`,
      );
      if (userInfoRes?.status !== 200) {
        throw new Error('get user info error');
      }
      const newUser = await Auth_user.create({ isAdmin: false });
      const userId = newUser.id;
      const avatarUrl = userInfoRes?.data?.headimgurl;
      const nickname = userInfoRes?.data?.nickname;
      const avatarRes = await axios.get(avatarUrl, { responseType: 'stream' });
      const sharpStream = avatarRes.data.pipe(sharp());
      const avatarBuffer = await sharpStream.webp().toBuffer();
      const avatarKey = `User/Avatars/user_${CryptoJS.MD5(String(userId))}_${Number(new Date())}.webp`;
      const avatar = await uploadToCos({ buffer: avatarBuffer, key: avatarKey });
      await User_profile.create({
        userId,
        avatar,
        nickname,
      });
      await Auth_credential.create({
        userId,
        authType: AUTH_TYPE.WECHAT,
        identifier: unionId,
      });
      const user = await Auth_user.findOne({
        where: {
          id: userId,
        },
        include: {
          model: User_profile,
          attributes: ['nickname', 'avatar', 'intro'],
          as: 'profile',
        },
      });
      const token = jwt.sign({ userId: user.id, isAdmin: user.isAdmin }, jwtSecret, { expiresIn: '30d' });
      ctx.body = {
        success: true,
        token,
        user,
      };
    } catch (err) {
      ctx.throw(400, `Register error: ${err.message}`);
    }
  },
  connect: async (ctx) => {
    ctx.verifyParams({
      code: { type: 'string', required: true },
    });
    const { Auth_credential } = ctx.db;
    const { id: userId } = ctx.request.user;
    const { code } = ctx.params;
    try {
      const accessTokenRes = await axios.get(
        `${api.wechat.getUserAccessToken}?appid=${wechatWebsiteConfig.appid}&secret=${wechatWebsiteConfig.secret}&code=${code}&grant_type=authorization_code`,
      );
      if (accessTokenRes?.status !== 200) {
        throw new Error('get access token error');
      }
      const accessToken = accessTokenRes?.data?.access_token;
      const openId = accessTokenRes?.data?.openid;
      const userInfoRes = await axios.get(
        `${api.wechat.getUserInfo}?access_token=${accessToken}&openid=${openId}&lang=zh_CN`,
      );
      if (userInfoRes?.status !== 200) {
        throw new Error('get user info error');
      }
      const unionId = userInfoRes?.data?.unionid;
      const credentialInstance = await Auth_credential.findOne({
        where: {
          identifier: unionId,
        },
      });
      if (credentialInstance) {
        throw new Error('wechat already bound to another user');
      }
      await Auth_credential.create({
        userId,
        authType: AUTH_TYPE.WECHAT,
        identifier: unionId,
      });
      ctx.body = { success: true };
    } catch (err) {
      ctx.throw(400, `Bind wechat error: ${err.message}.`);
    }
  },
  loginAndConnect: async (ctx) => {
    ctx.verifyParams({
      unionId: { type: 'string', required: true },
      accessToken: { type: 'string', required: true },
      identifier: { type: 'string', required: true },
      password: { type: 'string', required: true },
    });
    const { Auth_user, Auth_credential, User_profile } = ctx.db;
    const {
      unionId,
      accessToken,
      identifier,
      password,
    } = ctx.params;
    try {
      const correctUnionId = await ctx.redis.get(accessToken);
      if (unionId !== correctUnionId) {
        throw new Error('invalid union id');
      }
      const credentialInstance = await Auth_credential.findOne({
        where: {
          identifier,
        },
      });
      if (!credentialInstance) {
        throw new Error('invalid credential');
      }
      const { userId, credential: userPassword } = credentialInstance;
      const isVerified = await bcrypt.compare(password, userPassword);
      if (!isVerified) {
        throw new Error('invalid password');
      }
      const user = await Auth_user.findOne({
        where: {
          id: userId,
        },
        include: {
          model: User_profile,
          attributes: ['nickname', 'avatar', 'intro'],
          as: 'profile',
        },
      });
      if (!user) {
        throw new Error('invalid user');
      }
      const wechatCredentialInstance = await Auth_credential.findOne({
        where: {
          identifier: unionId,
        },
      });
      if (wechatCredentialInstance) {
        throw new Error('wechat already bound to another user');
      }
      await Auth_credential.create({
        userId,
        authType: AUTH_TYPE.WECHAT,
        identifier: unionId,
      });
      await ctx.redis.del(accessToken);
      const token = jwt.sign({ userId, isAdmin: user.isAdmin }, jwtSecret, { expiresIn: '30d' });
      ctx.body = {
        success: true,
        token,
        user,
      };
    } catch (err) {
      ctx.throw(403, `Login and bind wechat error: ${err.message}.`);
    }
  },
};
