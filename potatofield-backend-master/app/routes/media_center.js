const Router = require('koa-router');

const file = require('../handlers/media_center/file');
const tag = require('../handlers/media_center/tag');

module.exports = ({ authorize }) => {
  const router = new Router({
    prefix: '/media_center',
  });
  router.get('/file/detail', authorize({ adminOnly: true }), file.get);
  router.get('/file/list', authorize({ adminOnly: true }), file.list);
  router.post('/file/add', authorize({ adminOnly: true }), file.add);
  router.post('/file/update', authorize({ adminOnly: true }), file.update);
  router.post('/file/remove', authorize({ adminOnly: true }), file.remove);
  router.post('/file/add_tag', authorize({ adminOnly: true }), file.addTag);
  router.post('/file/remove_tag', authorize({ adminOnly: true }), file.removeTag);
  router.post('/file/clear_tags', authorize({ adminOnly: true }), file.clearTags);
  router.get('/tag/list', authorize({ adminOnly: true }), tag.list);
  router.post('/tag/add', authorize({ adminOnly: true }), tag.add);
  router.post('/tag/remove', authorize({ adminOnly: true }), tag.remove);
  return router;
};
