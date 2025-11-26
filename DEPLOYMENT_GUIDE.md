# 统一用户认证系统 - 部署指南

## 📋 概述

本项目已完成站群统一用户认证系统的集成，支持：

- ✅ 邮箱/用户名/手机号登录
- ✅ 邮箱注册（带邮箱验证码）
- ✅ 图形验证码（替代vaptcha）
- ✅ 微信登录（跨域名OAuth回调）
- ✅ QQ登录（跨域名OAuth回调）
- ✅ 统一用户数据库（user数据库）

## 🗂️ 数据库结构

### user 数据库

#### Auth_user 表（用户主表）
```sql
- id: 用户ID（主键）
- is_admin: 是否管理员
- created_at: 创建时间
- last_login_at: 最后登录时间
```

#### Auth_credential 表（认证凭据表）
```sql
- id: 凭据ID（主键）
- user_id: 用户ID（外键）
- auth_type: 认证类型（1=用户名,2=手机,3=邮箱,4=微信,5=QQ）
- identifier: 识别符（邮箱/用户名/手机号/UnionID）
- credential: 凭据（密码哈希或NULL）
- created_at: 创建时间
- updated_at: 更新时间
```

#### User_profile 表（用户资料表）
```sql
- user_id: 用户ID（主键、外键）
- nickname: 昵称
- avatar: 头像URL
- intro: 个人简介
- created_at: 创建时间
- updated_at: 更新时间
```

## 📦 部署步骤

### 1. 数据库迁移

执行数据库变更SQL：

```bash
mysql -h potatofield.cn -u root -p user < database_migrations/001_add_timestamp_fields.sql
```

### 2. 安装后端依赖

#### inventory_master 后端
```bash
cd backend
npm install canvas @types/canvas --save
npm install
```

#### 站群后端
```bash
cd potatofield-backend-master
npm install  # canvas已在package.json中
```

### 3. 配置环境变量

确保 `backend/.env` 中包含：

```env
# 数据库配置（业务数据库）
DB_HOST=potatofield.cn
DB_PORT=3306
DB_NAME=inventory_master
DB_USER=root
DB_PASSWORD=你的密码

# 注意：user数据库使用相同的连接信息，数据库名固定为 user
```

### 4. 启动服务

#### inventory_master 后端
```bash
cd backend
npm run dev      # 开发环境
npm run build    # 生产环境构建
npm run start    # 生产环境启动
```

#### 站群后端
```bash
cd potatofield-backend-master
npm start
```

#### inventory_master 前端
```bash
cd frontend
npm install
npm run dev
```

## 🔄 OAuth 回调流程

### 微信/QQ登录流程

1. 用户在 `inventory-master.potatofield.cn` 点击第三方登录
2. 跳转到 `potatofield.cn/oauth/callback?return_url=...`
3. 站群OAuth回调页面接收code
4. 携带code跳转回 `inventory-master.potatofield.cn/login?code=xxx&state=wechat`
5. inventory_master前端调用站群后端API完成登录

### 配置要点

在微信/QQ开放平台配置的回调域名：
- **微信**: `potatofield.cn`
- **QQ**: `potatofield.cn`

## 🎯 API 端点

### 新版认证API（推荐）

基础路径：`/api/v2/auth`

- `GET /captcha` - 获取图形验证码
- `POST /send-email-code` - 发送邮箱验证码
- `POST /register` - 用户注册
- `POST /login` - 用户登录
- `GET /me` - 获取当前用户信息（需认证）

### 旧版认证API（向后兼容）

基础路径：`/api/auth`

- `POST /register` - 用户注册（邮箱验证码）
- `POST /verify-email` - 验证邮箱
- `POST /resend-code` - 重发验证码
- `POST /login` - 用户登录
- `GET /me` - 获取当前用户信息

## 🔐 认证方式优先级

1. **邮箱登录**：使用邮箱+密码
2. **用户名登录**：使用用户名+密码（需先设置用户名）
3. **手机登录**：使用手机号+密码（需先设置手机号）
4. **微信登录**：OAuth授权
5. **QQ登录**：OAuth授权

## 📝 前端路由

### inventory_master
- `/login` - 登录页（旧版）
- `/loginv2` - 登录页（新版，推荐）

### 站群（potatofield）
- `/oauth/callback` - OAuth回调处理页

## 🛠️ 开发注意事项

### 1. 数据库连接

inventory_master后端使用两个数据库连接：
- `sequelize` - 业务数据库（inventory_master）
- `userSequelize` - 用户数据库（user）

### 2. Token管理

- JWT Token 包含用户ID和基本信息
- 存储在 localStorage
- 请求头格式：`Authorization: Bearer <token>`

### 3. 图形验证码

- 使用canvas生成
- 存储在Redis，有效期5分钟
- 验证成功后自动删除

### 4. 邮箱验证码

- 有效期5分钟
- 60秒内不可重复发送
- 验证成功后自动删除

## 🔍 故障排查

### 图形验证码不显示
1. 检查canvas依赖是否安装：`npm list canvas`
2. 检查Redis连接是否正常
3. 查看后端日志

### OAuth回调失败
1. 确认回调域名配置正确
2. 检查return_url参数是否正确编码
3. 查看站群前端OAuth/Callback组件日志

### 数据库连接失败
1. 检查.env配置
2. 确认user数据库已创建
3. 确认时间字段已添加（执行SQL迁移脚本）

## 📊 数据迁移

### 从旧版用户表迁移到新版

**注意**：目前旧版（inventory_master.users）和新版（user.Auth_*）是并存的，建议：

1. 新用户使用新版API（/api/v2/auth）
2. 旧用户可继续使用旧版API（/api/auth）
3. 逐步引导用户迁移到新版系统

迁移脚本示例：
```sql
-- 迁移用户数据（示例，需根据实际情况调整）
INSERT INTO user.Auth_user (is_admin, created_at)
SELECT 0, created_at FROM inventory_master.users;

INSERT INTO user.Auth_credential (user_id, auth_type, identifier, credential)
SELECT 
  u2.id,
  3, -- EMAIL
  u1.email,
  u1.password
FROM inventory_master.users u1
JOIN user.Auth_user u2 ON u1.id = u2.id;

INSERT INTO user.User_profile (user_id, nickname)
SELECT u2.id, u1.username
FROM inventory_master.users u1
JOIN user.Auth_user u2 ON u1.id = u2.id;
```

## 🎉 完成

部署完成后，访问：
- 业务系统：`http://inventory-master.potatofield.cn`
- 新版登录页：`http://inventory-master.potatofield.cn/loginv2`

## 📞 支持

如遇问题，请查看：
1. 后端日志：`pm2 logs inventory-master-backend`
2. 数据库连接状态
3. Redis连接状态
