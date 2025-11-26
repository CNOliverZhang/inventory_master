import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database';
import userSequelize from './config/userDatabase';
import redis from './config/redis';
import authRoutes from './routes/authRoutes';
import authV2Routes from './routes/authV2Routes';
import materialRoutes from './routes/materialRoutes';
import categoryRoutes from './routes/categoryRoutes';
import './models'; // 导入模型以建立关联
import './models/auth'; // 导入用户认证模型

dotenv.config();

const app = express();
const PORT = process.env.PORT || 9702;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
app.use('/api/auth', authRoutes); // 旧版认证路由（向后兼容）
app.use('/api/v2/auth', authV2Routes); // 新版认证路由（使用user数据库）
app.use('/api', materialRoutes);
app.use('/api', categoryRoutes);

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: '服务运行正常' });
});

// 错误处理中间件
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || '服务器内部错误',
  });
});

// 数据库连接和服务启动
const startServer = async () => {
  try {
    // 测试业务数据库连接
    await sequelize.authenticate();
    console.log('✅ 业务数据库连接成功 (inventory_master)');

    // 测试用户数据库连接
    await userSequelize.authenticate();
    console.log('✅ 用户数据库连接成功 (user)');

    // 同步业务数据库模型（开发环境）
    await sequelize.sync({ alter: false });
    console.log('✅ 业务数据库模型同步成功');

    // 不同步用户数据库（由站群统一管理）
    console.log('ℹ️  用户数据库由站群统一管理，不执行模型同步');

    // 启动服务器
    app.listen(PORT, () => {
      console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ 启动服务器失败:', error);
    process.exit(1);
  }
};

startServer();
