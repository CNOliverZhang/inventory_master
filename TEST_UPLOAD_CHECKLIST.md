# 头像和图片上传功能测试清单

## 测试前准备

### 1. 环境变量配置

确保 `backend/.env` 文件包含以下配置：

```env
# COS配置
COS_SECRET_ID=your_secret_id
COS_SECRET_KEY=your_secret_key
COS_BUCKET=your_bucket_name
COS_REGION=ap-guangzhou

# CDN配置（可选，如果有CDN加速）
COS_CDN_BASE_URL=https://your-cdn-domain.com/
```

### 2. 启动服务

```bash
# 启动后端
cd backend
npm run dev

# 启动前端
cd frontend
npm run dev
```

---

## 测试用例

### ✅ 测试1: 用户头像上传

**步骤：**
1. 登录系统
2. 进入个人设置页面
3. 点击上传头像
4. 选择一张图片（支持JPEG、PNG、GIF等格式）
5. 提交上传

**预期结果：**
- [ ] 上传成功提示
- [ ] 头像立即显示在页面上
- [ ] 数据库 `User_profile.avatar` 字段更新为CDN链接
- [ ] COS桶中有对应文件：`User/Avatars/user_xxx_xxx.webp`
- [ ] 图片格式为WebP，尺寸640x640

**验证方法：**
```bash
# 查看数据库
SELECT avatar FROM User_profile WHERE user_id = ?;

# 访问CDN链接
curl -I <avatar_url>
```

---

### ✅ 测试2: 用户头像删除

**步骤：**
1. 已有头像的用户进入设置页面
2. 点击删除头像
3. 确认删除

**预期结果：**
- [ ] 删除成功提示
- [ ] 页面显示默认头像或占位符
- [ ] 数据库 `User_profile.avatar` 字段设为 `NULL`
- [ ] COS桶中对应文件被删除

**验证方法：**
```bash
# 查看数据库
SELECT avatar FROM User_profile WHERE user_id = ?;
# 结果应为 NULL

# 访问原CDN链接（应该404）
curl -I <old_avatar_url>
```

---

### ✅ 测试3: 头像更新（覆盖旧头像）

**步骤：**
1. 已有头像的用户
2. 再次上传新头像
3. 提交

**预期结果：**
- [ ] 新头像上传成功
- [ ] 旧头像文件被删除
- [ ] 数据库更新为新头像链接
- [ ] 页面显示新头像

**验证方法：**
```bash
# 记录旧头像URL
OLD_URL=<old_avatar_url>

# 上传新头像后
# 1. 旧链接应该404
curl -I $OLD_URL

# 2. 新链接正常
curl -I <new_avatar_url>
```

---

### ✅ 测试4: 微信OAuth注册（头像自动下载）

**步骤：**
1. 使用微信扫码登录（新用户）
2. 选择"注册新账号"
3. 完成注册

**预期结果：**
- [ ] 注册成功
- [ ] 用户头像为微信头像
- [ ] 数据库保存的是COS链接，不是微信的外部链接
- [ ] COS桶中有对应文件
- [ ] 即使微信头像链接失效，用户头像仍然可用

**验证方法：**
```bash
# 查看数据库中的头像链接
SELECT avatar FROM User_profile WHERE user_id = ?;

# 应该是类似这样的格式：
# https://your-bucket.cos.ap-guangzhou.myqcloud.com/User/Avatars/user_xxx.webp
# 而不是：
# http://thirdwx.qlogo.cn/...
```

---

### ✅ 测试5: QQ OAuth注册（头像自动下载）

**步骤：**
1. 使用QQ登录（新用户）
2. 选择"注册新账号"
3. 完成注册

**预期结果：**
- [ ] 同测试4，但头像来源为QQ
- [ ] 头像存储在自己的COS桶中

---

### ✅ 测试6: 物资图片上传

**步骤：**
1. 创建新物资
2. 上传物资图片
3. 保存

**预期结果：**
- [ ] 图片上传成功
- [ ] 物资详情显示图片
- [ ] 数据库 `Material.photo_url` 为CDN链接
- [ ] COS桶中文件路径：`Materials/Images/material_xxx.webp`
- [ ] 图片格式为WebP，最大尺寸1920x1920

**验证方法：**
```bash
# 查看数据库
SELECT photo_url FROM Material WHERE id = ?;

# 验证图片信息
curl -I <photo_url>
```

---

### ✅ 测试7: 物资图片更新

**步骤：**
1. 编辑已有物资
2. 上传新图片替换旧图片
3. 保存

**预期结果：**
- [ ] 新图片上传成功
- [ ] 旧图片文件被删除
- [ ] 数据库更新为新图片链接

---

### ✅ 测试8: 物资删除（图片同步删除）

**步骤：**
1. 删除带图片的物资
2. 确认删除

**预期结果：**
- [ ] 物资删除成功
- [ ] 图片文件从COS删除
- [ ] 原图片链接访问404

**验证方法：**
```bash
# 记录图片URL
PHOTO_URL=<photo_url>

# 删除物资后
curl -I $PHOTO_URL
# 应该返回404
```

---

### ✅ 测试9: 文件格式验证

**步骤：**
1. 尝试上传非图片文件（如PDF、DOCX）
2. 提交

**预期结果：**
- [ ] 上传被拒绝
- [ ] 显示错误提示："只允许上传图片文件"或类似信息

---

### ✅ 测试10: 文件大小限制

