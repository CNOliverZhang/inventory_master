# 前端邮箱验证功能集成说明

## 📋 功能概述

前端已完成邮箱验证功能的集成，实现了以下功能：

1. ✅ **发送验证码**：输入邮箱后发送验证码
2. ✅ **邮箱验证禁用**：未输入或格式不合法时禁用"发送验证码"按钮
3. ✅ **60秒倒计时**：发送后60秒内不能重复发送
4. ✅ **验证码输入**：仅在发送验证码后显示验证码输入框
5. ✅ **注册按钮禁用**：未输入验证码时禁用"完成注册"按钮
6. ✅ **格式验证**：验证码必须是6位数字

---

## 🎨 UI/UX 特性

### 注册流程

1. **第一步：填写基本信息**
   - 用户名（3-50个字符）
   - 邮箱
   - 密码（至少6位）
   - 确认密码

2. **第二步：发送验证码**
   - 邮箱格式验证通过后，"发送验证码"按钮启用
   - 点击后发送验证码到邮箱
   - 显示提示信息：验证码已发送，请查收邮件（有效期30分钟）

3. **第三步：输入验证码**
   - 验证码输入框显示（6位数字）
   - 输入时自动过滤非数字字符
   - 居中显示，加大字号，便于查看

4. **第四步：完成注册**
   - 输入6位验证码后，"完成注册"按钮启用
   - 提交验证，成功后跳转到首页

### 按钮状态

#### 发送验证码按钮

| 状态 | 显示 | 样式 |
|------|------|------|
| 未输入邮箱 | "发送验证码" | 禁用（灰色） |
| 邮箱格式错误 | "发送验证码" | 禁用（灰色） |
| 可以发送 | "发送验证码" | 启用（青色） |
| 发送中 | 转圈图标 + "发送验证码" | 禁用 |
| 倒计时中 | "60s" → "59s" → ... | 禁用（灰色） |
| 可重新发送 | "重新发送" | 启用（青色） |

#### 完成注册按钮

| 状态 | 显示 | 样式 |
|------|------|------|
| 未发送验证码 | "完成注册" | 禁用（灰色） |
| 未输入验证码 | "完成注册" | 禁用（灰色） |
| 验证码格式错误 | "完成注册" | 禁用（灰色） |
| 可以注册 | "完成注册" | 启用（渐变青色） |
| 注册中 | 转圈图标 + "完成注册" | 禁用 |

---

## 📁 修改的文件

### 1. `src/locales/zh-CN.ts` 和 `src/locales/en-US.ts`

**新增字段**：
```typescript
auth: {
  // 新增
  verificationCode: '验证码',
  registerBtn: '完成注册', // 修改
  sendCodeBtn: '发送验证码',
  resendCodeBtn: '重新发送',
  enterVerificationCode: '请输入6位验证码',
  verificationCodeRequired: '请输入验证码',
  verificationCodeInvalid: '验证码格式不正确（6位数字）',
  codeSentSuccess: '验证码已发送到您的邮箱',
  codeSentHint: '验证码已发送，请查收邮件（有效期30分钟）',
  codeResendHint: '验证码已重新发送',
  codeExpired: '验证码已过期，请重新发送',
  codeInvalid: '验证码错误',
  sendingCode: '发送中...',
  waitBeforeResend: '请等待 {seconds} 秒后再重新发送',
}
```

### 2. `src/api/auth.ts`

**新增接口**：
```typescript
// 发送注册验证码
export const sendRegisterCodeApi = (data: RegisterForm): Promise<...>

// 验证邮箱并完成注册
export const verifyEmailApi = (data: { email: string; code: string }): Promise<...>

// 重新发送验证码
export const resendCodeApi = (data: { email: string }): Promise<...>
```

### 3. `src/stores/user.ts`

**新增方法**：
```typescript
// 发送注册验证码
const sendRegisterCode = async (registerForm: RegisterForm) => { ... }

// 验证邮箱并完成注册
const verifyEmail = async (email: string, code: string) => { ... }

// 重新发送验证码
const resendCode = async (email: string) => { ... }
```

