# OAuth 第三方登录流程说明

## 整体流程图

```
用户 -> Inventory登录页 -> 微信/QQ授权页 -> 站群OAuth回调页 -> Inventory登录页 -> 后端OAuth登录接口
```

## 详细流程步骤

### 1. 用户点击第三方登录按钮

**前端：** `frontend/src/views/LoginV2.vue`

```javascript
// 微信登录
const handleWechatLogin = () => {
  // 1. 构建最终返回URL：Inventory的登录页
  const returnUrl = encodeURIComponent(`${window.location.origin}/login`)
  
  // 2. 构建站群OAuth回调页URL（包含returnUrl参数）
  const callbackUrl = `https://potatofield.cn/oauth/callback?return_url=${returnUrl}`
  const encodedCallback = encodeURIComponent(callbackUrl)
  
  // 3. 跳转到微信授权页，redirect_uri指向站群
  const wechatAppId = 'wx0ae11b6c0e393491'  // 站群的微信AppID
  window.location.href = `https://open.weixin.qq.com/connect/qrconnect?appid=${wechatAppId}&redirect_uri=${encodedCallback}&response_type=code&scope=snsapi_login&state=wechat#wechat_redirect`
}
```

**跳转到微信授权页的URL示例：**
```
https://open.weixin.qq.com/connect/qrconnect?
  appid=wx0ae11b6c0e393491
  &redirect_uri=https%3A%2F%2Fpotatofield.cn%2Foauth%2Fcallback%3Freturn_url%3Dhttp%253A%252F%252Flocalhost%253A5173%252Flogin
  &response_type=code
  &scope=snsapi_login
  &state=wechat
  #wechat_redirect
```

**关键点：**
- `appid`：使用**站群的微信AppID**（因为`redirect_uri`必须在该AppID下注册）
- `redirect_uri`：指向**站群的OAuth回调页**，并携带我们的`return_url`参数
- `state=wechat`：标识这是微信登录

### 2. 用户在微信授权页完成授权

用户扫码/确认授权后，微信会重定向到`redirect_uri`：

```
https://potatofield.cn/oauth/callback?
  return_url=http%3A%2F%2Flocalhost%3A5173%2Flogin
  &code=AUTHORIZATION_CODE
  &state=wechat
```

### 3. 站群OAuth回调页处理并跳转

**站群前端：** `potatofield-frontend-master/src/Pages/OAuth/Callback.tsx`

站群的OAuth回调页会：
1. 接收微信返回的`code`和`state`参数
2. 从URL中获取`return_url`参数（即Inventory登录页）
3. 将`code`和`state`附加到`return_url`上
4. 跳转回Inventory登录页

**跳转回Inventory的URL：**
```
http://localhost:5173/login?code=AUTHORIZATION_CODE&state=wechat
```

### 4. Inventory登录页检测OAuth回调

**前端：** `frontend/src/views/LoginV2.vue`

```javascript
// 检查URL中是否有OAuth回调参数
const checkOAuthCallback = () => {
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')
  const state = urlParams.get('state')
  
  if (code && state) {
    // 检测到OAuth回调，调用登录处理
    handleOAuthCallback(code, state)
  }
}

// 组件挂载时自动检查
onMounted(() => {
  refreshCaptcha()
  checkOAuthCallback()  // 自动检测OAuth参数
})
```

### 5. 调用后端OAuth登录接口

**前端API：** `frontend/src/api/authV2.ts`

```javascript
// 向后端发送code和state
export const oauthLogin = async (data: { code: string; state: string }) => {
  const response = await apiClient.post(`${API_V2_PREFIX}/oauth/login`, data);
  return response.data;
};
```

**后端处理：** `backend/src/controllers/authV2Controller.ts`

```typescript
export const oauthLogin = async (req: Request, res: Response) => {
  const { code, state } = req.body;
  
  // TODO: 调用站群的API，用code换取用户的unionId等信息
  // 或者直接调用微信/QQ的API（需要站群的secret）
  
  // 检查是否已有该unionId的认证凭据
  // - 如果有：直接登录
  // - 如果没有：返回needBind=true，需要绑定或注册
}
```

### 6. 处理登录结果

**三种情况：**

#### a) 已绑定账号 - 直接登录成功
```javascript
localStorage.setItem('token', res.data.token)
localStorage.setItem('user', JSON.stringify(res.data.user))
toast.success(t('auth.loginSuccess'))
router.push('/')
```

#### b) 未绑定 - 需要绑定已有账号
```javascript
// 显示绑定对话框，用户输入账号密码
await authV2API.oauthBind({ code, state, identifier, password })
```

#### c) 未绑定 - 注册新账号
```javascript
// 直接注册或显示注册对话框
await authV2API.oauthRegister({ code, state })
```

## 重要说明

### 为什么使用站群的AppID？

微信和QQ的OAuth机制要求：
1. **redirect_uri必须是在AppID下注册的域名**
2. 站群已经在其微信/QQ AppID下注册了 `https://potatofield.cn` 域名
3. Inventory的域名（如 `localhost:5173` 或其他域名）无法在站群的AppID下注册
4. 因此必须使用站群的AppID，并将redirect_uri设置为站群的URL

