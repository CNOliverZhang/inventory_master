# 账号绑定管理功能完整指南

## 功能概述

本次更新为个人设置页面添加了完整的账号绑定管理功能，用户可以：

1. **查看所有绑定信息** - 昵称、用户名、邮箱、手机号、微信、QQ
2. **修改用户名和昵称** - 支持设置或修改
3. **绑定/换绑邮箱和手机号** - 需要验证码验证
4. **绑定/换绑微信和QQ** - 通过OAuth重新授权
5. **解绑第三方账号** - 支持解绑微信/QQ（至少保留一种登录方式）

## 文件变更清单

### 后端新建文件

1. **`backend/src/controllers/accountController.ts`** - 账号绑定管理控制器
   - `getBindings` - 获取所有绑定信息
   - `updateUsername` - 修改用户名
   - `updateNickname` - 修改昵称
   - `sendBindEmailCode` - 发送绑定邮箱验证码
   - `sendBindPhoneCode` - 发送绑定手机验证码
   - `bindEmail` - 绑定/换绑邮箱
   - `bindPhone` - 绑定/换绑手机号
   - `unbindOAuth` - 解绑OAuth账号

### 后端修改文件

2. **`backend/src/controllers/oauthController.ts`**
   - 新增 `oauthRebind` - OAuth换绑方法（已登录用户）

3. **`backend/src/routes/authV2Routes.ts`**
   - 添加账号绑定管理相关路由：
     - `GET /api/v2/auth/bindings` - 获取绑定信息
     - `POST /api/v2/auth/update-username` - 修改用户名
     - `POST /api/v2/auth/update-nickname` - 修改昵称
     - `POST /api/v2/auth/send-bind-email-code` - 发送邮箱验证码
     - `POST /api/v2/auth/send-bind-phone-code` - 发送手机验证码
     - `POST /api/v2/auth/bind-email` - 绑定/换绑邮箱
     - `POST /api/v2/auth/bind-phone` - 绑定/换绑手机号
     - `POST /api/v2/auth/unbind-oauth` - 解绑OAuth
     - `POST /api/v2/auth/oauth/rebind` - OAuth换绑

### 前端新建文件

4. **`frontend/src/api/account.ts`** - 账号绑定管理API
   - 所有绑定管理相关的API调用

5. **`frontend/src/components/BindingDialog.vue`** - 通用绑定对话框组件
   - 支持普通输入（用户名、昵称）
   - 支持验证码输入（邮箱、手机号）
   - 带倒计时的验证码发送按钮

6. **`frontend/src/components/OAuthRebindDialog.vue`** - OAuth换绑对话框
   - 引导用户进行OAuth重新授权

### 前端修改文件

7. **`frontend/src/views/Settings.vue`**
   - 完全重构账户设置部分
   - 显示所有绑定信息（昵称、用户名、邮箱、手机、微信、QQ）
   - 集成绑定/换绑/解绑功能
   - 处理OAuth换绑回调

8. **国际化文件** (`zh-CN.ts`, `en-US.ts`)
   - 添加所有账号绑定相关的翻译文本

## 核心功能实现

### 1. 获取绑定信息

**API**: `GET /api/v2/auth/bindings`

**响应示例**:
```json
{
  "success": true,
  "data": {
    "username": "john_doe",
    "email": "john@example.com",
    "phone": "13812345678",
    "wechat": "o6_bmjrPTlm6_2sgVt7hMZOPfL2M",
    "qq": "1234567890ABCDEF",
    "nickname": "约翰"
  }
}
```

### 2. 修改用户名

**API**: `POST /api/v2/auth/update-username`

**请求**:
```json
{
  "username": "new_username"
}
```

**逻辑**:
- 验证用户名长度（3-50字符）
- 检查用户名是否被占用
- 如果已有用户名凭据，更新；否则创建新凭据并共享密码

### 3. 绑定/换绑邮箱

