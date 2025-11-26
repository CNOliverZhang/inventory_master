const Router = require('koa-router');
const user = require('../handlers/auth/user');
const wechat = require('../handlers/auth/wechat');
const qq = require('../handlers/auth/qq');
const credential = require('../handlers/auth/credential');
const verify = require('../handlers/auth/verify');

module.exports = ({ authorize }) => {
  const router = new Router({
    prefix: '/auth',
  });
  router.post('/user/login', user.login);
  router.post('/user/register', user.register);
  router.post('/wechat/login', wechat.login);
  router.post('/wechat/register', wechat.register);
  router.post('/wechat/connect', authorize({ required: true }), wechat.connect);
  router.post('/wechat/login_and_connect', wechat.loginAndConnect);
  router.post('/qq/login', qq.login);
  router.post('/qq/register', qq.register);
  router.post('/qq/connect', authorize({ required: true }), qq.connect);
  router.post('/qq/login_and_connect', qq.loginAndConnect);
  router.get('/credential/list', authorize({ required: true }), credential.list);
  router.post('/credential/add', authorize({ required: true }), credential.add);
  router.post('/credential/update', authorize({ required: true }), credential.update);
  router.post('/credential/remove', authorize({ required: true }), credential.remove);
  router.post('/credential/change_password', authorize({ required: true }), credential.changePassword);
  router.post('/verify/phone', verify.phone);
  router.post('/verify/email', verify.email);
  return router;
};
