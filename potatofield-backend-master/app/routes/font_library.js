const Router = require('koa-router');
const font = require('../handlers/font_library/font');
const fontFamily = require('../handlers/font_library/font_family');
const fontStyle = require('../handlers/font_library/font_style');

module.exports = ({ authorize }) => {
  const router = new Router({
    prefix: '/font_library',
  });
  router.get('/font/list', font.list);
  router.post('/font/add', authorize({ required: true }), font.add);
  router.post('/font/update', authorize({ required: true }), font.update);
  router.post('/font/remove', authorize({ required: true }), font.remove);
  router.get('/font/random', font.random);
  router.get('/font_family/list', fontFamily.list);
  router.post('/font_family/add', authorize({ required: true }), fontFamily.add);
  router.post('/font_family/update', authorize({ required: true }), fontFamily.update);
  router.post('/font_family/remove', authorize({ required: true }), fontFamily.remove);
  router.get('/font_style/list', fontStyle.list);
  return router;
};
