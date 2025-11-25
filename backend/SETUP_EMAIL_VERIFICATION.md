# 邮箱验证功能快速设置指南

## 1. 安装依赖

```bash
npm install ioredis nodemailer
npm install --save-dev @types/nodemailer
```

## 2. 配置环境变量

编辑 `.env` 文件，添加以下配置：

```env
# Redis 配置
REDIS_HOST=potatofield.cn
REDIS_PORT=6379
REDIS_PASSWORD=Zzy1369299205560

# SMTP 邮箱配置
SMTP_HOST=smtp.exmail.qq.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=admin@potatofield.cn
SMTP_PASSWORD=s5ucrFdK8BpRJYXo
SMTP_FROM_NAME=物资管理系统
SMTP_FROM_EMAIL=admin@potatofield.cn
```

## 3. 启动服务

```bash
# 开发模式
npm run dev

# 生产模式
npm run build
npm start
```

## 4. 验证功能

### 测试 Redis 连接

启动服务后，查看日志：
```
✅ Redis 连接成功
✅ SMTP 服务器已就绪
```

### 测试注册流程

#### 步骤1：发送验证码

```bash
curl -X POST http://localhost:9702/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "your-email@example.com",
    "password": "test123456"
  }'
```

**预期响应**:
```json
{
  "success": true,
  "message": "验证码已发送到您的邮箱，请查收（有效期30分钟）",
  "data": {
    "email": "your-email@example.com",
    "expiresIn": 1800
  }
}
```

#### 步骤2：检查邮箱

查看邮箱收到的验证码邮件（包含6位数字验证码）

#### 步骤3：验证邮箱完成注册

```bash
curl -X POST http://localhost:9702/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "code": "123456"
  }'
```

**预期响应**:
```json
{
  "success": true,
  "message": "注册成功",
  "data": {
    "user": {
      "id": 1,
      "username": "testuser",
      "email": "your-email@example.com",
      "createdAt": "...",
      "updatedAt": "..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 测试重新发送验证码

```bash
curl -X POST http://localhost:9702/api/auth/resend-code \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com"
  }'
```

## 5. 检查 Redis 数据

使用 Redis CLI 查看存储的数据：

```bash
# 连接到 Redis
redis-cli -h potatofield.cn -p 6379 -a Zzy1369299205560

# 查看所有待验证用户
KEYS pending_user:*

# 查看所有验证码
KEYS verification:*

# 查看特定邮箱的数据
GET pending_user:your-email@example.com
GET verification:your-email@example.com

# 查看剩余有效时间（秒）
TTL verification:your-email@example.com
```

## 6. 故障排查

### 问题1: Redis 连接失败

**症状**: 启动时显示 "❌ Redis 连接错误"

**解决方案**:
1. 检查 `.env` 中的 Redis 配置是否正确
2. 确认 Redis 服务器可访问
3. 测试网络连接：`ping potatofield.cn`
4. 使用 Redis CLI 测试连接

### 问题2: 邮件发送失败

**症状**: 注册时提示 "发送验证邮件失败"

**解决方案**:
1. 检查 SMTP 配置是否正确
2. 确认 SMTP 密码没有过期
3. 查看服务器日志获取详细错误
4. 测试 SMTP 连接：
   ```javascript
   // 在 Node.js 中测试
   const nodemailer = require('nodemailer');
   const transporter = nodemailer.createTransport({
     host: 'smtp.exmail.qq.com',
     port: 465,
     secure: true,
     auth: {
       user: 'admin@potatofield.cn',
       pass: 's5ucrFdK8BpRJYXo'
     }
   });
   transporter.verify().then(console.log).catch(console.error);
   ```

### 问题3: 验证码无效

**可能原因**:
1. 验证码已过期（30分钟）
2. 验证码输入错误
3. Redis 数据被清除

**解决方案**:
1. 使用 `resend-code` 重新发送
2. 检查 Redis 中的数据是否存在
3. 确认验证码的 TTL 没有到期

### 问题4: 用户已存在

**症状**: 验证时提示 "用户名已被使用" 或 "邮箱已被注册"

**原因**: 在等待验证期间，该用户名或邮箱已被其他人注册

**解决方案**: 更换用户名或邮箱重新注册

## 7. 生产环境部署

### 使用 PM2

```bash
# 编译项目
npm run build

# 使用 PM2 启动
npm run pm2:start

# 或使用部署脚本
.\deploy.ps1  # Windows
./deploy.sh   # Linux/Mac
```

### 环境变量检查清单

- [ ] REDIS_HOST 已配置
- [ ] REDIS_PORT 已配置
- [ ] REDIS_PASSWORD 已配置
- [ ] SMTP_HOST 已配置
- [ ] SMTP_PORT 已配置
- [ ] SMTP_USER 已配置
- [ ] SMTP_PASSWORD 已配置
- [ ] SMTP_FROM_NAME 已配置
- [ ] SMTP_FROM_EMAIL 已配置

### 安全建议

1. **保护 .env 文件**: 确保 .env 不被提交到版本控制
2. **使用强密码**: Redis 和 SMTP 使用强密码
3. **限制 IP 访问**: 配置防火墙规则限制对 Redis 的访问
4. **HTTPS**: 生产环境使用 HTTPS
5. **速率限制**: 考虑添加全局速率限制防止滥用

## 8. 监控和日志

### 重要日志

启动时查看：
```
✅ Redis 连接成功
✅ SMTP 服务器已就绪
✅ 数据库连接成功
✅ 数据库模型同步成功
🚀 服务器运行在 http://localhost:9702
```

### 监控指标

- Redis 连接状态
- 邮件发送成功率
- 验证码验证成功率
- 注册完成率

### PM2 日志查看

```bash
# 查看所有日志
pm2 logs inventory-master-backend

# 查看错误日志
pm2 logs inventory-master-backend --err

# 查看输出日志
pm2 logs inventory-master-backend --out
```

## 9. 性能优化

### Redis 连接池

当前实现使用单一 Redis 连接，高并发场景下可以优化：

```javascript
// config/redis.ts
const redis = new Redis({
  // ... 现有配置
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  enableOfflineQueue: true,
});
```

### 邮件发送队列

如果邮件发送量大，可以考虑使用消息队列（如 Bull）：

```bash
npm install bull
```

## 10. 下一步

功能已完成！现在您可以：

1. ✅ 测试完整的注册流程
2. ✅ 集成到前端应用
3. ✅ 添加更多验证（如手机验证）
4. ✅ 实现找回密码功能
5. ✅ 添加邮件模板定制

---

## 快速命令参考

```bash
# 安装依赖
npm install ioredis nodemailer @types/nodemailer --save-dev

# 启动开发服务器
npm run dev

# 测试注册
curl -X POST http://localhost:9702/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"123456"}'

# 测试验证
curl -X POST http://localhost:9702/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","code":"123456"}'

# 重新发送
curl -X POST http://localhost:9702/api/auth/resend-code \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

---

如有问题，请查看 `EMAIL_VERIFICATION_API.md` 获取详细的 API 文档。
