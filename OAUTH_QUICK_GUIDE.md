# OAuth 第三方登录快速指南

## 🔑 核心原理

**关键点：我们不能直接跳转到站群的OAuth回调页！**

正确的流程是：
```
Inventory → 微信/QQ授权页 → 站群OAuth回调页 → Inventory
```

## 📋 实现步骤

### 1️⃣ 点击登录按钮
用户在Inventory登录页点击"微信登录"或"QQ登录"

### 2️⃣ 跳转到微信/QQ授权页
```javascript
// redirect_uri指向站群的OAuth回调页
// 同时在URL中携带return_url参数（Inventory登录页）
window.location.href = `https://open.weixin.qq.com/connect/qrconnect?
  appid=站群的微信AppID
  &redirect_uri=https://potatofield.cn/oauth/callback?return_url=http://localhost:5173/login
  &response_type=code
  &scope=snsapi_login
  &state=wechat`
```

### 3️⃣ 用户授权后跳转到站群
微信/QQ会将用户重定向到：
```
https://potatofield.cn/oauth/callback?
  return_url=http://localhost:5173/login
  &code=AUTHORIZATION_CODE
  &state=wechat
```

### 4️⃣ 站群跳转回Inventory
站群的OAuth回调页检测到`code`参数后，会跳转到`return_url`：
```
http://localhost:5173/login?code=AUTHORIZATION_CODE&state=wechat
```

### 5️⃣ Inventory处理登录
- 检测URL中的`code`和`state`参数
- 调用后端`/api/v2/auth/oauth/login`接口
- 完成登录或提示绑定/注册

## 🔧 配置文件

创建 `frontend/.env` 文件：
```env
VITE_API_BASE_URL=http://localhost:9702
VITE_WECHAT_APPID=wxbcf6b197b348b750
VITE_QQ_APPID=101966175
```

## ❓ 常见问题

**Q1: 为什么不能跳转到站群的OAuth回调页？**
A: OAuth回调页只能由第三方授权服务（微信/QQ）跳转，不能由我们主动访问。

**Q2: 为什么使用站群的AppID？**
A: 因为`redirect_uri`必须是在该AppID下注册的域名。站群已经注册了`potatofield.cn`，所以我们借用它的AppID和回调地址。

**Q3: redirect_uri中可以带参数吗？**
A: 可以！我们在`redirect_uri`中携带`return_url`参数，站群的OAuth回调页会读取这个参数，授权完成后跳转回我们的页面。

## ✅ 验证流程

1. 启动前后端服务
2. 访问 `http://localhost:5173/login`
3. 点击"微信登录"
4. **应该看到微信二维码扫码页面**（不是站群的页面）
5. 扫码授权后，会跳转回登录页，URL带上`?code=xxx&state=wechat`
6. 页面自动调用后端OAuth接口完成登录

## 📁 相关文件

- `frontend/src/views/LoginV2.vue` - 登录页面，包含OAuth跳转逻辑
- `frontend/src/api/authV2.ts` - OAuth相关API接口
- `backend/src/controllers/authV2Controller.ts` - OAuth登录控制器
- `backend/src/routes/authV2Routes.ts` - OAuth路由配置
- `OAUTH_FLOW.md` - 完整的流程说明文档
