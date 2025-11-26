const Router = require('koa-router');

const article = require('../handlers/blog/article');
const category = require('../handlers/blog/category');
const tag = require('../handlers/blog/tag');

module.exports = ({ authorize }) => {
  const router = new Router({
    prefix: '/blog',
  });
  router.get('/article/detail', authorize({ adminOnly: false }), article.get);
  router.get('/article/list', authorize({ adminOnly: false }), article.list);
  router.post('/article/add', authorize({ adminOnly: true }), article.add);
  router.post('/article/update', authorize({ adminOnly: true }), article.update);
  router.post('/article/remove', authorize({ adminOnly: true }), article.remove);
  router.post('/article/add_tag', authorize({ adminOnly: true }), article.addTag);
  router.post('/article/remove_tag', authorize({ adminOnly: true }), article.removeTag);
  router.post('/article/export_to_wechat', authorize({ adminOnly: true }), article.exportToWechat);
  router.get('/article/get_tags', article.getTags);
  router.post('/article/clear_tags', authorize({ adminOnly: true }), article.clearTags);
  router.get('/category/list', category.list);
  router.get('/category/get_tree', category.getTree);
  router.post('/category/add', authorize({ adminOnly: true }), category.add);
  router.post('/category/update', authorize({ adminOnly: true }), category.update);
  router.post('/category/remove', authorize({ adminOnly: true }), category.remove);
  router.get('/tag/list', tag.list);
  router.post('/tag/add', authorize({ adminOnly: true }), tag.add);
  router.post('/tag/remove', authorize({ adminOnly: true }), tag.remove);
  return router;
};
