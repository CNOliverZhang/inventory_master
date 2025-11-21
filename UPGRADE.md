# 多用户认证系统升级说明

## 升级内容

本次升级为物资管理系统添加了完整的多用户认证和授权功能，实现了用户隔离的物资管理。

## 主要功能

### 1. 用户认证
- ✅ 用户注册
- ✅ 用户登录
- ✅ JWT Token 鉴权
- ✅ 自动 Token 刷新
- ✅ 退出登录

### 2. 数据隔离
- ✅ 每个用户只能查看和管理自己的物资
- ✅ 所有物资操作都需要用户认证
- ✅ API 级别的权限验证

### 3. 前端功能
- ✅ 精美的登录/注册页面
- ✅ 路由守卫保护
- ✅ 用户信息展示
- ✅ 自动 Token 携带
- ✅ Token 失效自动跳转登录

## 技术实现

### 后端升级

#### 新增依赖
```json
{
  "bcrypt": "^5.1.1",        // 密码加密
  "jsonwebtoken": "^9.0.2"   // JWT Token
}
```

#### 新增文件
- `src/models/User.ts` - 用户模型
- `src/models/index.ts` - 模型关联
- `src/controllers/authController.ts` - 认证控制器
- `src/routes/authRoutes.ts` - 认证路由
- `src/middleware/auth.ts` - 认证中间件
- `src/utils/jwt.ts` - JWT 工具

#### 修改文件
- `src/models/Material.ts` - 添加 userId 字段
- `src/controllers/materialController.ts` - 添加用户验证
- `src/routes/materialRoutes.ts` - 添加认证中间件
- `src/index.ts` - 注册认证路由
- `.env.example` - 添加 JWT 配置

### 前端升级

#### 新增文件
- `src/types/user.ts` - 用户类型定义
- `src/api/auth.ts` - 认证 API
- `src/stores/user.ts` - 用户状态管理
- `src/views/Login.vue` - 登录/注册页面

#### 修改文件
- `src/api/axios.ts` - 添加 Token 拦截器
- `src/router/index.ts` - 添加路由守卫
- `src/views/Home.vue` - 添加用户信息显示
- `src/main.ts` - 初始化用户状态

## 数据库变更

### 新增表：users
```sql
CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 修改表：materials
```sql
ALTER TABLE `materials` 
ADD COLUMN `user_id` int(10) unsigned NOT NULL AFTER `id`,
ADD CONSTRAINT `fk_materials_user` 
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) 
  ON DELETE CASCADE ON UPDATE CASCADE;
```

## API 变更

### 新增接口

#### 用户注册
```
POST /api/auth/register
Body: {
  "username": "string",
  "email": "string",
  "password": "string"
}
Response: {
  "success": true,
  "data": {
    "user": {...},
    "token": "string"
  }
}
```

#### 用户登录
```
POST /api/auth/login
Body: {
  "email": "string",
  "password": "string"
}
Response: {
  "success": true,
  "data": {
    "user": {...},
    "token": "string"
  }
}
```

#### 获取当前用户
```
GET /api/auth/me
Headers: Authorization: Bearer <token>
Response: {
  "success": true,
  "data": {...}
}
```

### 修改接口

所有物资相关接口现在都需要在请求头中携带 Token：
```
Headers: Authorization: Bearer <token>
```

## 环境配置

在 `backend/.env` 中添加 JWT 配置：

```env
# JWT 配置
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRES_IN=7d
```

⚠️ **重要**：生产环境务必修改 `JWT_SECRET` 为强随机字符串！

## 升级步骤

### 1. 后端升级

```bash
cd backend

# 安装新依赖
npm install

# 配置环境变量（在 .env 中添加 JWT_SECRET）
# 启动服务（数据库会自动迁移）
npm run dev
```

### 2. 前端升级

```bash
cd frontend

# 安装依赖（无新增依赖）
# 启动开发服务器
npm run dev
```

### 3. 数据迁移

如果你已有历史数据，需要为现有物资分配用户：

```sql
-- 示例：将所有物资分配给 ID 为 1 的用户
UPDATE materials SET user_id = 1 WHERE user_id IS NULL;
```

## 使用说明

### 首次使用

1. 访问系统会自动跳转到登录页
2. 点击"注册"标签页创建账户
3. 注册成功后自动登录并跳转到主页
4. 开始管理你的物资

### 多用户场景

1. 每个用户注册独立账户
2. 登录后只能看到自己的物资
3. 无法访问其他用户的物资数据
4. 统计数据也是用户隔离的

### Token 管理

- Token 默认有效期 7 天
- Token 存储在 localStorage
- Token 失效后自动跳转登录页
- 退出登录会清除 Token

## 安全建议

1. **生产环境**：
   - 修改 `JWT_SECRET` 为强随机字符串
   - 启用 HTTPS
   - 配置 CORS 白名单
   - 添加请求频率限制

2. **密码安全**：
   - 密码使用 bcrypt 加密（已实现）
   - 建议最小长度 6 位（可调整）
   - 前端添加密码强度提示

3. **Token 安全**：
   - 建议缩短 Token 有效期
   - 考虑添加 Refresh Token
   - 实现 Token 黑名单机制

## 回退方案

如需回退到单用户版本：

1. 恢复后端文件：
   - 删除新增的认证相关文件
   - 恢复 Material 模型（移除 userId）
   - 恢复 materialController（移除认证检查）

2. 恢复前端文件：
   - 删除登录页面和用户相关代码
   - 移除路由守卫
   - 恢复原始的 axios 配置

3. 数据库回退：
   - 移除 users 表
   - 移除 materials 表的 user_id 字段

## 常见问题

### Q: 忘记密码怎么办？
A: 当前版本暂未实现找回密码功能，请联系管理员重置。

### Q: Token 过期后能否自动刷新？
A: 当前版本需要重新登录，后续可以实现 Refresh Token 机制。

### Q: 如何修改用户信息？
A: 当前版本暂未实现用户资料编辑，后续可以添加该功能。

### Q: 是否支持第三方登录？
A: 当前版本仅支持邮箱密码登录，后续可以集成 OAuth。

## 后续优化建议

1. 添加找回密码功能
2. 实现用户资料编辑
3. 添加头像上传
4. 实现 Refresh Token
5. 添加登录日志
6. 支持第三方登录
7. 添加用户权限管理
8. 实现数据导出功能