**流程**:
1. 点击"绑定"或"换绑"按钮
2. 输入新邮箱地址
3. 点击"发送验证码"（调用 `POST /api/v2/auth/send-bind-email-code`）
4. 输入收到的6位验证码
5. 提交（调用 `POST /api/v2/auth/bind-email`）

**验证码发送**:
- 60秒频率限制
- 5分钟有效期
- 检查邮箱是否被其他用户使用

**绑定/换绑**:
- 验证验证码
- 如果已有邮箱凭据，更新identifier（换绑）
- 如果没有，创建新凭据并共享密码（绑定）

### 4. 绑定/换绑手机号

与邮箱流程相同，使用手机短信验证码。

### 5. 绑定/换绑OAuth（微信/QQ）

**流程**:
1. 点击"绑定"或"换绑"按钮
2. 显示OAuth换绑对话框
3. 点击"开始授权"
4. 跳转到微信/QQ授权页面
   - State参数: `wechat_rebind` 或 `qq_rebind`
   - Redirect URI: `https://potatofield.cn/oauth/callback?return_url=http://your-domain/settings?oauth_rebind=wechat`
5. 用户授权后，第三方跳转回站群OAuth回调页
6. 站群回调页跳转回Settings页面，带code和state参数
7. Settings页面检测到OAuth回调参数，自动处理：
   - 调用 `POST /api/v2/auth/oauth/login` 获取unionId
   - 调用 `POST /api/v2/auth/oauth/rebind` 完成换绑
8. 更新本地绑定状态，显示成功提示

**后端逻辑**:
- 从Redis获取OAuth临时数据
- 检查unionId是否被其他用户绑定
- 如果当前用户已有该类型OAuth凭据，更新identifier（换绑）
- 如果没有，创建新凭据（绑定）

### 6. 解绑OAuth

**API**: `POST /api/v2/auth/unbind-oauth`

**请求**:
```json
{
  "provider": "wechat"  // 或 "qq"
}
```

**限制**:
- 用户至少需要保留一种登录方式
- 如果只剩一个凭据，不允许解绑

## UI界面说明

### 个人设置页面

```
┌─────────────────────────────────────────────┐
│ 个人设置                         [语言切换] │
├─────────────────────────────────────────────┤
│                                             │
│ 主题颜色                                    │
│ [主题卡片选择器]                            │
│                                             │
│ 深色模式                                    │
│ [保持浅色] [保持深色] [跟随系统]            │
│                                             │
│ 账户设置                                    │
│ ┌─────────────────────────────────────────┐ │
│ │ 昵称          约翰               [编辑]  │ │
│ │ 用户名        john_doe          [编辑]  │ │
│ │ 邮箱          john@example.com  [换绑]  │ │
│ │ 手机号        138****5678       [换绑]  │ │
│ │ 微信          已绑定     [解绑] [换绑]  │ │
│ │ QQ            未绑定            [绑定]  │ │
│ │ 密码          ••••••••          [修改]  │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

### 绑定对话框

**用户名/昵称（无验证码）**:
```
┌──────────────────────────┐
│ 修改用户名          [×] │
├──────────────────────────┤
│ 用户名                   │
│ [输入框_______________] │
├──────────────────────────┤
│         [取消]  [保存]   │
└──────────────────────────┘
```

**邮箱/手机（带验证码）**:
```
┌──────────────────────────┐
│ 绑定邮箱            [×] │
├──────────────────────────┤
│ 邮箱                     │
│ [输入框_______________] │
│                          │
│ 验证码                   │
│ [输入框_____] [发送验证码]│
├──────────────────────────┤
│         [取消]  [保存]   │
└──────────────────────────┘
```

**OAuth换绑**:
```
┌──────────────────────────┐
│ 换绑微信            [×] │
├──────────────────────────┤
│      [微信图标]          │
│                          │
│ 点击下方按钮将跳转到     │
│ 微信授权页面进行换绑     │
│                          │
│ 换绑后原绑定将被替换     │
├──────────────────────────┤
│         [取消] [开始授权]│
└──────────────────────────┘
```

## 安全机制

1. **验证码保护**
   - 邮箱/手机绑定需要验证码
   - 60秒发送频率限制
   - 5分钟有效期

2. **唯一性检查**
   - 用户名不能重复
   - 邮箱/手机不能被其他用户使用
   - OAuth账号不能被其他用户绑定

3. **密码共享**
   - 邮箱、用户名、手机号凭据共享同一个密码
   - 修改任一方式的密码，其他方式同步更新

4. **最少登录方式**
   - 用户至少需要保留一种登录方式
   - 解绑时检查剩余凭据数量

5. **身份验证**
   - 所有绑定管理API都需要登录（authenticate中间件）
   - OAuth换绑需要重新授权

## 数据库变更

**注意**: 如果之前执行OAuth绑定时遇到 `Field 'id' doesn't have a default value` 错误，需要执行以下SQL修复：

