const Router = require('koa-router');
const wechat = require('../handlers/service/wechat');

module.exports = () => {
  const router = new Router({
    prefix: '/service',
  });
  router.get('/wechat/get_js_sdk_signature', wechat.jsSdkSignature);
  return router;
};
