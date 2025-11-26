# 站群统一用户认证系统 - 改造总结

## 🎯 改造目标

将 inventory_master 项目的简单单表用户认证系统升级为站群统一的多认证方式系统。

## ✨ 改造成果

### 1. 数据库层面

#### 原有架构
```
inventory_master 数据库
└── users 表
    ├── id
    ├── username
    ├── email
    ├── password
    ├── created_at
    └── updated_at
```

#### 新架构（站群统一）
```
user 数据库
├── Auth_user (用户主表)
│   ├── id
│   ├── is_admin
│   ├── created_at ⭐ 新增
│   └── last_login_at ⭐ 新增
│
├── Auth_credential (认证凭据表)
│   ├── id
│   ├── user_id
│   ├── auth_type (1=用户名, 2=手机, 3=邮箱, 4=微信, 5=QQ)
│   ├── identifier
│   ├── credential
│   ├── created_at ⭐ 新增
│   └── updated_at ⭐ 新增
│
└── User_profile (用户资料表)
    ├── user_id
    ├── nickname
    ├── avatar
    ├── intro
    ├── created_at ⭐ 新增
    └── updated_at ⭐ 新增
```

#### 变更说明
- **非破坏性变更**：只添加字段，不删除现有字段
- **时间字段**：为三张表都添加了创建和更新时间
- **存量数据**：时间字段默认设置为今天0点

### 2. 认证方式升级

| 功能 | 旧版 | 新版 |
|------|------|------|
| 注册方式 | 邮箱 | 邮箱、手机号（预留） |
| 登录方式 | 邮箱 | 邮箱/用户名/手机号 |
| 第三方登录 | ❌ | ✅ 微信、QQ |
| 反机器人 | ❌ | ✅ 图形验证码 |
| 邮箱验证 | ✅ | ✅ |
| 验证码服务 | 自建 | 自建（图形验证码） |

### 3. 技术栈

#### 后端
**inventory_master 后端**
- TypeScript + Express + Sequelize
- 新增：canvas（图形验证码生成）
- 新增：双数据库连接（inventory_master + user）

**站群后端（potatofield）**
- JavaScript + Koa + Sequelize
- 新增：图形验证码服务
- 替换：vaptcha → 自建图形验证码

#### 前端
**inventory_master 前端**
- Vue 3 + TypeScript
- 新增：图形验证码组件
- 新增：第三方登录支持
- 新增：OAuth回调处理

**站群前端（potatofield）**
- React + TypeScript
- 新增：OAuth回调中转页面
- 新增：跨域名参数传递

## 📁 文件清单

### 新增文件

#### inventory_master 项目

**数据库迁移**
```
database_migrations/
├── 001_add_timestamp_fields.sql       # 添加时间字段
└── 002_migrate_existing_users.sql     # 用户数据迁移
```

**后端**
```
backend/src/
├── config/
│   └── userDatabase.ts                # user数据库连接
├── models/auth/
│   ├── AuthUser.ts                    # 用户主表模型
│   ├── AuthCredential.ts              # 认证凭据模型
│   ├── UserProfile.ts                 # 用户资料模型
│   └── index.ts                       # 模型导出
├── services/
│   └── captchaService.ts              # 图形验证码服务
├── controllers/
│   └── authV2Controller.ts            # 新版认证控制器
└── routes/
    └── authV2Routes.ts                # 新版认证路由
```

**前端**
```
frontend/src/
├── api/
│   └── authV2.ts                      # 新版API接口
├── components/
│   └── CaptchaInput.vue               # 图形验证码组件
└── views/
    └── LoginV2.vue                    # 新版登录页面
```

**文档**
```
├── DEPLOYMENT_GUIDE.md                # 部署指南
├── TESTING_CHECKLIST.md               # 测试清单
├── MIGRATION_SUMMARY.md               # 改造总结（本文档）
└── INSTALL_DEPENDENCIES.md            # 依赖安装说明
```

#### 站群项目

**后端（potatofield-backend-master）**
```
app/
├── utils/captcha/
│   └── generate_captcha.js            # 图形验证码生成器
├── handlers/
│   ├── captcha/
│   │   └── index.js                   # 验证码处理器
│   └── auth/
│       └── verify_v2.js               # 新版验证码发送
└── routes/
    ├── captcha.js                     # 验证码路由
    └── auth.js                        # 更新：添加v2接口
```

**前端（potatofield-frontend-master）**
```
src/
├── Pages/OAuth/
│   └── Callback.tsx                   # OAuth回调页面
├── Utils/OAuthHelper/
│   └── index.tsx                      # OAuth辅助工具
└── routes.tsx                         # 更新：添加回调路由
```

### 修改文件

#### inventory_master
- `backend/src/index.ts` - 添加user数据库连接和v2路由
- `backend/.env` - 无需修改（使用相同DB配置）

#### 站群
- `potatofield-backend-master/app/models/Auth_user.js` - 添加时间字段
- `potatofield-backend-master/app/models/Auth_credential.js` - 添加时间字段
- `potatofield-backend-master/app/models/User_profile.js` - 添加时间字段
- `potatofield-backend-master/app/routes/auth.js` - 添加v2接口
- `potatofield-frontend-master/src/routes.tsx` - 添加OAuth回调路由

## 🔄 OAuth 跨域名回调方案

### 问题
微信和QQ的OAuth回调域名必须是在开放平台注册的域名（potatofield.cn），但inventory_master的域名是子域名（inventory-master.potatofield.cn）。

### 解决方案

