const Sequelize = require('sequelize');

const initModels = require('../models/init_models');

module.exports = (dbConfig) => async (ctx, next) => {
  const db = {};
  const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    port: dbConfig.port,
    define: {
      timestamps: false,
    },
    dialect: dbConfig.dialect,
    timezone: '+08:00',
  });
  const models = initModels(sequelize);
  Object.keys(models).forEach((modelName) => {
    db[modelName] = models[modelName];
  });
  ctx.db = db;
  ctx.sequelize = sequelize;
  await next();
};
