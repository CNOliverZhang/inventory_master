const getJsSdkSignature = require('../../utils/wechat/get_js_sdk_signature');

module.exports = {
  jsSdkSignature: async (ctx) => {
    ctx.verifyParams({
      url: { type: 'string', required: true },
    });
    const { url } = ctx.params;
    try {
      const signatureObject = await getJsSdkSignature(ctx, url);
      ctx.body = signatureObject;
    } catch (err) {
      ctx.throw(400, `Get JS SDK signature error: ${err.message}.`);
    }
  },
};
