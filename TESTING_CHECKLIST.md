# 测试清单

## ✅ 数据库测试

### 1. 数据库结构验证
- [ ] user数据库已创建
- [ ] Auth_user表包含 created_at, last_login_at 字段
- [ ] Auth_credential表包含 created_at, updated_at 字段
- [ ] User_profile表包含 created_at, updated_at 字段
- [ ] 索引正常创建

### 2. 数据迁移验证
- [ ] 执行001_add_timestamp_fields.sql成功
- [ ] 存量数据时间字段设置为今天0点
- [ ] 执行002_migrate_existing_users.sql成功
- [ ] 原用户数据成功迁移
- [ ] 认证凭据正确创建
- [ ] 用户资料正确创建
- [ ] 无孤儿记录

## ✅ 后端测试

### 1. inventory_master 后端

#### 环境检查
- [ ] canvas依赖已安装
- [ ] userSequelize连接正常
- [ ] Redis连接正常
- [ ] 两个数据库连接正常

#### API测试 - 图形验证码
- [ ] GET /api/v2/auth/captcha - 返回图片和token
- [ ] 验证码图片正常显示
- [ ] Redis中存储验证码
- [ ] 5分钟后自动过期

#### API测试 - 注册流程
- [ ] POST /api/v2/auth/send-email-code
  - [ ] 图形验证码验证成功
  - [ ] 图形验证码错误时拒绝
  - [ ] 邮箱格式验证
  - [ ] 邮箱已存在时拒绝
  - [ ] 60秒内不可重复发送
  - [ ] 邮件成功发送
  - [ ] Redis存储邮箱验证码
  - [ ] 5分钟后自动过期

- [ ] POST /api/v2/auth/register
  - [ ] 邮箱验证码验证成功
  - [ ] 密码长度验证（至少6位）
  - [ ] 成功创建 Auth_user
  - [ ] 成功创建 Auth_credential (邮箱)
  - [ ] 成功创建 User_profile
  - [ ] 返回JWT token
  - [ ] 返回完整用户信息

#### API测试 - 登录流程
- [ ] POST /api/v2/auth/login
  - [ ] 邮箱登录成功
  - [ ] 用户名登录成功
  - [ ] 密码错误时拒绝
  - [ ] 账号不存在时拒绝
  - [ ] 更新 last_login_at
  - [ ] 返回JWT token
  - [ ] 返回完整用户信息（含profile）

#### API测试 - 用户信息
- [ ] GET /api/v2/auth/me
  - [ ] 携带正确token返回用户信息
  - [ ] 无token时返回401
  - [ ] 错误token时返回401
  - [ ] 返回数据包含credentials列表
  - [ ] 返回数据包含profile

### 2. 站群后端

#### 图形验证码
- [ ] GET /captcha/get - 返回验证码
- [ ] POST /captcha/verify - 验证成功
- [ ] Redis存储正常

#### 邮箱/手机验证码（新版）
- [ ] POST /auth/verify/v2/phone
  - [ ] 图形验证码验证
  - [ ] 发送频率限制
  - [ ] 短信发送成功
- [ ] POST /auth/verify/v2/email
  - [ ] 图形验证码验证
  - [ ] 发送频率限制
  - [ ] 邮件发送成功

#### 向后兼容
- [ ] POST /auth/verify/phone（旧版vaptcha）仍可用
- [ ] POST /auth/verify/email（旧版vaptcha）仍可用

## ✅ 前端测试

### 1. inventory_master 前端

#### 新版登录页（/loginv2）
- [ ] 页面正常加载
- [ ] 登录/注册标签切换正常

#### 登录功能
- [ ] 输入验证正常
- [ ] 表单提交成功
- [ ] Token存储到localStorage
- [ ] 用户信息存储到localStorage
- [ ] 登录成功后跳转首页
- [ ] 错误提示正常显示

#### 注册功能
- [ ] 图形验证码正常显示
- [ ] 点击刷新验证码
- [ ] 邮箱格式验证
- [ ] 密码长度验证
- [ ] 发送验证码按钮状态正确
- [ ] 倒计时功能正常
- [ ] 邮箱验证码输入框显示
- [ ] 完成注册成功
- [ ] Token存储成功
- [ ] 注册成功后跳转首页

#### 第三方登录
- [ ] 微信登录按钮点击
- [ ] 跳转到站群OAuth页面
- [ ] 携带return_url参数
- [ ] QQ登录按钮点击
- [ ] 移动端检测正常

### 2. 站群前端

#### OAuth回调页（/oauth/callback）
- [ ] 页面正常加载
- [ ] 接收code参数
- [ ] 接收state参数
- [ ] 接收return_url参数
- [ ] return_url正确解码
- [ ] 跳转回原站点
- [ ] 携带code和state参数
- [ ] 成功提示显示
- [ ] 错误提示显示

## ✅ 集成测试

### OAuth完整流程

#### 微信登录
1. [ ] 用户在inventory_master点击微信登录
2. [ ] 跳转到站群OAuth回调页
3. [ ] OAuth回调页跳转到微信授权页面
4. [ ] 微信授权后回调到站群
5. [ ] 站群接收code并跳转回inventory_master
6. [ ] inventory_master接收code
7. [ ] 调用站群API完成登录
8. [ ] 返回用户信息和token
9. [ ] 登录成功跳转首页

#### QQ登录
1. [ ] 用户在inventory_master点击QQ登录
2. [ ] 跳转到站群OAuth回调页
3. [ ] OAuth回调页跳转到QQ授权页面
4. [ ] QQ授权后回调到站群
5. [ ] 站群接收code并跳转回inventory_master
6. [ ] inventory_master接收code
7. [ ] 调用站群API完成登录
8. [ ] 返回用户信息和token
9. [ ] 登录成功跳转首页

### 跨域名测试
- [ ] potatofield.cn可以接收OAuth回调
- [ ] 回调参数正确传递
- [ ] 跳转回inventory-master.potatofield.cn
- [ ] code和state参数保持完整

### 认证状态测试
- [ ] 登录后Token有效
- [ ] 刷新页面保持登录状态
- [ ] Token过期后自动跳转登录
- [ ] 退出登录成功
- [ ] localStorage清除

## ✅ 性能测试

- [ ] 图形验证码生成速度 < 200ms
- [ ] 邮件发送速度 < 3s
- [ ] 登录响应速度 < 500ms
- [ ] 注册响应速度 < 1s
- [ ] 数据库查询优化
- [ ] Redis缓存正常工作

## ✅ 安全测试

- [ ] 密码加密存储（bcrypt）
- [ ] JWT Token签名验证
- [ ] 图形验证码防暴力破解
- [ ] 邮箱验证码防重放攻击
- [ ] SQL注入防护
- [ ] XSS防护
- [ ] CSRF防护
- [ ] 敏感信息不在日志中显示

## ✅ 兼容性测试

### 浏览器
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] 移动端浏览器

### 旧数据兼容
- [ ] 旧版用户可正常登录
- [ ] 旧API仍可使用
- [ ] 数据迁移不影响业务

## ✅ 部署验证

- [ ] 开发环境部署成功
- [ ] 测试环境部署成功
- [ ] 生产环境部署成功
- [ ] PM2进程正常运行
- [ ] 日志记录正常
- [ ] 监控告警配置

## 🐛 已知问题

记录测试中发现的问题：

1. 

## 📝 测试结论

- 测试时间：
- 测试人员：
- 测试环境：
- 测试结果：□ 通过  □ 部分通过  □ 未通过
- 备注：
