/*
 * @Author: CNOliverZhang cnoliverzhang@gmail.com
 * @Date: 2024-01-22 20:13:52
 * @LastEditors: CNOliverZhang cnoliverzhang@gmail.com
 * @LastEditTime: 2024-01-22 20:14:21
 * @FilePath: /potatofield-backend/app/routes/image_notebook.js
 * @Description: 
 */
const Router = require('koa-router');

const version = require('../handlers/image_notebook/version');
const client = require('../handlers/image_notebook/client');

module.exports = ({ authorize }) => {
  const router = new Router({
    prefix: '/image_notebook',
  });
  router.post('/version/add', authorize({ adminOnly: true }), version.add);
  router.get('/version/list', version.list);
  router.get('/version/latest', version.latest);
  router.post('/client/register', client.register);
  router.get('/client/count_new', authorize({ adminOnly: true }), client.countNew);
  router.get('/client/count_active', authorize({ adminOnly: true }), client.countActive);
  router.get('/client/count', authorize({ adminOnly: true }), client.count);
  return router;
};
