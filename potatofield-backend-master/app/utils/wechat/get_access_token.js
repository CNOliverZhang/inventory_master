const axios = require('axios');

const api = require('../../apis');
const wechatConfig = require('../../config/wechat_official_account');

module.exports = async (ctx) => {
  try {
    let accessToken = await ctx.redis.get('wechatAccessToken');
    if (!accessToken) {
      const res = await axios.get(`${api.wechat.getAccessToken}?grant_type=client_credential&appid=${wechatConfig.appid}&secret=${wechatConfig.secret}`);
      if (res?.status !== 200) {
        throw new Error('get access token error');
      }
      accessToken = res?.data?.access_token;
      const expiresIn = res?.data?.expires_in;
      if (!accessToken) {
        throw new Error('get access token error');
      } else {
        await ctx.redis.set('wechatAccessToken', accessToken);
        await ctx.redis.expire('wechatAccessToken', expiresIn);
      }
    }
    return Promise.resolve(accessToken);
  } catch (err) {
    return Promise.reject(err);
  }
};