### OAuth流程的关键环节

```
┌─────────────────┐
│ Inventory登录页 │
│ localhost:5173  │
└────────┬────────┘
         │ 点击微信登录
         ▼
┌─────────────────────────────────────────────────┐
│ 微信授权页                                         │
│ open.weixin.qq.com                              │
│ - appid: 站群的AppID                             │
│ - redirect_uri: potatofield.cn/oauth/callback   │
│ - return_url参数: localhost:5173/login           │
└────────┬────────────────────────────────────────┘
         │ 用户授权
         ▼
┌─────────────────────────────────────┐
│ 站群OAuth回调页                        │
│ potatofield.cn/oauth/callback       │
│ - 接收微信返回的code和state             │
│ - 解析return_url参数                 │
└────────┬────────────────────────────┘
         │ 跳转回Inventory
         ▼
┌─────────────────────────────────────┐
│ Inventory登录页                       │
│ localhost:5173/login                │
│ - URL参数: ?code=xxx&state=wechat    │
│ - 自动检测参数并调用后端API             │
└─────────────────────────────────────┘
```

### 环境变量配置

**前端：** `frontend/.env`

```env
# 微信网站应用AppID（站群的AppID）
VITE_WECHAT_APPID=wx0ae11b6c0e393491

# QQ互联AppID（站群的AppID）
VITE_QQ_APPID=101491009
```

**注意：** 这些AppID是站群的，不需要自己申请新的。

### 前端API（`frontend/src/api/authV2.ts`）

```typescript
// OAuth登录
oauthLogin(data: { code: string; state: string })

// OAuth绑定已有账号
oauthBind(data: { code: string; state: string; identifier: string; password: string })

// OAuth注册新账号
oauthRegister(data: { code: string; state: string })
```

### 后端路由（`backend/src/routes/authV2Routes.ts`）

```typescript
POST /api/v2/auth/oauth/login       // OAuth登录
POST /api/v2/auth/oauth/bind        // OAuth绑定
POST /api/v2/auth/oauth/register    // OAuth注册
```

## 数据库设计

### AuthType枚举（`backend/src/models/auth/AuthCredential.ts`）

```typescript
export enum AuthType {
  USERNAME = 1,
  EMAIL = 2,
  PHONE = 3,
  WECHAT = 4,
  QQ = 5,
}
```

### AuthCredential表结构

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键 |
| userId | INTEGER | 用户ID |
| authType | INTEGER | 认证类型（1-5） |
| identifier | STRING | 标识符（openId/unionId等） |
| credential | STRING | 凭据（密码hash/accessToken等） |

## TODO - 待实现功能

1. **调用站群API获取用户信息**
   - 需要向站群发起请求，用`code`换取`openId`/`unionId`等信息
   - 可能需要站群提供一个API接口

2. **完善OAuth绑定和注册逻辑**
   - 创建OAuth类型的`AuthCredential`记录
   - 存储`openId`/`unionId`
   - 获取并保存用户头像、昵称等信息

3. **前端绑定/注册对话框**
   - 当`needBind: true`时，显示对话框
   - 提供"绑定已有账号"和"注册新账号"两个选项
   - 参考站群的实现方式

4. **OAuth信息缓存优化**
   - 目前使用Redis临时存储5分钟
   - 可以考虑更长的有效期或其他存储方案

## 参考文件

### 站群前端
- `potatofield-frontend-master/src/Pages/User/Auth/Login/index.tsx` - 登录页OAuth处理
- `potatofield-frontend-master/src/Pages/OAuth/Callback.tsx` - OAuth回调页
- `potatofield-frontend-master/src/Utils/OAuthHelper/index.tsx` - OAuth工具函数

### Inventory前端
- `frontend/src/views/LoginV2.vue` - 登录页
- `frontend/src/api/authV2.ts` - API接口

### Inventory后端
- `backend/src/controllers/authV2Controller.ts` - 控制器
- `backend/src/routes/authV2Routes.ts` - 路由
- `backend/src/models/auth/AuthCredential.ts` - 认证凭据模型

## 测试步骤

1. 启动Inventory前后端服务
2. 访问登录页 `http://localhost:5173/login`
3. 点击"微信登录"或"QQ登录"按钮
4. 观察跳转到站群OAuth回调页
5. （如果配置正确）会跳转到微信/QQ授权页
6. 授权后跳回站群，再跳回Inventory
7. Inventory登录页应该检测到`code`和`state`参数
8. 调用后端OAuth接口
9. 根据返回结果处理登录/绑定/注册流程