### 4. `src/views/Login.vue`

**主要变更**：

1. **新增状态**：
   ```typescript
   const codeSent = ref(false)          // 是否已发送验证码
   const sendingCode = ref(false)       // 是否正在发送
   const verificationCode = ref('')     // 验证码
   const countdown = ref(0)             // 倒计时秒数
   ```

2. **新增计算属性**：
   ```typescript
   const canSendCode = computed(() => {
     return isValidEmail(registerForm.email) && countdown.value === 0
   })
   
   const canRegister = computed(() => {
     return codeSent.value && isValidCode(verificationCode.value)
   })
   ```

3. **新增方法**：
   ```typescript
   const handleSendCode = async () => { ... }      // 发送验证码
   const handleCodeInput = (event: Event) => { ... } // 验证码输入过滤
   const startCountdown = () => { ... }            // 开始倒计时
   ```

4. **UI 改动**：
   - 邮箱输入框旁边添加"发送验证码"按钮
   - 发送验证码后显示提示信息
   - 动态显示验证码输入框
   - 验证码输入框样式优化（居中、加大字号、等宽字体）
   - 邮箱发送后禁用编辑（防止混淆）

---

## 🔄 注册流程示例

### 用户操作流程

```
1. 用户填写表单
   ├─ 输入用户名: "testuser"
   ├─ 输入邮箱: "user@example.com"
   ├─ 输入密码: "123456"
   └─ 确认密码: "123456"

2. 点击"发送验证码"
   ├─ 验证邮箱格式
   ├─ 调用 sendRegisterCode API
   ├─ 显示提示：验证码已发送
   ├─ 开始60秒倒计时
   └─ 显示验证码输入框

3. 用户收到邮件
   └─ 邮件中包含6位验证码（如：123456）

4. 输入验证码
   ├─ 输入: "123456"
   ├─ 自动过滤非数字字符
   └─ "完成注册"按钮启用

5. 点击"完成注册"
   ├─ 验证所有字段
   ├─ 调用 verifyEmail API
   ├─ 验证成功
   ├─ 保存 token 和用户信息
   └─ 跳转到首页
```

### 代码调用流程

```typescript
// 1. 发送验证码
handleSendCode()
  └─ userStore.sendRegisterCode(registerForm)
      └─ sendRegisterCodeApi(registerForm)
          └─ POST /api/auth/register
              └─ 后端发送邮件

// 2. 验证邮箱
handleRegister()
  └─ userStore.verifyEmail(email, code)
      └─ verifyEmailApi({ email, code })
          └─ POST /api/auth/verify-email
              └─ 后端验证并创建用户
```

---

## 🎯 验证规则

### 邮箱格式验证

```typescript
const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
```

### 验证码格式验证

```typescript
const isValidCode = (code: string): boolean => {
  return /^\d{6}$/.test(code)  // 必须是6位数字
}
```

### 发送验证码条件

- ✅ 邮箱格式合法
- ✅ 倒计时为0（60秒后可重新发送）

### 完成注册条件

- ✅ 已发送验证码
- ✅ 验证码格式合法（6位数字）
- ✅ 所有字段验证通过

---

## 🎨 样式特点

### 验证码输入框

```vue
<input
  class="w-full pl-10 pr-4 py-3 text-sm 
         tracking-widest    /* 字符间距加大 */
         text-center        /* 居中显示 */
         text-lg            /* 字号加大 */
         font-semibold"     /* 字体加粗 */
/>
```

### 发送按钮状态

```vue
<button
  :class="[
    canSendCode && !sendingCode
      ? 'bg-cyan-500 hover:bg-cyan-600 text-white'  /* 可用状态 */
      : 'bg-gray-200 text-gray-400 cursor-not-allowed'  /* 禁用状态 */
  ]"
>
```

### 提示信息

```vue
<p v-if="codeSent" class="text-xs text-cyan-600">
  <i class="pi pi-info-circle mr-1"></i>
  {{ t('auth.codeSentHint') }}
</p>
```

