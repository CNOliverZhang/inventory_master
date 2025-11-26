# OAuth 完整实现文档

## ✅ 已完成功能

### 1️⃣ 后端实现

#### OAuth服务 (`backend/src/services/oauthService.ts`)
- ✅ 微信OAuth：通过code获取access_token、openId、unionId和用户信息
- ✅ QQ OAuth：通过code获取access_token、openId、unionId和用户信息
- ✅ 头像下载功能
- ✅ 完全复用站群的API调用逻辑

```typescript
// 微信OAuth流程
export const getWechatUserInfo = async (code: string) => {
  // 1. 用code换取access_token
  // 2. 用access_token获取用户信息
  // 3. 返回unionId、nickname、avatar等
}

// QQ OAuth流程（类似）
export const getQQUserInfo = async (code: string, redirectUri: string) => {
  // 1. 用code换取access_token
  // 2. 获取openId和unionId
  // 3. 获取用户信息
  // 4. 返回unionId、nickname、avatar等
}
```

#### OAuth控制器 (`backend/src/controllers/oauthController.ts`)

**oauthLogin** - OAuth登录/检查绑定状态
```typescript
POST /api/v2/auth/oauth/login
Body: { code, state }

响应1 - 已绑定：
{
  success: true,
  data: {
    needBind: false,
    user: {...},
    token: "..."
  }
}

响应2 - 未绑定：
{
  success: true,
  data: {
    needBind: true,
    unionId: "...",
    nickname: "...",
    avatar: "...",
    provider: "wechat|qq"
  }
}
```

**oauthBind** - 绑定已有账号
```typescript
POST /api/v2/auth/oauth/bind
Body: { unionId, identifier, password }

流程：
1. 从Redis获取OAuth信息（5分钟有效期）
2. 验证账号密码
3. 检查该OAuth账号是否已被其他用户绑定
4. 创建AuthCredential记录（authType=WECHAT|QQ, identifier=unionId）
5. 返回token和用户信息
```

**oauthRegister** - 注册新账号
```typescript
POST /api/v2/auth/oauth/register
Body: { unionId }

流程：
1. 从Redis获取OAuth信息
2. 创建AuthUser
3. 下载并处理头像（压缩为webp）
4. 创建UserProfile（包含nickname和avatar）
5. 创建AuthCredential（authType=WECHAT|QQ, identifier=unionId）
6. 返回token和用户信息
```

#### 数据库设计

**AuthCredential表** - 支持OAuth认证类型
```sql
authType: 
  1 = USERNAME
  2 = EMAIL
  3 = PHONE
  4 = WECHAT  ← 微信unionId
  5 = QQ      ← QQ unionId

identifier:
  - 对于WECHAT/QQ类型，存储的是unionId
  - 这样可以与站群的用户数据互通
```

### 2️⃣ 前端实现

#### OAuth跳转逻辑 (`frontend/src/views/LoginV2.vue`)

```javascript
// 微信登录
const handleWechatLogin = () => {
  const returnUrl = encodeURIComponent(`${window.location.origin}/login`)
  const callbackUrl = `https://potatofield.cn/oauth/callback?return_url=${returnUrl}`
  const encodedCallback = encodeURIComponent(callbackUrl)
  const wechatAppId = import.meta.env.VITE_WECHAT_APPID || 'wxbcf6b197b348b750'
  
  // 直接跳转到微信授权页
  window.location.href = `https://open.weixin.qq.com/connect/qrconnect?appid=${wechatAppId}&redirect_uri=${encodedCallback}&response_type=code&scope=snsapi_login&state=wechat#wechat_redirect`
}
```

#### OAuth回调处理

```javascript
// 检查URL参数
const checkOAuthCallback = () => {
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')
  const state = urlParams.get('state')
  
  if (code && state) {
    handleOAuthCallback(code, state)
  }
}

// 处理OAuth登录
const handleOAuthCallback = async (code, state) => {
  const res = await authV2API.oauthLogin({ code, state })
  
  if (res.data.needBind) {
    // 显示绑定/注册对话框
    oauthData.value = {
      unionId: res.data.unionId,
      nickname: res.data.nickname,
      avatar: res.data.avatar,
      provider: res.data.provider,
    }
    oauthDialogVisible.value = true
  } else {
    // 直接登录
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    router.push('/')
  }
}
```

#### OAuth绑定/注册对话框 (`frontend/src/components/OAuthBindDialog.vue`)

**功能特性：**
- ✅ 显示第三方账号头像和昵称
- ✅ 两种模式：选择操作 / 绑定账号
- ✅ 绑定模式：输入账号密码表单
- ✅ 美观的渐变按钮设计
- ✅ 完整的国际化支持

**UI截图描述：**
```
┌─────────────────────────────────┐
│  [×]                            │
│                                 │
│  [头像] 用户昵称                │
│         微信账号                │
│                                 │
│  ┌───────────────────────────┐ │
│  │ 🔗 绑定已有账号           │ │
│  │ 使用已有账号密码登录并绑定 │→│
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │ ➕ 注册新账号             │ │
│  │ 使用该第三方账号注册新用户 │→│
│  └───────────────────────────┘ │
└─────────────────────────────────┘
```

### 3️⃣ 环境配置

#### 后端环境变量 (`backend/.env.example`)
```env
# 微信开放平台网站应用配置（与站群使用相同配置）
WECHAT_WEBSITE_APPID=your_wechat_appid
WECHAT_WEBSITE_SECRET=your_wechat_secret

# QQ互联网站应用配置（与站群使用相同配置）
QQ_WEBSITE_APPID=your_qq_appid
QQ_WEBSITE_SECRET=your_qq_secret
```

#### 前端环境变量 (`frontend/.env.example`)
```env
# 微信网站应用AppID（站群的AppID）
VITE_WECHAT_APPID=wxbcf6b197b348b750

