# 头像和图片上传功能完整实现

## 概述

本次更新实现了与站群项目一致的图片上传逻辑：

1. **用户头像上传**：上传到COS桶中，保存CDN链接到数据库
2. **第三方头像处理**：下载第三方（微信/QQ）头像后重新上传到COS
3. **物资图片上传**：通过指定前缀将图片分类存储，保存CDN链接

## 技术实现

### 1. COS服务改造 (`backend/src/services/cosService.ts`)

#### 新增方法

```typescript
// 通用上传方法（支持自定义key路径）
export const uploadToCos = async (options: UploadOptions): Promise<string>

// 通用删除方法（支持key或url）
export const deleteFromCos = async (options: { key?: string; url?: string }): Promise<void>
```

#### 核心特性

- **CDN URL 支持**：通过环境变量 `COS_CDN_BASE_URL` 配置CDN域名
- **目录结构化**：支持完整的 key 路径（包含目录前缀）
- **兼容旧代码**：保留 `uploadFile` 和 `deleteFile` 方法

#### 环境变量配置

在 `.env` 文件中添加：

```env
COS_CDN_BASE_URL=https://your-cdn-domain.com/
```

如果不配置，默认使用：`https://${BUCKET}.cos.${REGION}.myqcloud.com/`

---

### 2. 用户头像上传功能

#### 后端实现 (`backend/src/controllers/accountController.ts`)

##### 上传头像

```typescript
POST /api/v2/auth/upload-avatar
Content-Type: multipart/form-data

// 请求体
{
  avatar: File // 图片文件
}
```

**处理流程：**
1. 删除旧头像（如果存在）
2. 使用 Sharp 压缩图片至 640x640，转换为 WebP 格式
3. 生成文件名：`User/Avatars/user_${MD5(userId)}_${timestamp}.webp`
4. 上传到COS，获取CDN链接
5. 更新数据库中的头像字段

##### 删除头像

```typescript
DELETE /api/v2/auth/delete-avatar
```

**处理流程：**
1. 从COS删除头像文件
2. 更新数据库，设置 `avatar` 为 `null`

#### 前端API (`frontend/src/api/account.ts`)

```typescript
// 上传头像
import { uploadAvatar } from '@/api/account';

const handleUpload = async (file: File) => {
  const response = await uploadAvatar(file);
  console.log('上传成功:', response.data.avatar);
};

// 删除头像
import { deleteAvatar } from '@/api/account';

const handleDelete = async () => {
  await deleteAvatar();
  console.log('删除成功');
};
```

---

### 3. OAuth头像处理 (`backend/src/controllers/oauthController.ts`)

#### 注册时处理第三方头像

在 `oauthRegister` 函数中：

```typescript
// 1. 下载第三方头像
const avatarBuffer = await downloadAvatar(avatarUrl);

// 2. 压缩并转换为webp
const compressedBuffer = await sharp(avatarBuffer)
  .resize(640, 640, { fit: 'cover' })
  .webp({ quality: 80 })
  .toBuffer();

// 3. 生成文件名
const hash = crypto.createHash('md5').update(String(user.id)).digest('hex');
const key = `User/Avatars/user_${hash}_${Date.now()}.webp`;

// 4. 上传到COS
const avatar = await uploadToCos({
  buffer: compressedBuffer,
  key,
  contentType: 'image/webp',
});

// 5. 保存到数据库
await UserProfile.create({
  userId: user.id,
  avatar,
  nickname,
});
```

**特点：**
- 第三方头像不再直接使用外部链接
- 统一存储在自己的COS桶中
- 确保头像的可用性和加载速度

---

### 4. 物资图片上传优化 (`backend/src/controllers/materialController.ts`)

#### 目录结构

物资图片统一存储在：`Materials/Images/` 目录下

#### 创建物资时上传图片

```typescript
// 生成文件名
const hash = crypto.createHash('md5')
  .update(`${userId}_${timestamp}`)
  .digest('hex');
const key = `Materials/Images/material_${hash}.webp`;

// 上传到COS
const photoUrl = await uploadToCos({
  buffer: processedImage.buffer,
  key,
  contentType: 'image/webp',
});
```

#### 更新物资时替换图片

```typescript
// 1. 删除旧图片
if (material.photoUrl) {
  await deleteFromCos({ url: material.photoUrl });
}

// 2. 上传新图片
const photoUrl = await uploadToCos({
  buffer: processedImage.buffer,
  key: newKey,
  contentType: 'image/webp',
});

// 3. 更新数据库
await material.update({ photoUrl });
```

---

## COS目录结构

