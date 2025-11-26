const CryptoJS = require('crypto-js');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const sharp = require('sharp');

const uploadToCos = require('../../utils/file/upload_to_cos');
const api = require('../../apis');
const jwtSecret = require('../../config/jwt_secret');
const wechatMiniProgramConfig = require('../../config/wechat_mini_program');

const AUTH_TYPE = require('../../constants/auth_type');

module.exports = {
  login: async (ctx) => {
    ctx.verifyParams({
      identifier: { type: 'string', required: true },
      password: { type: 'string', required: true },
    });
    const { Auth_user, Auth_credential, User_profile } = ctx.db;
    const { identifier, password } = ctx.params;
    try {
      const credentialInstance = await Auth_credential.findOne({
        where: { identifier },
      });
      if (!credentialInstance) {
        throw new Error('invalid credential');
      }
      const { userId, credential: userPassword } = credentialInstance;
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
      const isVerified = await bcrypt.compare(password, userPassword);
      if (!isVerified) {
        throw new Error('invalid password');
      }
      const token = jwt.sign({ userId: user.id, isAdmin: user.isAdmin }, jwtSecret, { expiresIn: '30d' });
      ctx.body = {
        success: true,
        token,
        user,
      };
    } catch (err) {
      ctx.throw(403, `Login error: ${err.message}.`);
    }
  },
  register: async (ctx) => {
    ctx.verifyParams({
      identifier: { type: 'string', required: true },
      password: { type: 'string', required: true },
      authType: { type: 'number', required: true },
      verificationCode: { type: 'string', required: true },
    });
    const { Auth_user, Auth_credential, User_profile } = ctx.db;
    const {
      identifier,
      password,
      authType,
      verificationCode,
    } = ctx.params;
    try {
      if (![AUTH_TYPE.PHONE, AUTH_TYPE.EMAIL].includes(authType)) {
        throw new Error('invalid auth type');
      }
      const correctCode = await ctx.redis.get(`${identifier}.code`);
      if (correctCode !== verificationCode) {
        throw new Error('wrong verification code');
      }
      await ctx.redis.del(`${identifier}.code`);
      const homonymicCredential = await Auth_credential.findOne({
        where: {
          identifier,
        },
      });
      if (homonymicCredential) {
        throw new Error('identifier already exists');
      }
      const user = await Auth_user.create({ isAdmin: false });
      const encryptedPassword = await bcrypt.hash(password, 10);
      await Auth_credential.create({
        userId: user.id,
        authType,
        identifier,
        credential: encryptedPassword,
      });
      await User_profile.create({
        userId: user.id,
      });
      ctx.body = { success: true };
    } catch (err) {
      ctx.throw(400, `Register error: ${err.message}.`);
    }
  },
  wechatMiniProgramLogin: async (ctx) => {
    ctx.verifyParams({
      jsCode: { type: 'string', required: true },
      userInfo: { type: 'object', required: true },
    });
    const { Auth_user, Auth_credential, User_profile } = ctx.db;
    const { jsCode, userInfo } = ctx.params;
    try {
      const res = await axios.get({
        url: `${api.wechat.miniProgram.getUnionId}?appid=${wechatMiniProgramConfig.appid}&secret=${wechatMiniProgramConfig.secret}&js_code=${jsCode}&grant_type=authorization_code`,
      });
      if (res?.status !== 200) {
        throw new Error('get access token error');
      }
      const unionId = res?.data?.unionid;
      const credentialInstance = await Auth_credential.findOne({
        where: {
          identifier: unionId,
        },
      });
      let userId;
      if (credentialInstance) {
        userId = credentialInstance.userId;
      } else {
        if (ctx.request.user) {
          userId = ctx.request.user.id;
        } else {
          const newUser = await Auth_user.create({ isAdmin: false });
          userId = newUser.id;
          const { avatarUrl, nickName: nickname } = userInfo;
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
        }
        await Auth_credential.create({
          userId,
          authType: AUTH_TYPE.WECHAT,
          identifier: unionId,
        });
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
      const token = jwt.sign({ userId: user.id, isAdmin: user.isAdmin }, jwtSecret, { expiresIn: '30d' });
      return {
        success: true,
        token,
        user,
      };
    } catch (err) {
      ctx.throw(403, `Login error: ${err.message}.`);
    }
  },
};
