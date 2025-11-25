import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

// 创建 Redis 客户端
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
});

// 连接成功
redis.on('connect', () => {
  console.log('✅ Redis 连接成功');
});

// 连接错误
redis.on('error', (err) => {
  console.error('❌ Redis 连接错误:', err);
});

// 导出 Redis 客户端
export default redis;
