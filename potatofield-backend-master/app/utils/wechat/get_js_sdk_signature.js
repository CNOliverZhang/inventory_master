const sha1 = require('sha1');
const RandomString = require('randomstring');

const getJsApiTicket = require('./get_js_api_ticket');

module.exports = async (ctx, url) => {
  try {
    const jsApiTicket = await getJsApiTicket(ctx);
    if (!jsApiTicket) {
      throw new Error('get js api ticket error');
    }
    const randomString = RandomString.generate(16);
    const timestamp = (Number(new Date()) / 1000).toFixed(0);
    const rawString = `jsapi_ticket=${jsApiTicket}&noncestr=${randomString}&timestamp=${timestamp}&url=${url}`;
    const signature = sha1(rawString);
    return Promise.resolve({
      randomString,
      timestamp,
      signature,
    });
  } catch (err) {
    return Promise.reject(err);
  }
};
