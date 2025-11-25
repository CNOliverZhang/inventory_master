# 邮箱验证功能 API 文档

## 概述

用户注册流程已升级为两步验证：
1. **发送验证码**：用户提交注册信息，系统发送验证码到邮箱
2. **验证邮箱**：用户输入验证码完成注册

验证码有效期为 **30分钟**，使用 Redis 存储临时数据。

---

## API 接口

### 1. 注册 - 发送验证码

**接口**: `POST /api/auth/register`

**描述**: 提交注册信息，系统验证后发送验证码到用户邮箱

**请求体**:
```json
{
  "username": "testuser",
  "email": "user@example.com",
  "password": "password123"
}
```

**成功响应** (200):
```json
{
  "success": true,
  "message": "验证码已发送到您的邮箱，请查收（有效期30分钟）",
  "data": {
    "email": "user@example.com",
    "expiresIn": 1800
  }
}
```

**错误响应**:
- **400 Bad Request**: 缺少必填字段、格式错误、用户名或邮箱已存在
- **500 Internal Server Error**: 发送邮件失败或服务器错误

**验证规则**:
- 用户名：3-50 个字符
- 密码：至少 6 位
- 邮箱：有效的邮箱格式

---

### 2. 验证邮箱并完成注册

**接口**: `POST /api/auth/verify-email`

**描述**: 提交验证码完成注册

**请求体**:
```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

**成功响应** (201):
```json
{
  "success": true,
  "message": "注册成功",
  "data": {
    "user": {
      "id": 1,
      "username": "testuser",
      "email": "user@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**错误响应**:
- **400 Bad Request**: 
  - 缺少必填字段
  - 验证码错误或已过期
  - 用户名或邮箱已被占用（并发注册）
- **500 Internal Server Error**: 服务器错误

---

### 3. 重新发送验证码

**接口**: `POST /api/auth/resend-code`

**描述**: 重新发送验证码到用户邮箱

**请求体**:
```json
{
  "email": "user@example.com"
}
```

**成功响应** (200):
```json
{
  "success": true,
  "message": "验证码已重新发送",
  "data": {
    "email": "user@example.com",
    "expiresIn": 1800
  }
}
```

**错误响应**:
- **400 Bad Request**: 未找到待验证的注册信息
- **429 Too Many Requests**: 发送过于频繁（60秒内不能重复发送）
- **500 Internal Server Error**: 发送邮件失败

**限流说明**:
- 每次发送验证码后，需等待至少 60 秒才能重新发送
- 系统会返回 `retryAfter` 字段告知需要等待的秒数

---

### 4. 用户登录

**接口**: `POST /api/auth/login`

**描述**: 用户登录（与之前相同，无变化）

**请求体**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**成功响应** (200):
```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "user": {
      "id": 1,
      "username": "testuser",
      "email": "user@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 注册流程示例

### 完整流程

```javascript
// 1. 用户提交注册信息
const registerResponse = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'testuser',
    email: 'user@example.com',
    password: 'password123'
  })
});

// 2. 用户收到邮件中的验证码（例如：123456）

// 3. 用户输入验证码完成注册
const verifyResponse = await fetch('/api/auth/verify-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    code: '123456'
  })
});

const { data } = await verifyResponse.json();
// data.token 可用于后续 API 调用
// data.user 包含用户信息
```

### 重新发送验证码

```javascript
const resendResponse = await fetch('/api/auth/resend-code', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com'
  })
});
```

---

## Redis 数据结构

### 待验证用户数据

**Key**: `pending_user:{email}`

**Value**: 
```json
{
  "username": "testuser",
  "email": "user@example.com",
  "password": "hashedpassword"
}
```

**TTL**: 1800 秒（30分钟）

### 验证码

**Key**: `verification:{email}`

**Value**: `"123456"` （6位数字）

**TTL**: 1800 秒（30分钟）

---

## 邮件模板

验证码邮件包含：
- 精美的 HTML 模板
- 青蓝色渐变主题（与系统UI一致）
- 6位数字验证码
- 有效期提示（30分钟）
- 安全提示

---

## 环境配置

### Redis 配置

```env
REDIS_HOST=potatofield.cn
REDIS_PORT=6379
REDIS_PASSWORD=Zzy1369299205560
```

### SMTP 邮箱配置

```env
SMTP_HOST=smtp.exmail.qq.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=admin@potatofield.cn
SMTP_PASSWORD=s5ucrFdK8BpRJYXo
SMTP_FROM_NAME=物资管理系统
SMTP_FROM_EMAIL=admin@potatofield.cn
```

---

## 错误处理

### 常见错误

1. **验证码错误或已过期**
   - 提示用户重新发送验证码
   - 检查 Redis 中的数据是否存在

2. **邮件发送失败**
   - 检查 SMTP 配置是否正确
   - 查看服务器日志获取详细错误信息
   - 验证 SMTP 服务器连接状态

3. **并发注册**
   - 验证时再次检查用户名和邮箱
   - 提示用户使用不同的用户名或邮箱

4. **频繁发送**
   - 实施60秒冷却时间
   - 返回 429 状态码和重试时间

---

## 安全考虑

1. **验证码强度**: 6位随机数字，100万种组合
2. **有效期限制**: 30分钟自动过期
3. **发送频率限制**: 60秒内不能重复发送
4. **数据加密**: 密码在存储前已加密（bcrypt）
5. **并发保护**: 验证时再次检查用户名和邮箱
6. **自动清理**: Redis TTL 自动删除过期数据

---

## 测试建议

### 单元测试

- 验证码生成测试
- Redis 存储和读取测试
- 邮件发送测试
- 验证码验证逻辑测试

### 集成测试

- 完整注册流程测试
- 重新发送验证码测试
- 验证码过期测试
- 并发注册测试

### 手动测试

```bash
# 1. 注册并发送验证码
curl -X POST http://localhost:9702/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"123456"}'

# 2. 验证邮箱
curl -X POST http://localhost:9702/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","code":"123456"}'

# 3. 重新发送验证码
curl -X POST http://localhost:9702/api/auth/resend-code \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

---

## 依赖包

新增依赖：
- `ioredis`: Redis 客户端
- `nodemailer`: 邮件发送库

安装命令：
```bash
npm install ioredis nodemailer
npm install --save-dev @types/nodemailer
```

---

## 维护建议

1. **监控邮件发送成功率**
2. **定期清理 Redis 中的过期数据**（自动完成）
3. **记录邮件发送日志**用于调试
4. **配置邮件发送限额**防止滥用
5. **定期更新 SMTP 密码**
6. **监控 Redis 连接状态**

---

## 未来扩展

1. **短信验证码**作为备选方案
2. **找回密码**功能使用相同验证机制
3. **双因素认证 (2FA)**
4. **更换邮箱**验证
5. **邮件模板自定义**
6. **多语言邮件支持**

---

更新时间: 2024-01-01
版本: 1.0.0
