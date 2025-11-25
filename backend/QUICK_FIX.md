# ⚡ 快速修复指南：Cannot find module 'node:util'

## 🚨 问题
```
Cannot find module 'node:util'
```

## ✅ 解决方案（3步）

### 第 1 步：在服务器上检查 Node.js 版本

```bash
node --version
```

**如果显示版本低于 v18.0.0**，继续第 2 步。

---

### 第 2 步：升级 Node.js（推荐使用 nvm）

#### 方法 A：使用 nvm（最简单）

```bash
# 安装 nvm（如果未安装）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 重新加载配置
source ~/.bashrc  # 或 source ~/.zshrc

# 安装 Node.js 20 LTS
nvm install 20
nvm use 20
nvm alias default 20

# 验证版本
node --version  # 应该显示 v20.x.x
```

#### 方法 B：直接安装（Ubuntu/Debian）

```bash
# 添加 NodeSource 仓库
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# 安装 Node.js
sudo apt-get install -y nodejs

# 验证
node --version
```

#### 方法 C：直接安装（CentOS/RHEL）

```bash
# 添加 NodeSource 仓库
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -

# 安装 Node.js
sudo yum install -y nodejs

# 验证
node --version
```

---

### 第 3 步：重新部署

```bash
cd ~/apps/inventory-master/backend

# 重新安装依赖（使用新版 Node.js）
rm -rf node_modules package-lock.json
npm install

# 重新编译
npm run build

# 重启服务
pm2 restart inventory-master-backend

# 查看日志
pm2 logs inventory-master-backend
```

---

## 🧪 验证修复

### 检查服务状态

```bash
# 查看 PM2 状态
pm2 status

# 应该看到 "online" 状态
# ┌─────┬───────────────────────────┬─────────┬─────────┐
# │ id  │ name                      │ status  │ restart │
# ├─────┼───────────────────────────┼─────────┼─────────┤
# │ 0   │ inventory-master-backend  │ online  │ 0       │
# └─────┴───────────────────────────┴─────────┴─────────┘
```

### 测试 API

```bash
# 测试健康检查接口
curl http://localhost:9702/

# 应该返回项目信息
```

---

## 🔧 如果仍然失败

### 1. 查看完整错误日志

```bash
pm2 logs inventory-master-backend --lines 50 --err
```

### 2. 手动运行检查脚本

```bash
cd backend
npm run check:env
```

这会显示：
- ✅ Node.js 版本
- ✅ npm 版本
- ✅ PM2 状态
- ✅ 环境变量配置
- ✅ 编译产物
- ✅ 依赖安装状态
- ✅ 端口占用情况

### 3. 手动启动测试

```bash
# 直接运行编译后的代码
node dist/index.js

# 查看是否有其他错误
```

---

## 📋 完整部署检查清单

在服务器上执行：

```bash
cd backend

# ✓ 检查 Node.js 版本
node --version  # >= v18.0.0

# ✓ 检查环境变量
cat .env | head -5

# ✓ 检查依赖
ls node_modules | wc -l  # 应该有很多包

# ✓ 检查编译产物
ls -lh dist/index.js  # 应该存在

# ✓ 检查 PM2
pm2 status

# ✓ 运行环境检查脚本
npm run check:env
```

---

## 🎯 预防措施

### 1. 在 PM2 配置中指定 Node.js 版本

编辑 `ecosystem.config.js`：

```javascript
module.exports = {
  apps: [
    {
      name: 'inventory-master-backend',
      script: './dist/index.js',
      interpreter: 'node@20',  // 指定使用 Node.js 20
      // ... 其他配置
    }
  ]
}
```

### 2. 添加 Node.js 版本检查

在 `package.json` 中添加：

```json
{
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  }
}
```

### 3. 使用 .nvmrc 锁定版本

创建 `.nvmrc` 文件：

```bash
echo "20" > .nvmrc
```

部署时自动使用：

```bash
nvm use
```

---

## 📞 获取更多帮助

- 📖 完整部署指南：`DEPLOYMENT_TROUBLESHOOTING.md`
- 📧 邮件问题：`EMAIL_TROUBLESHOOTING.md`
- 🔍 运行环境检查：`npm run check:env`

---

## 🎉 常见成功标志

如果看到以下输出，说明部署成功：

```bash
$ pm2 logs inventory-master-backend

# ✅ 数据库已连接
# ✅ SMTP 服务器已就绪
# 🚀 服务器运行在端口 9702
```

---

最后更新: 2025-11-25