```
1. 用户点击第三方登录
   ↓
2. 跳转到 potatofield.cn/oauth/callback?return_url=inventory-master.potatofield.cn/login
   ↓
3. OAuth回调页接收 code 和 state
   ↓
4. 携带参数跳转回 inventory-master.potatofield.cn/login?code=xxx&state=wechat
   ↓
5. inventory_master 调用站群API完成登录
   ↓
6. 获取token和用户信息
```

### 关键代码

**站群前端 - OAuth回调页**
```typescript
// src/Pages/OAuth/Callback.tsx
const returnUrl = decodeURIComponent(params.get('return_url'));
const redirectUrl = `${returnUrl}?code=${code}&state=${state}`;
window.location.href = redirectUrl;
```

**inventory_master 前端 - 生成OAuth URL**
```typescript
// src/api/authV2.ts
export const getWechatOAuthUrl = () => {
  const returnUrl = window.location.origin + '/login';
  const encodedReturnUrl = encodeURIComponent(returnUrl);
  return `https://potatofield.cn/oauth/callback?return_url=${encodedReturnUrl}`;
};
```

## 🔐 图形验证码方案

### 技术实现
- 使用 `canvas` 库在Node.js中生成验证码图片
- 生成4位随机字符（排除易混淆字符）
- 添加干扰线和干扰点
- 随机字体、颜色、旋转角度
- 转换为base64格式返回

### 存储机制
- 生成唯一token（MD5哈希）
- 验证码存储在Redis（key: `captcha:${token}`）
- 有效期5分钟
- 验证成功后自动删除（防重放）

### 替代vaptcha
**优势：**
- ✅ 无第三方依赖
- ✅ 自主可控
- ✅ 免费
- ✅ 可定制化

**对比：**
| 项目 | vaptcha | 图形验证码 |
|------|---------|-----------|
| 成本 | 收费 | 免费 |
| 依赖 | 第三方服务 | 自建 |
| 可用性 | 依赖第三方 | 完全自主 |
| 安全性 | 高 | 中等 |
| 用户体验 | 较好 | 一般 |

## 📊 数据迁移策略

### 原则
1. **非破坏性**：保留原有数据不变
2. **渐进式**：新旧系统并存
3. **可回滚**：提供回滚脚本

### 步骤
1. 添加时间字段到user数据库
2. 迁移用户主数据到Auth_user
3. 迁移邮箱认证凭据到Auth_credential
4. 迁移用户名认证凭据到Auth_credential
5. 创建用户资料到User_profile
6. 验证数据完整性

### 并存策略
- **旧API**：`/api/auth/*` 继续使用 inventory_master.users
- **新API**：`/api/v2/auth/*` 使用 user 数据库
- **推荐**：新用户使用新API，旧用户逐步迁移

## 🎨 用户界面改进

### 新版登录页（LoginV2.vue）
- ✨ 现代化设计
- 🎨 渐变背景
- 📱 响应式布局
- 🔒 图形验证码集成
- 🌐 第三方登录按钮
- ⏱️ 倒计时功能
- 💬 友好的错误提示

### 组件化
- `CaptchaInput.vue` - 可复用的验证码组件
- 自动刷新功能
- 输入验证
- 错误提示

## 📈 性能优化

1. **数据库**
   - 索引优化（identifier、user_id等）
   - 关联查询优化
   
2. **缓存**
   - Redis缓存验证码
   - 验证码有效期管理
   
3. **API**
   - JWT Token减少数据库查询
   - 响应数据精简

## 🔒 安全增强

1. **密码安全**
   - bcrypt加密（salt rounds = 10）
   - 密码强度验证（至少6位）

2. **验证码安全**
   - 图形验证码防暴力破解
   - 邮箱验证码防重放
   - 发送频率限制（60秒）
   - 自动过期机制（5分钟）

3. **Token安全**
   - JWT签名验证
   - Token过期处理
   - 刷新页面保持登录

## 🚀 部署要求

### 环境依赖
- Node.js >= 14
- MySQL >= 5.7
- Redis >= 5.0
- PM2（生产环境）

### 新增依赖
- canvas（图形验证码）
- @types/canvas（TypeScript类型）

### 配置要求
- 数据库连接信息
- Redis连接信息
- JWT密钥
- SMTP邮箱配置

## 📝 注意事项

### ⚠️ 重要提醒

1. **数据库备份**
   - 执行迁移前必须备份
   - 测试环境先验证
   
2. **不可破坏**
   - 不允许删除user数据库的任何数据
   - 不允许修改现有字段类型
   
3. **向后兼容**
   - 保留旧API接口
   - 新旧系统可并存
   
4. **OAuth配置**
   - 回调域名必须是potatofield.cn
   - 需要在微信/QQ开放平台配置

### 💡 最佳实践

1. **测试流程**
   - 开发环境 → 测试环境 → 生产环境
   - 完整执行测试清单
   
2. **监控告警**
   - 监控数据库连接
   - 监控Redis连接
   - 监控API响应时间
   
3. **日志记录**
   - 记录认证失败
   - 记录异常情况
   - 不记录敏感信息（密码、token等）

## ✅ 完成状态

所有改造任务已完成：

- [x] 数据库设计：为 user 数据库三张表添加时间字段
- [x] 实现图形验证码生成与验证服务
- [x] 站群后端集成图形验证码
- [x] inventory_master 后端实现多认证方式
- [x] 站群前端改造：OAuth 回调处理
- [x] inventory_master 前端登录注册页面改造
- [x] 数据迁移脚本与测试

## 📞 后续支持

如需帮助，请参考：
1. [部署指南](DEPLOYMENT_GUIDE.md)
2. [测试清单](TESTING_CHECKLIST.md)
3. [依赖安装说明](INSTALL_DEPENDENCIES.md)

---

**改造完成时间**：2025-11-26  
**改造版本**：v2.0  
**改造范围**：用户认证系统全面升级
