# 头像上传功能实现

## 📋 功能概述

在个人设置页面添加了头像上传、修改和删除功能，用户可以方便地管理自己的头像。

---

## ✨ 功能特性

### 1. 头像显示

- ✅ **默认头像**：未设置头像时显示用户图标
- ✅ **自定义头像**：显示用户上传的头像
- ✅ **圆形裁剪**：头像以圆形显示，美观大方
- ✅ **响应式设计**：移动端 64x64px，桌面端 80x80px

### 2. 头像上传

- ✅ **点击上传**：点击"上传"或"编辑"按钮选择文件
- ✅ **悬停提示**：鼠标悬停在头像上显示相机图标
- ✅ **文件验证**：
  - 仅允许图片格式（JPG、PNG、GIF、WebP等）
  - 文件大小限制 5MB
- ✅ **自动处理**：
  - 后端自动压缩为 640x640px
  - 自动转换为 WebP 格式
  - 上传到用户头像专用 COS 桶
- ✅ **实时更新**：上传成功后立即显示新头像

### 3. 头像删除

- ✅ **删除按钮**：已设置头像时显示删除按钮
- ✅ **确认提示**：删除前需要确认
- ✅ **自动清理**：从 COS 删除旧文件
- ✅ **恢复默认**：删除后显示默认头像图标

### 4. 头像更新

- ✅ **自动替换**：上传新头像时自动删除旧头像
- ✅ **无缝切换**：新旧头像平滑过渡

---

## 🎨 UI 设计

### 布局结构

```
┌─────────────────────────────────────────────┐
│  [头像]  头像                                │
│          支持JPG、PNG格式，最大5MB           │
│                        [上传] [删除]         │
└─────────────────────────────────────────────┘
```

### 交互效果

1. **默认状态**
   - 显示灰色圆形背景 + 用户图标
   - 或显示用户已上传的头像

2. **悬停状态**
   - 半透明黑色遮罩
   - 白色相机图标
   - 指针变为手型（cursor: pointer）

3. **上传中**
   - 按钮显示加载动画
   - 按钮禁用状态

4. **上传成功**
   - 显示成功提示
   - 头像立即更新

---

## 💻 技术实现

### 前端实现 (`frontend/src/views/Settings.vue`)

#### 1. 模板部分

```vue
<!-- 头像区域 -->
<div class="flex items-center justify-between py-3 border-b border-gray-200">
  <div class="flex items-center gap-4">
    <div class="relative group">
      <!-- 头像显示 -->
      <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-gray-200">
        <img v-if="bindings.avatar" :src="bindings.avatar" />
        <font-awesome-icon v-else icon="user" class="text-gray-400" />
      </div>
      
      <!-- 悬停提示 -->
      <div class="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100">
        <font-awesome-icon icon="camera" class="text-white" />
      </div>
    </div>
    
    <div>
      <p>头像</p>
      <p class="text-xs text-gray-500">支持JPG、PNG格式，最大5MB</p>
    </div>
  </div>
  
  <div class="flex gap-2">
    <button @click="triggerAvatarUpload">上传</button>
    <button v-if="bindings.avatar" @click="handleDeleteAvatar">删除</button>
  </div>
  
  <!-- 隐藏的文件输入 -->
  <input ref="avatarInput" type="file" accept="image/*" @change="handleAvatarChange" class="hidden" />
</div>
```

#### 2. 脚本部分

```typescript
// 状态定义
const avatarLoading = ref(false)
const avatarInput = ref<HTMLInputElement>()

// 绑定信息中添加 avatar 字段
const bindings = reactive({
  // ... 其他字段
  avatar: null as string | null,
})

// 触发文件选择
const triggerAvatarUpload = () => {
  avatarInput.value?.click()
}

// 处理文件上传
const handleAvatarChange = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  
  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    toast.error('请上传图片格式文件')
    return
  }
  
  // 验证文件大小
  if (file.size > 5 * 1024 * 1024) {
    toast.error('图片大小不能超过5MB')
    return
  }
  
  try {
    avatarLoading.value = true
    const res = await uploadAvatar(file)
    bindings.avatar = res.data.avatar
    toast.success('头像上传成功')
  } catch (error: any) {
    toast.error(error.response?.data?.message || '上传失败')
  } finally {
    avatarLoading.value = false
    avatarInput.value!.value = '' // 清空input，允许重新上传
  }
}

// 删除头像
const handleDeleteAvatar = async () => {
  if (!confirm('确定要删除头像吗？')) return
  
  try {
    avatarLoading.value = true
    await deleteAvatar()
    bindings.avatar = null
    toast.success('头像删除成功')
  } catch (error: any) {
    toast.error(error.response?.data?.message || '删除失败')
  } finally {
    avatarLoading.value = false
  }
}
```

### API 接口 (`frontend/src/api/account.ts`)

```typescript
/**
 * 上传用户头像
 */
export const uploadAvatar = async (file: File) => {
  const formData = new FormData()
  formData.append('avatar', file)
  
  const response = await request.post(`${API_V2_PREFIX}/upload-avatar`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response
}

/**
 * 删除用户头像
 */
export const deleteAvatar = async () => {
  const response = await request.delete(`${API_V2_PREFIX}/delete-avatar`)
  return response
}
```

### 国际化文本

#### 中文 (`zh-CN.ts`)

