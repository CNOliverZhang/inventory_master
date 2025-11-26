import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// 连接到 user 数据库（站群统一用户管理数据库）
const userSequelize = new Sequelize(
  'user', // 固定使用 user 数据库
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    dialect: 'mysql',
    logging: false,
    timezone: '+08:00',
    define: {
      timestamps: false, // user数据库的表自己管理时间字段
      underscored: true,
    },
  }
);

export default userSequelize;