```
COS Bucket Root
├── User/
│   └── Avatars/
│       └── user_{MD5}_{timestamp}.webp      # 用户头像
├── Materials/
│   └── Images/
│       └── material_{MD5}.webp              # 物资图片
└── materials/                               # 旧版物资图片（兼容）
    └── material_{UUID}.webp
```

---

## 图片处理规范

### 用户头像
- **尺寸**：640x640 像素
- **格式**：WebP
- **质量**：80%
- **裁剪**：cover（保持比例，填充整个区域）

### 物资图片
- **最大尺寸**：1920x1920 像素
- **格式**：WebP
- **质量**：80%
- **裁剪**：inside（保持比例，不放大）

### 第三方头像
- **尺寸**：640x640 像素
- **格式**：WebP
- **质量**：80%
- **来源**：微信、QQ等OAuth提供商

---

## 数据库字段

### User_profile 表

```sql
CREATE TABLE User_profile (
  user_id INT UNSIGNED PRIMARY KEY,
  nickname VARCHAR(32),
  avatar VARCHAR(255),      -- 存储CDN完整URL
  intro TEXT,
  created_at DATETIME,
  updated_at DATETIME
);
```

### Material 表

```sql
CREATE TABLE Material (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED,
  name VARCHAR(255),
  photo_url VARCHAR(255),   -- 存储CDN完整URL
  -- ... 其他字段
);
```

---

## 与站群项目的对应关系

| 站群项目 | 当前项目 | 说明 |
|---------|---------|------|
| `uploadToCos({ buffer, key })` | `uploadToCos({ buffer, key, contentType })` | 完全一致，增加contentType参数 |
| `deleteFromCos({ url })` | `deleteFromCos({ url })` | 完全一致 |
| `User/Avatars/user_${MD5}_${timestamp}.webp` | 同左 | 头像命名规则一致 |
| `MediaCenter/Images/...` | `Materials/Images/...` | 目录结构类似 |
| `sharp.resize(640, 640).webp()` | 同左 | 图片处理规则一致 |

---

## 使用示例

### 1. 前端上传头像

```vue
<template>
  <div>
    <input type="file" @change="handleFileSelect" accept="image/*" />
    <button @click="handleUpload">上传头像</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { uploadAvatar } from '@/api/account';

const selectedFile = ref(null);

const handleFileSelect = (event) => {
  selectedFile.value = event.target.files[0];
};

const handleUpload = async () => {
  if (!selectedFile.value) return;
  
  try {
    const response = await uploadAvatar(selectedFile.value);
    console.log('头像URL:', response.data.avatar);
    // 更新UI显示新头像
  } catch (error) {
    console.error('上传失败:', error);
  }
};
</script>
```

### 2. 获取用户信息（包含头像）

```typescript
import { getCurrentUser } from '@/api/auth';

const fetchUserInfo = async () => {
  const response = await getCurrentUser();
  const avatar = response.data.profile?.avatar;
  console.log('用户头像:', avatar);
};
```

---

## 迁移指南

### 如果已有旧数据

1. **旧头像链接仍然有效**：无需迁移
2. **新上传的头像**：自动使用新的目录结构
3. **物资图片**：兼容旧的 `materials/` 目录

### 环境变量检查

确保 `.env` 文件包含：

```env
COS_SECRET_ID=your_secret_id
COS_SECRET_KEY=your_secret_key
COS_BUCKET=your_bucket_name
COS_REGION=ap-guangzhou
COS_CDN_BASE_URL=https://your-cdn-domain.com/  # 可选
```

---

## 测试清单

- [ ] 用户上传头像成功
- [ ] 用户删除头像成功
- [ ] 微信注册时头像自动下载并上传
- [ ] QQ注册时头像自动下载并上传
- [ ] 创建物资时上传图片
- [ ] 更新物资时替换图片
- [ ] 删除物资时图片同步删除
- [ ] 旧头像链接正常显示
- [ ] CDN链接加载速度正常

---

## 常见问题

### Q1: 上传失败怎么办？
- 检查COS配置是否正确
- 确认文件大小不超过5MB
- 查看后端日志获取详细错误信息

### Q2: 第三方头像下载失败？
- OAuth注册不会因为头像失败而中断
- 头像字段会设置为空字符串
- 用户可以后续手动上传头像

### Q3: 如何自定义CDN域名？
- 在COS控制台配置CDN加速
- 设置环境变量 `COS_CDN_BASE_URL`
- 重启后端服务

### Q4: 图片格式限制？
- 支持所有常见图片格式（JPEG, PNG, GIF, WebP等）
- 服务器会自动转换为WebP格式
- 前端无需特殊处理

---

## 版本历史

- **v1.0** (2025-11-27): 完整实现头像和图片上传功能，与站群项目保持一致
