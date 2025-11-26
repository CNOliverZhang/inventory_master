const Router = require('koa-router');

const version = require('../handlers/image_toolkit/version');
const client = require('../handlers/image_toolkit/client');
const message = require('../handlers/image_toolkit/message');
const tool = require('../handlers/image_toolkit/tool');

module.exports = ({ authorize }) => {
  const router = new Router({
    prefix: '/image_toolkit',
  });
  router.get('/tool/list', tool.list);
  router.post('/tool/add', authorize({ adminOnly: true }), tool.add);
  router.post('/tool/update', authorize({ adminOnly: true }), tool.update);
  router.post('/tool/remove', authorize({ adminOnly: true }), tool.remove);
  router.post('/version/add', authorize({ adminOnly: true }), version.add);
  router.get('/version/list', version.list);
  router.get('/version/latest', version.latest);
  router.post('/client/register', client.register);
  router.get('/client/count_new', authorize({ adminOnly: true }), client.countNew);
  router.get('/client/count_active', authorize({ adminOnly: true }), client.countActive);
  router.get('/client/count', authorize({ adminOnly: true }), client.count);
  router.get('/message/list', message.list);
  router.get('/message/latest', message.latest);
  router.post('/message/add', authorize({ adminOnly: true }), message.add);
  router.post('/message/update', authorize({ adminOnly: true }), message.update);
  router.post('/message/remove', authorize({ adminOnly: true }), message.remove);
  return router;
};
