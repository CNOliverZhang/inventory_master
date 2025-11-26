const Router = require('koa-router');
const profile = require('../handlers/user/profile');

module.exports = ({ authorize }) => {
  const router = new Router({
    prefix: '/user',
  });
  router.get('/profile/detail', authorize(), profile.get);
  router.post('/profile/update', authorize({ required: true }), profile.update);
  router.post('/profile/upload_avatar', authorize({ required: true }), profile.uploadAvatar);
  router.post('/profile/delete_avatar', authorize({ required: true }), profile.deleteAvatar);
  return router;
};
