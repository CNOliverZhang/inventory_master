const axios = require('axios');

const api = require('../../apis');
const getAccessToken = require('./get_access_token');

module.exports = async (ctx) => {
  try {
    let jsApiTicket = await ctx.redis.get('wechatJsApiTicket');
    if (!jsApiTicket) {
      const accessToken = await getAccessToken(ctx);
      if (!accessToken) {
        throw new Error('get access token error');
      }
      const res = await axios.get(`${api.wechat.getJsApiTicket}?access_token=${accessToken}&type=jsapi`);
      if (res?.status !== 200) {
        throw new Error('get js api ticket error');
      }
      jsApiTicket = res?.data?.ticket;
      const expiresIn = res?.data?.expires_in;
      if (!jsApiTicket) {
        throw new Error('get js api ticket error');
      } else {
        await ctx.redis.set('wechatJsApiTicket', jsApiTicket);
        await ctx.redis.expire('wechatJsApiTicket', expiresIn);
      }
    }
    return Promise.resolve(jsApiTicket);
  } catch (err) {
    return Promise.reject(err);
  }
};
