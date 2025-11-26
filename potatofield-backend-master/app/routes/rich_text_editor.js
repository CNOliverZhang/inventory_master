const Router = require('koa-router');

const version = require('../handlers/rich_text_editor/version');
const client = require('../handlers/rich_text_editor/client');
const theme = require('../handlers/rich_text_editor/theme');

module.exports = ({ authorize }) => {
  const router = new Router({
    prefix: '/rich_text_editor',
  });
  router.get('/theme/list', theme.list);
  router.post('/theme/add', authorize({ required: true }), theme.add);
  router.post('/theme/update', authorize({ required: true }), theme.update);
  router.post('/theme/remove', authorize({ required: true }), theme.remove);
  router.post('/version/add', authorize({ adminOnly: true }), version.add);
  router.get('/version/list', version.list);
  router.get('/version/latest', version.latest);
  router.post('/client/register', client.register);
  router.get('/client/count_new', authorize({ adminOnly: true }), client.countNew);
  router.get('/client/count_active', authorize({ adminOnly: true }), client.countActive);
  router.get('/client/count', authorize({ adminOnly: true }), client.count);
  return router;
};
