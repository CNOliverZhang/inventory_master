const Router = require('koa-router');

const ImageToolkitClient = require('../handlers/image_toolkit/client');
const old = require('../old');

module.exports = () => {
  const router = new Router();
  router.get('/imagetoolkit/versions', old.getVersionList);
  router.get('/imagetoolkit/messages', old.getMessageList);
  router.get('/fontlibrary/fonts', old.getFontList);
  router.post('/imagetoolkit/register', ImageToolkitClient.register);
  return router;
};