# QQ互联AppID（站群的AppID）
VITE_QQ_APPID=101966175
```

## 🔄 完整流程

### 用户体验流程

```
1. 用户点击"微信登录"
   ↓
2. 跳转到微信二维码扫码页
   ↓
3. 用户扫码授权
   ↓
4. 微信跳转到站群OAuth回调页（带code）
   ↓
5. 站群跳转回Inventory登录页（带code和state）
   ↓
6. Inventory自动检测参数，调用后端
   ↓
7a. 已绑定 → 直接登录成功
7b. 未绑定 → 显示对话框
   ↓
8. 用户选择：
   - 绑定已有账号 → 输入账号密码 → 绑定并登录
   - 注册新账号 → 直接注册并登录
```

### 技术流程

```
Frontend                Backend                  微信/QQ
───────────────────────────────────────────────────────
点击登录
  │
  ├→ 跳转到微信授权页
     (redirect_uri=站群)
     state=wechat
                                                    │
                                              扫码授权
                                                    │
                                         ←──────────┘
                                         跳转到站群
                                      (带code和state)
                                                    │
                         站群跳转回Inventory ←──────┘
                         (带code和state)
  │
  ←─┘
  │
检测到code和state
  │
  ├→ POST /oauth/login
     { code, state }
                        │
                  调用微信API ──────→ 获取access_token
                  获取用户信息 ──────→ openId, unionId, nickname, avatar
                        │
                  查询AuthCredential
                        │
                  if (已绑定) {
                    返回 token + user
                  } else {
                    存储到Redis
                    返回 needBind=true
                  }
  │
  ←─┘
  │
if (needBind) {
  显示对话框
  │
  ├→ 用户选择绑定
     POST /oauth/bind
     { unionId, identifier, password }
                        │
                  从Redis获取OAuth信息
                  验证账号密码
                  创建AuthCredential
                  返回 token + user
} else {
  直接登录
}
```

## 🎯 与站群的互通性

### 相同的配置
- ✅ 使用相同的微信AppID和Secret
- ✅ 使用相同的QQ AppID和Secret

### 相同的数据结构
- ✅ AuthCredential.authType (4=WECHAT, 5=QQ)
- ✅ 使用unionId作为identifier
- ✅ 相同的数据库表结构

### 相同的API调用方式
- ✅ 微信API调用逻辑完全一致
- ✅ QQ API调用逻辑完全一致
- ✅ 头像处理方式相同（webp压缩）

### 结果
**站群的用户可以直接用OAuth登录Inventory**，反之亦然！

## 📁 文件清单

### 后端新增/修改文件
- ✅ `backend/.env.example` - 添加微信/QQ配置
- ✅ `backend/src/services/oauthService.ts` - OAuth服务（新建）
- ✅ `backend/src/controllers/oauthController.ts` - OAuth控制器（新建）
- ✅ `backend/src/routes/authV2Routes.ts` - 添加OAuth路由
- ✅ `backend/src/controllers/authV2Controller.ts` - 导入OAuth服务

### 前端新增/修改文件
- ✅ `frontend/.env.example` - 添加AppID配置（新建）
- ✅ `frontend/src/components/OAuthBindDialog.vue` - OAuth对话框组件（新建）
- ✅ `frontend/src/views/LoginV2.vue` - 集成OAuth逻辑
- ✅ `frontend/src/api/authV2.ts` - 添加OAuth API接口
- ✅ `frontend/src/locales/zh-CN.ts` - 添加国际化文本
- ✅ `frontend/src/locales/en-US.ts` - 添加国际化文本

### 文档文件
- ✅ `OAUTH_FLOW.md` - OAuth流程说明
- ✅ `OAUTH_QUICK_GUIDE.md` - 快速指南
- ✅ `OAUTH_IMPLEMENTATION_COMPLETE.md` - 本文档

## 🚀 部署清单

1. **配置后端环境变量**
   ```bash
   cp backend/.env.example backend/.env
   # 编辑.env文件，填入微信和QQ的AppID和Secret
   ```

2. **配置前端环境变量**
   ```bash
   cp frontend/.env.example frontend/.env
   # AppID使用站群的，保持一致
   ```

3. **安装依赖**
   ```bash
   cd backend && npm install
   cd frontend && npm install
   ```

4. **构建项目**
   ```bash
   cd backend && npm run build
   cd frontend && npm run build
   ```

5. **启动服务**
   ```bash
   # 后端
   cd backend && npm start
   
   # 前端（开发）
   cd frontend && npm run dev
   ```

## ✅ 测试清单

- [ ] 微信登录 - 已有账号（已绑定）
- [ ] 微信登录 - 新用户（未绑定，注册）
- [ ] 微信登录 - 新用户（未绑定，绑定已有账号）
- [ ] QQ登录 - 已有账号（已绑定）
- [ ] QQ登录 - 新用户（未绑定，注册）
- [ ] QQ登录 - 新用户（未绑定，绑定已有账号）
- [ ] OAuth信息过期处理（5分钟后）
- [ ] 头像下载和处理
- [ ] 与站群用户互通测试

## 🎉 总结

完整实现了OAuth第三方登录功能，包括：
1. ✅ 完整的OAuth流程（与站群完全一致）
2. ✅ 美观的UI对话框
3. ✅ 绑定和注册两种方式
4. ✅ 与站群用户数据互通
5. ✅ 完善的错误处理
6. ✅ 国际化支持
7. ✅ 响应式设计

代码质量：所有文件通过Linter检查，无错误！
