const redis = require('redis');

module.exports = (redisConfig) => async (ctx, next) => {
  const client = redis.createClient({
    socket: {
      host: redisConfig.host,
      port: redisConfig.port,
    },
    password: redisConfig.password,
  });
  
  await client.connect();
  
  ctx.redis = {
    get: async (key) => {
      return await client.get(key);
    },
    set: async (key, value) => {
      return await client.set(key, value);
    },
    expire: async (key, expire) => {
      return await client.expire(key, expire);
    },
    del: async (key) => {
      return await client.del(key);
    },
  };
  
  await next();
  
  // Close connection after request
  await client.quit();
};
