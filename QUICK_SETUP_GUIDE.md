# 快速部署指南 - 头像和图片上传功能

## 📋 前置要求

- ✅ 腾讯云COS账号
- ✅ Node.js 16+
- ✅ MySQL 数据库
- ✅ Redis

---

## 🚀 快速开始（5分钟）

### 1. 配置COS

在后端 `.env` 文件中添加**双COS桶配置**：

```env
# 腾讯云 COS 通用配置
COS_SECRET_ID=AKIDxxxxxxxxxxxxxxxxx
COS_SECRET_KEY=xxxxxxxxxxxxxxxxxxxxxxxxx

# 用户头像 COS 配置（共享用户体系专用桶）
COS_USER_AVATAR_BUCKET=potatofield-user-avatars
COS_USER_AVATAR_REGION=ap-guangzhou
COS_USER_AVATAR_CDN_BASE_URL=https://user-avatars-cdn.example.com/

# 物资图片 COS 配置（本项目专用桶）
COS_MATERIAL_BUCKET=inventory-master-materials
COS_MATERIAL_REGION=ap-guangzhou
COS_MATERIAL_CDN_BASE_URL=https://materials-cdn.example.com/

# 兼容旧版本配置（可选）
COS_BUCKET=inventory-master-materials
COS_REGION=ap-guangzhou
```

> 💡 **双桶架构说明**：本项目使用两个COS桶分别存储用户头像和物资图片，详见 [DUAL_COS_BUCKET_CONFIG.md](./DUAL_COS_BUCKET_CONFIG.md)

### 2. 运行数据库迁移

```bash
cd backend
mysql -u root -p inventory_master < database_migrations/003_ensure_avatar_support.sql
```

### 3. 安装依赖（如果是新安装）

```bash
# 后端已有所有依赖
cd backend
npm install

# 前端已引入Font Awesome
cd frontend
npm install
```

### 4. 启动服务

```bash
# 启动后端
cd backend
npm run dev

# 启动前端（新终端）
cd frontend
npm run dev
```

### 5. 测试上传功能

访问 `http://localhost:5173`，登录后：
- 进入个人设置
- 尝试上传头像
- 检查是否成功显示

---

## 🔧 COS配置详解

### 双COS桶架构

本项目使用两个独立的COS桶：

**1. 用户头像桶（共享用户体系）**
- 用途：存储所有用户的头像
- 特点：跨项目共享，多个项目使用同一用户体系
- 配置：`COS_USER_AVATAR_BUCKET`

**2. 物资图片桶（项目专用）**
- 用途：存储本项目的物资预览图
- 特点：项目独立，数据隔离
- 配置：`COS_MATERIAL_BUCKET`

详细说明请查看：[DUAL_COS_BUCKET_CONFIG.md](./DUAL_COS_BUCKET_CONFIG.md)

### 获取COS凭证