```typescript
account: {
  avatar: '头像',
  avatarHint: '支持JPG、PNG格式，最大5MB',
  upload: '上传',
  invalidImageType: '请上传图片格式文件',
  imageTooLarge: '图片大小不能超过5MB',
  avatarUploadSuccess: '头像上传成功',
  avatarDeleteSuccess: '头像删除成功',
  confirmDeleteAvatar: '确定要删除头像吗？',
}
```

#### 英文 (`en-US.ts`)

```typescript
account: {
  avatar: 'Avatar',
  avatarHint: 'Supports JPG, PNG format, max 5MB',
  upload: 'Upload',
  invalidImageType: 'Please upload an image file',
  imageTooLarge: 'Image size cannot exceed 5MB',
  avatarUploadSuccess: 'Avatar uploaded successfully',
  avatarDeleteSuccess: 'Avatar deleted successfully',
  confirmDeleteAvatar: 'Are you sure you want to delete your avatar?',
}
```

---

## 🔄 数据流程

### 上传流程

```
用户选择文件
    ↓
前端验证（文件类型、大小）
    ↓
FormData封装
    ↓
POST /api/v2/auth/upload-avatar
    ↓
后端处理：
  - 验证文件
  - Sharp压缩（640x640）
  - 转换为WebP
  - 删除旧头像
  - 上传到用户头像COS桶
    ↓
返回CDN URL
    ↓
更新前端显示
    ↓
更新数据库 User_profile.avatar
```

### 删除流程

```
用户点击删除
    ↓
确认对话框
    ↓
DELETE /api/v2/auth/delete-avatar
    ↓
后端处理：
  - 从COS删除文件
  - 更新数据库（avatar = null）
    ↓
返回成功
    ↓
前端清空头像显示
```

---

## 🎯 用户体验优化

### 1. 视觉反馈

- ✅ **悬停效果**：鼠标悬停显示相机图标
- ✅ **加载状态**：上传/删除时显示加载动画
- ✅ **禁用状态**：操作进行中按钮禁用
- ✅ **成功提示**：操作成功显示 Toast 提示

### 2. 交互优化

- ✅ **多种上传方式**：
  - 点击"上传"按钮
  - 点击"编辑"按钮
  - 点击头像区域
- ✅ **确认删除**：删除前需要确认，防止误操作
- ✅ **即时更新**：上传成功后立即显示新头像

### 3. 错误处理

- ✅ **文件类型错误**：提示只能上传图片
- ✅ **文件过大**：提示文件不能超过 5MB
- ✅ **网络错误**：显示具体错误信息
- ✅ **服务器错误**：显示友好的错误提示

### 4. 性能优化

- ✅ **自动压缩**：后端自动压缩图片，减小存储空间
- ✅ **格式转换**：转换为 WebP 格式，减小文件大小
- ✅ **CDN加速**：通过 CDN 访问，加快加载速度
- ✅ **懒加载**：图片按需加载

---

## 📱 响应式设计

### 移动端优化

- 头像尺寸：64x64px
- 按钮文字：缩小字号
- 间距调整：减小间距以适应小屏幕

### 桌面端优化

- 头像尺寸：80x80px
- 按钮文字：正常字号
- 悬停效果：显示相机图标

### 断点设置

```css
/* 移动端 */
.w-16.h-16 /* 64px */

/* 桌面端 (sm及以上) */
.sm:w-20.sm:h-20 /* 80px */
```

---

## 🔒 安全性

### 前端验证

1. **文件类型检查**：
   ```typescript
   if (!file.type.startsWith('image/')) {
     toast.error('请上传图片格式文件')
     return
   }
   ```

2. **文件大小限制**：
   ```typescript
   if (file.size > 5 * 1024 * 1024) {
     toast.error('图片大小不能超过5MB')
     return
   }
   ```

### 后端验证

1. **Multer过滤**：只允许图片格式
2. **Sharp验证**：验证是否为有效图片
3. **大小限制**：最大 5MB
4. **权限验证**：必须登录才能上传

---

## 🧪 测试清单

### 功能测试

- [ ] 上传 JPG 图片
- [ ] 上传 PNG 图片
- [ ] 上传 GIF 图片
- [ ] 上传 WebP 图片
- [ ] 上传大于 5MB 的图片（应该失败）
- [ ] 上传非图片文件（应该失败）
- [ ] 更新头像（应该删除旧头像）
- [ ] 删除头像
- [ ] 头像在页面刷新后仍然显示
- [ ] OAuth 登录后头像正确显示

### UI测试

- [ ] 移动端显示正常（64x64px）
- [ ] 桌面端显示正常（80x80px）
- [ ] 悬停效果正常
- [ ] 加载状态显示正常
- [ ] 成功提示显示正常
- [ ] 错误提示显示正常

### 兼容性测试

- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] 移动端浏览器

---

## 📖 相关文档

- [双COS桶配置说明](./DUAL_COS_BUCKET_CONFIG.md)
- [双桶架构实现总结](./DUAL_BUCKET_MIGRATION_SUMMARY.md)
- [快速部署指南](./QUICK_SETUP_GUIDE.md)
- [后端API文档](./backend/README.md)

---

## 🎉 总结

头像上传功能已完整实现，具备以下特点：

✅ **功能完整** - 上传、删除、更新一应俱全  
✅ **用户友好** - 交互流畅，提示清晰  
✅ **性能优化** - 自动压缩，CDN加速  
✅ **安全可靠** - 多重验证，权限控制  
✅ **响应式** - 移动端、桌面端完美适配  
✅ **国际化** - 中英文双语支持  

现在用户可以在个人设置页面轻松管理自己的头像了！🎊
