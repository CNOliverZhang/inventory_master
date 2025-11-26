const isDev = process.env.NODE_ENV === 'development';

const production = {
  username: '用户名',
  password: '密码',
  database: '生产数据库',
  host: '数据库地址',
  port: '3306',
  dialect: 'mysql',
};

const development = {
  username: '用户名',
  password: '密码',
  database: '测试数据库',
  host: '数据库地址',
  port: '3306',
  dialect: 'mysql',
};

module.exports = isDev ? development : production;
