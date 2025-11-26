const axios = require('axios');

const generateCode = require('../../utils/verification_code/generate_code');
const sendSms = require('../../utils/verification_code/send_sms_verification_code');
const sendEmail = require('../../utils/verification_code/send_email_verification_code');
const vaptchaConfig = require('../../config/vaptcha');

module.exports = {
  phone: async (ctx) => {
    ctx.verifyParams({
      identifier: { type: 'string', required: true },
      token: { type: 'string', required: true },
      server: { type: 'string', required: true },
    });
    const { Auth_credential } = ctx.db;
    const { identifier, token, server } = ctx.params;
    try {
      const homonymicCredential = await Auth_credential.findOne({
        where: {
          identifier,
        },
      });
      if (homonymicCredential) {
        throw new Error('identifier already exists');
      }
      const identifierExists = await ctx.redis.get(`${identifier}.send`);
      if (identifierExists) {
        throw new Error('request verification code too frequently');
      }
      const verifyTokenRes = await axios.post(server, {
        id: vaptchaConfig.vid,
        secretkey: vaptchaConfig.key,
        scene: 0,
        token,
        ip: ctx.request.ip,
      });
      if (!verifyTokenRes?.data?.success) {
        throw new Error('vaptcha verification failed');
      }
      const code = generateCode();
      await sendSms({ phoneNumber: identifier, code, expiresIn: '5' });
      await ctx.redis.set(`${identifier}.code`, code);
      await ctx.redis.expire(`${identifier}.code`, 5 * 60);
      await ctx.redis.set(`${identifier}.send`, 1);
      await ctx.redis.expire(`${identifier}.send`, 60);
      ctx.body = {
        success: true,
      };
    } catch (err) {
      ctx.throw(400, `Verify phone error: ${err}`);
    }
  },
  email: async (ctx) => {
    ctx.verifyParams({
      identifier: { type: 'string', required: true },
      token: { type: 'string', required: true },
      server: { type: 'string', required: true },
    });
    const { Auth_credential } = ctx.db;
    const { identifier, token, server } = ctx.params;
    try {
      const homonymicCredential = await Auth_credential.findOne({
        where: {
          identifier,
        },
      });
      if (homonymicCredential) {
        throw new Error('identifier already exists');
      }
      const identifierExists = await ctx.redis.get(`${identifier}.send`);
      if (identifierExists) {
        throw new Error('request verification code too frequently');
      }
      const verifyTokenRes = await axios.post(server, {
        id: vaptchaConfig.vid,
        secretkey: vaptchaConfig.key,
        scene: 0,
        token,
        ip: ctx.request.ip,
      });
      if (!verifyTokenRes?.data?.success) {
        throw new Error('vaptcha verification failed');
      }
      const code = generateCode();
      await sendEmail({ email: identifier, code, expiresIn: '5' });
      await ctx.redis.set(`${identifier}.code`, code);
      await ctx.redis.expire(`${identifier}.code`, 5 * 60);
      await ctx.redis.set(`${identifier}.send`, 1);
      await ctx.redis.expire(`${identifier}.send`, 60);
      ctx.body = {
        success: true,
      };
    } catch (err) {
      ctx.throw(400, `Verify email error: ${err}`);
    }
  },
};