---

## 🛡️ 错误处理

### 前端验证错误

| 错误 | 提示信息 | 显示位置 |
|------|----------|----------|
| 邮箱未输入 | "请输入邮箱" | 邮箱输入框下方 |
| 邮箱格式错误 | "请输入正确的邮箱格式" | 邮箱输入框下方 |
| 验证码未输入 | "请输入验证码" | 验证码输入框下方 |
| 验证码格式错误 | "验证码格式不正确（6位数字）" | 验证码输入框下方 |

### 后端错误处理

后端错误通过 `toast` 全局提示显示，错误信息包括：

- 验证码错误或已过期
- 用户名已被使用
- 邮箱已被注册
- 发送邮件失败
- 网络错误

---

## 🔧 开发调试

### 测试发送验证码

```typescript
// 1. 填写表单
registerForm.username = 'testuser'
registerForm.email = 'test@example.com'
registerForm.password = '123456'
registerForm.confirmPassword = '123456'

// 2. 点击发送按钮
await handleSendCode()

// 3. 检查状态
console.log('codeSent:', codeSent.value)  // true
console.log('countdown:', countdown.value)  // 60
```

### 测试验证注册

```typescript
// 1. 输入验证码
verificationCode.value = '123456'

// 2. 检查按钮状态
console.log('canRegister:', canRegister.value)  // true

// 3. 点击注册
await handleRegister()
```

---

## 📱 响应式设计

邮箱验证功能已适配移动端：

- 发送按钮在小屏幕上保持合适宽度
- 验证码输入框在移动端友好
- 提示信息自动换行
- 按钮间距适配不同屏幕

---

## ⚙️ 配置项

### 倒计时时间

```typescript
const startCountdown = () => {
  countdown.value = 60  // 可调整倒计时秒数
  // ...
}
```

### 验证码长度

```typescript
const isValidCode = (code: string): boolean => {
  return /^\d{6}$/.test(code)  // 修改正则表达式可调整长度
}
```

---

## 🚀 使用示例

### 正常注册流程

```typescript
// 用户操作：
1. 填写用户名: testuser
2. 填写邮箱: test@example.com
3. 填写密码: 123456
4. 确认密码: 123456
5. 点击"发送验证码" → 邮箱收到验证码
6. 输入验证码: 123456
7. 点击"完成注册" → 注册成功，跳转首页
```

### 重新发送验证码

```typescript
// 用户操作：
1. 发送验证码后等待60秒
2. 按钮文字变为"重新发送"
3. 点击"重新发送" → 新验证码发送到邮箱
4. 输入新验证码完成注册
```

---

## ✅ 功能检查清单

- [x] 邮箱格式验证
- [x] 发送验证码按钮禁用/启用逻辑
- [x] 60秒倒计时
- [x] 验证码输入框动态显示
- [x] 验证码格式验证（6位数字）
- [x] 注册按钮禁用/启用逻辑
- [x] 错误提示显示
- [x] 成功提示（toast）
- [x] 切换标签时重置状态
- [x] 定时器清理（避免内存泄漏）
- [x] 国际化支持（中英文）
- [x] 响应式设计

---

## 📝 注意事项

1. **邮箱锁定**：发送验证码后邮箱输入框禁用，防止用户修改邮箱导致混淆
2. **倒计时清理**：切换标签或组件卸载时会自动清理倒计时定时器
3. **验证码过滤**：输入验证码时自动过滤非数字字符
4. **错误提示**：所有错误都会通过 toast 全局提示，用户体验友好
5. **状态管理**：验证码发送状态存储在组件内，不会持久化

---

## 🎉 总结

前端邮箱验证功能已完整实现，包括：

- ✅ 完善的 UI/UX 设计
- ✅ 严格的验证逻辑
- ✅ 友好的错误提示
- ✅ 响应式布局
- ✅ 国际化支持
- ✅ 良好的代码组织

用户可以流畅地完成邮箱验证注册流程！🚀