**步骤：**
1. 尝试上传超过5MB的图片
2. 提交

**预期结果：**
- [ ] 上传被拒绝
- [ ] 显示错误提示："文件过大"或类似信息

---

### ✅ 测试11: 图片压缩验证

**步骤：**
1. 上传一张4000x3000的大图
2. 检查上传后的文件

**预期结果：**
- [ ] 上传成功
- [ ] 图片被压缩为WebP格式
- [ ] 头像：640x640
- [ ] 物资图片：不超过1920x1920

**验证方法：**
```bash
# 下载图片
wget <image_url> -O test.webp

# 查看图片信息
identify test.webp
# 或
file test.webp
```

---

### ✅ 测试12: CDN链接访问

**步骤：**
1. 从数据库获取任意图片URL
2. 直接访问该URL

**预期结果：**
- [ ] 图片正常加载
- [ ] 响应头包含正确的Content-Type: image/webp
- [ ] 加载速度快（如果配置了CDN）

---

### ✅ 测试13: 异常情况 - 第三方头像下载失败

**步骤：**
1. 模拟OAuth注册
2. 第三方头像链接无效或超时

**预期结果：**
- [ ] 注册仍然成功
- [ ] 头像字段为空字符串
- [ ] 不影响其他功能
- [ ] 后端日志记录错误

---

### ✅ 测试14: 并发上传

**步骤：**
1. 同时打开多个标签页
2. 每个标签页上传不同的头像
3. 快速切换

**预期结果：**
- [ ] 所有上传都成功
- [ ] 最后一次上传的头像生效
- [ ] 没有文件冲突或覆盖错误

---

## 性能测试

### 📊 测试15: 上传速度

**测量指标：**
- [ ] 1MB图片上传时间 < 3秒
- [ ] 5MB图片上传时间 < 10秒
- [ ] 压缩处理时间 < 2秒

### 📊 测试16: 并发处理能力

**测试方法：**
```bash
# 使用ab或wrk进行压力测试
ab -n 100 -c 10 -p test.jpg -H "Authorization: Bearer <token>" \
   http://localhost:3000/api/v2/auth/upload-avatar
```

**预期结果：**
- [ ] 100个请求全部成功
- [ ] 没有文件名冲突
- [ ] 没有数据库死锁

---

## 安全测试

### 🔒 测试17: 未授权访问

**步骤：**
1. 不携带token
2. 尝试上传头像

**预期结果：**
- [ ] 返回401 Unauthorized
- [ ] 不允许上传

### 🔒 测试18: Token伪造

**步骤：**
1. 使用无效或过期的token
2. 尝试上传

**预期结果：**
- [ ] 返回401或403
- [ ] 上传失败

### 🔒 测试19: 文件类型伪装

**步骤：**
1. 将恶意脚本重命名为.jpg
2. 尝试上传

**预期结果：**
- [ ] 被服务器识别为非图片文件
- [ ] 上传被拒绝

---

## 回归测试

### 🔄 测试20: 旧数据兼容性

**步骤：**
1. 查看使用旧链接格式的头像
2. 查看旧的物资图片

**预期结果：**
- [ ] 旧头像链接仍然可以正常显示
- [ ] 旧物资图片可以正常显示
- [ ] 删除旧数据时文件能正确删除

---

## 测试报告模板

```markdown
## 测试执行日期：YYYY-MM-DD

### 环境信息
- 后端版本：
- 前端版本：
- COS配置：
- CDN配置：

### 测试结果汇总
- 总测试用例数：20
- 通过：
- 失败：
- 跳过：

### 失败用例详情
1. 测试X：
   - 失败原因：
   - 错误日志：
   - 修复建议：

### 性能数据
- 平均上传时间：
- 并发处理能力：
- CDN命中率：

### 备注
```

---

## 快速验证脚本

### 后端健康检查

```bash
#!/bin/bash

# 检查COS配置
if [ -z "$COS_SECRET_ID" ]; then
  echo "❌ COS_SECRET_ID未配置"
else
  echo "✅ COS_SECRET_ID已配置"
fi

# 检查后端服务
curl -s http://localhost:3000/api/v2/auth/captcha > /dev/null
if [ $? -eq 0 ]; then
  echo "✅ 后端服务运行正常"
else
  echo "❌ 后端服务未启动"
fi
```

### 数据库验证

```sql
-- 检查头像字段
SELECT 
  COUNT(*) as total_users,
  COUNT(avatar) as users_with_avatar,
  COUNT(*) - COUNT(avatar) as users_without_avatar
FROM User_profile;

-- 检查头像URL格式
SELECT avatar 
FROM User_profile 
WHERE avatar IS NOT NULL 
LIMIT 10;

-- 检查物资图片
SELECT 
  COUNT(*) as total_materials,
  COUNT(photo_url) as materials_with_photo
FROM Material;
```

---

## 常见问题排查

### 问题1: 上传后图片不显示
**排查步骤：**
1. 检查COS配置是否正确
2. 检查bucket权限（是否允许公开读取）
3. 检查CDN配置
4. 查看浏览器控制台网络请求

### 问题2: 图片格式错误
**排查步骤：**
1. 检查Sharp是否正确安装
2. 查看后端日志
3. 验证输入文件格式

### 问题3: 删除失败
**排查步骤：**
1. 检查COS删除权限
2. 验证URL解析逻辑
3. 查看后端错误日志

---

**测试完成后，请填写测试报告并提交给项目负责人。**
