# 快速开始指南 🚀

## 📋 前置准备

确保已安装：
- ✅ Node.js >= 14
- ✅ MySQL >= 5.7
- ✅ Redis >= 5.0
- ✅ Git

## ⚡ 5分钟部署

### 步骤1：数据库准备（2分钟）

```bash
# 1. 连接到MySQL
mysql -h potatofield.cn -u root -p

# 2. 执行时间字段迁移
mysql -h potatofield.cn -u root -p user < database_migrations/001_add_timestamp_fields.sql

# 3. 执行用户数据迁移（可选，如果有存量数据）
mysql -h potatofield.cn -u root -p < database_migrations/002_migrate_existing_users.sql
```

### 步骤2：后端部署（2分钟）

```bash
# 1. 安装依赖
cd backend
npm install canvas @types/canvas --save
npm install

# 2. 启动服务
npm run dev  # 开发环境
# 或
npm run build && npm run start  # 生产环境
```

### 步骤3：前端部署（1分钟）

```bash
cd frontend
npm install
npm run dev  # 开发环境
```

### 步骤4：验证部署

访问 http://localhost:9702/health 看到：
```json
{
  "status": "ok",
  "message": "服务运行正常"
}
```

## 🎯 快速测试

### 测试新版登录页

1. 访问：`http://localhost:5173/loginv2`
2. 点击"注册"标签
3. 输入邮箱、密码
4. 输入图形验证码
5. 点击"发送邮箱验证码"
6. 查收邮件获取验证码
7. 输入邮箱验证码
8. 点击"完成注册"
9. ✅ 注册成功！

### 测试登录

1. 访问：`http://localhost:5173/loginv2`
2. 点击"登录"标签
3. 输入邮箱/用户名和密码
4. 点击"登录"
5. ✅ 登录成功！

### 测试图形验证码

访问：`http://localhost:9702/api/v2/auth/captcha`

返回：
```json
{
  "success": true,
  "data": {
    "token": "abc123...",
    "image": "data:image/png;base64,..."
  }
}
```

## 🔧 常见问题

### Q: canvas安装失败？
A: 
```bash
# Windows
npm install --global windows-build-tools
npm install canvas

# Mac
brew install pkg-config cairo pango libpng jpeg giflib librsvg
npm install canvas

# Linux
sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
npm install canvas
```

### Q: 数据库连接失败？
A: 检查 `backend/.env` 中的数据库配置：
```env
DB_HOST=potatofield.cn
DB_PORT=3306
DB_USER=root
DB_PASSWORD=你的密码
```

### Q: Redis连接失败？
A: 检查 `backend/.env` 中的Redis配置：
```env
REDIS_HOST=potatofield.cn
REDIS_PORT=6379
REDIS_PASSWORD=你的密码
```

### Q: 邮件发送失败？
A: 检查 `backend/.env` 中的SMTP配置：
```env
SMTP_HOST=smtp.exmail.qq.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=admin@potatofield.cn
SMTP_PASSWORD=你的密码
```

## 📚 下一步

- 📖 阅读 [部署指南](DEPLOYMENT_GUIDE.md) 了解详细配置
- ✅ 执行 [测试清单](TESTING_CHECKLIST.md) 验证功能
- 📝 查看 [改造总结](MIGRATION_SUMMARY.md) 了解架构

## 🎉 完成！

你的统一用户认证系统已经就绪！现在可以：
- ✨ 使用邮箱注册登录
- 🔐 使用图形验证码保护
- 🌐 使用微信/QQ第三方登录
- 👥 管理统一的用户数据

---

**需要帮助？** 查看完整文档或提出Issue。