1. 登录 [腾讯云控制台](https://console.cloud.tencent.com/)
2. 进入 [访问密钥](https://console.cloud.tencent.com/cam/capi)
3. 创建或查看API密钥
4. 复制 `SecretId` 和 `SecretKey`

### 创建COS桶

1. 进入 [对象存储COS](https://console.cloud.tencent.com/cos5)
2. 创建**两个**存储桶：
   - `potatofield-user-avatars`（用户头像，跨项目共享）
   - `inventory-master-materials`（物资图片，本项目专用）
3. 配置**公有读私有写**权限
4. （可选）配置CDN加速

### 目录权限配置

**用户头像桶**需要允许上传：
```
/User/Avatars/
```

**物资图片桶**需要允许上传：
```
/Materials/Images/
```

**推荐配置：**
- 访问权限：公有读、私有写
- 防盗链：根据需要配置
- 跨域CORS：允许前端域名

---

## 📂 目录结构说明

上传后的文件会自动组织到对应的COS桶中：

**用户头像桶**：
```
potatofield-user-avatars/
└── User/
    └── Avatars/
        ├── user_abc123_1638000001.webp
        ├── user_def456_1638000002.webp
        └── ...
```

**物资图片桶**：
```
inventory-master-materials/
└── Materials/
    └── Images/
        ├── material_xyz789.webp
        ├── material_uvw012.webp
        └── ...
```

---

## ✅ 功能验证清单

### 基础功能

- [ ] 用户可以上传头像
- [ ] 用户可以删除头像
- [ ] 用户可以更新头像（自动删除旧头像）
- [ ] 微信登录时自动下载并保存头像
- [ ] QQ登录时自动下载并保存头像
- [ ] 创建物资时可以上传图片
- [ ] 更新物资时可以替换图片
- [ ] 删除物资时图片同步删除

### 图片处理验证

- [ ] 上传的图片自动转换为WebP格式
- [ ] 头像自动压缩为640x640
- [ ] 物资图片最大尺寸为1920x1920
- [ ] 文件大小明显减小

### 存储验证

在COS控制台检查：
- [ ] 文件路径正确（User/Avatars/ 或 Materials/Images/）
- [ ] 文件格式为.webp
- [ ] 文件可以通过CDN链接访问

---

## 🔍 问题排查

### 问题1: 上传失败 - "COS配置错误"

**检查步骤：**
```bash
# 查看环境变量
cd backend
cat .env | grep COS

# 预期输出：
# COS_SECRET_ID=AKID...
# COS_SECRET_KEY=...
# COS_BUCKET=...
# COS_REGION=ap-guangzhou
```

**解决方法：**
- 确认 `.env` 文件存在且配置正确
- 重启后端服务使配置生效

---

### 问题2: 上传成功但图片不显示

**检查步骤：**
1. 打开浏览器开发者工具
2. 查看Network标签
3. 找到头像图片请求
4. 检查状态码和响应

**可能原因：**
- COS桶权限不是"公有读"
- CDN链接配置错误
- 防火墙阻止了COS域名

**解决方法：**
```bash
# 测试CDN链接
curl -I https://your-bucket.cos.ap-guangzhou.myqcloud.com/User/Avatars/test.webp

# 预期：HTTP 200或404（如果文件不存在）
# 如果返回403，说明权限配置有问题
```

---

### 问题3: 微信/QQ头像下载失败

**现象：**
- 注册成功，但头像为空

**说明：**
- 这是正常的，头像下载失败不会阻止注册流程
- 用户可以后续手动上传头像

**日志检查：**
```bash
# 查看后端日志
cd backend
tail -f logs/app.log | grep "头像"

# 或者查看控制台输出
# 会看到类似：处理头像失败: ...
```

---

### 问题4: Sharp模块报错

**错误信息：**
```
Error: Cannot find module 'sharp'
或
Error: Something went wrong installing the "sharp" module
```

**解决方法：**
```bash
cd backend
npm rebuild sharp

# 如果还不行
npm uninstall sharp
npm install sharp
```

---

## 🎯 API使用示例

### 前端上传头像

```vue
<template>
  <div>
    <input 
      type="file" 
      ref="fileInput"
      @change="handleFileChange" 
      accept="image/*" 
    />
    <button @click="uploadAvatar">上传</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { uploadAvatar as uploadAvatarAPI } from '@/api/account';
import { ElMessage } from 'element-plus';

const fileInput = ref<HTMLInputElement>();
const selectedFile = ref<File | null>(null);

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0];
  }
};

const uploadAvatar = async () => {
  if (!selectedFile.value) {
    ElMessage.warning('请选择文件');
    return;
  }

  try {
    const response = await uploadAvatarAPI(selectedFile.value);
    ElMessage.success('上传成功');
    
    // 更新UI显示新头像
    console.log('新头像URL:', response.data.avatar);
    
    // 清空选择
    selectedFile.value = null;
    if (fileInput.value) {
      fileInput.value.value = '';
    }
  } catch (error) {
    ElMessage.error('上传失败');
    console.error(error);
  }
};
</script>
```

### 后端测试接口

```bash
# 上传头像
curl -X POST http://localhost:3000/api/v2/auth/upload-avatar \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "avatar=@/path/to/image.jpg"

# 删除头像
curl -X DELETE http://localhost:3000/api/v2/auth/delete-avatar \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📊 性能优化建议

### 1. 启用CDN加速

```env
# 配置自定义CDN域名
COS_CDN_BASE_URL=https://cdn.your-domain.com/
```

**步骤：**
1. 在COS控制台启用CDN加速
2. 绑定自定义域名
3. 配置CNAME解析
4. 更新 `.env` 配置

**效果：**
- 图片加载速度提升50%-80%
- 降低源站带宽消耗
- 更好的用户体验

### 2. 配置图片缓存

在CDN配置中设置：
```
Cache-Control: max-age=31536000, public
```

### 3. 启用图片处理（可选）

腾讯云COS支持实时图片处理：
```
https://your-bucket.cos.ap-guangzhou.myqcloud.com/avatar.webp?imageMogr2/thumbnail/200x200
```

---

## 🛡️ 安全建议

### 1. 文件类型验证

已实现：
- ✅ 前端验证：`accept="image/*"`
- ✅ 后端验证：Sharp解析图片
- ✅ Multer过滤：`file.mimetype.startsWith('image/')`

### 2. 文件大小限制

已设置：
- ✅ 最大5MB
- ✅ Multer自动拒绝超大文件

### 3. 访问控制

建议：
- 使用签名URL（如需要）
- 配置防盗链
- 限制上传频率

### 4. 敏感信息保护

```bash
# .env文件不要提交到Git
echo ".env" >> .gitignore

# 使用环境变量管理敏感信息
# 不要硬编码在代码中
```

---

## 📈 监控和日志

### 查看上传统计

```sql
-- 有头像的用户比例
SELECT 
    COUNT(*) as total,
    COUNT(avatar) as with_avatar,
    ROUND(COUNT(avatar)*100.0/COUNT(*), 2) as percentage
FROM User_profile;

-- 今日上传的物资图片数量
SELECT COUNT(*) 
FROM Material 
WHERE photo_url IS NOT NULL 
  AND DATE(created_at) = CURDATE();
```

### COS使用量监控

在COS控制台查看：
- 存储容量
- 流量使用
- 请求次数
- CDN命中率

---

## 🔄 更新和维护

### 更新依赖

```bash
cd backend
npm update sharp cos-nodejs-sdk-v5

cd frontend  
npm update axios
```

### 清理旧文件（可选）

如果需要清理无用的图片文件：

```sql
-- 查找数据库中不存在的头像文件
-- 需要配合脚本实现

-- 查找未使用的物资图片
SELECT photo_url 
FROM Material 
WHERE deleted_at IS NOT NULL;
```

---

## 📚 相关文档

- [双COS桶配置说明](./DUAL_COS_BUCKET_CONFIG.md) ⭐ **新增**
- [完整实现文档](./AVATAR_AND_IMAGE_UPLOAD.md)
- [测试清单](./TEST_UPLOAD_CHECKLIST.md)
- [实现总结](./UPLOAD_IMPLEMENTATION_SUMMARY.md)
- [腾讯云COS文档](https://cloud.tencent.com/document/product/436)
- [Sharp文档](https://sharp.pixelplumbing.com/)

---

## 💡 常见使用场景

### 场景1: 用户更换头像

```
用户操作 → 选择图片 → 上传 → 后端处理 → 删除旧头像 → 上传新头像 → 返回CDN链接 → 前端显示
```

### 场景2: OAuth注册

```
第三方登录 → 获取头像URL → 下载头像 → 压缩处理 → 上传COS → 保存链接 → 完成注册
```

### 场景3: 添加物资

```
填写信息 → 选择图片 → 上传 → 压缩处理 → 上传COS → 保存链接 → 创建物资记录
```

---

**部署完成后，建议运行完整的测试清单以确保所有功能正常工作。**

详见：[TEST_UPLOAD_CHECKLIST.md](./TEST_UPLOAD_CHECKLIST.md)
