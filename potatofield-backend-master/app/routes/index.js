const compose = require('koa-compose');
const path = require('path');
const fs = require('fs');

module.exports = ({ authorize }) => {
  const routers = [];
  const filenames = fs.readdirSync(__dirname);
  filenames.filter((filename) => filename.endsWith('.js') && filename !== 'index.js')
    .forEach((filename) => {
      const getRouter = require(path.join(__dirname, filename));
      const router = getRouter({ authorize });
      routers.push(router.routes());
      routers.push(router.allowedMethods());
    });
  return compose(routers);
};