```sql
USE `user`;

-- 将 Auth_credential 表的 id 字段设置为自增主键
ALTER TABLE `Auth_credential` 
DROP PRIMARY KEY,
ADD PRIMARY KEY (`id`),
MODIFY COLUMN `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '凭据ID';
```

或者执行迁移脚本：
```bash
mysql -u root -p < database_migrations/003_fix_auth_credential_id.sql
```

## 测试检查清单

- [ ] 修改昵称
- [ ] 修改用户名（首次设置）
- [ ] 修改用户名（更新已有）
- [ ] 绑定邮箱（发送验证码 → 输入验证码 → 绑定）
- [ ] 换绑邮箱（更换为新邮箱）
- [ ] 绑定手机号
- [ ] 换绑手机号
- [ ] 绑定微信（OAuth授权 → 绑定成功）
- [ ] 换绑微信（OAuth重新授权 → 换绑成功）
- [ ] 绑定QQ
- [ ] 换绑QQ
- [ ] 解绑微信（检查最少登录方式限制）
- [ ] 解绑QQ
- [ ] 验证码60秒限制
- [ ] 验证码过期（5分钟）
- [ ] 用户名重复检查
- [ ] 邮箱/手机被占用检查
- [ ] OAuth账号被占用检查
- [ ] 中英文切换

## 常见问题

### Q1: 修改用户名后能用新用户名登录吗？
A: 可以。用户名凭据与邮箱、手机号共享密码，修改用户名后可以用新用户名+密码登录。

### Q2: 换绑邮箱需要验证原邮箱吗？
A: 不需要。只需要验证新邮箱的验证码即可换绑。

### Q3: 解绑微信后还能用微信登录吗？
A: 不能。解绑后该微信账号与本账号的绑定关系断开。

### Q4: OAuth换绑的state参数是什么？
A: `wechat_rebind` 或 `qq_rebind`，用于区分换绑流程和普通登录流程。

### Q5: 为什么解绑时提示"至少需要保留一种登录方式"？
A: 系统要求用户至少保留一种登录凭据，防止账号无法登录。

## 部署注意事项

1. **数据库修复**
   - 执行 `003_fix_auth_credential_id.sql` 修复id字段

2. **环境变量**
   - 确保 `.env` 中配置了微信/QQ的AppID和Secret

3. **OAuth回调URL**
   - 确保站群OAuth回调页正确跳转回Settings页面
   - 检查return_url编码

4. **Redis依赖**
   - 验证码和OAuth临时数据存储在Redis中
   - 确保Redis服务正常运行

## 总结

本次更新实现了完整的账号绑定管理功能，包括：
- ✅ 9个后端API接口
- ✅ 2个前端组件
- ✅ 完整的OAuth换绑流程
- ✅ 中英文国际化支持
- ✅ 完善的安全机制
- ✅ 友好的用户体验

所有功能已通过Linter检查，无错误。
