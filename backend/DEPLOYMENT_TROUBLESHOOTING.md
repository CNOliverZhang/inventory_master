# 🚀 部署故障排查指南

## 问题: Cannot find module 'node:util'

### 错误信息
```
Cannot find module 'node:util'
```

---

## 🔍 问题原因

这个错误表明**服务器上的 Node.js 版本过低**。

### Node.js 版本要求

| 特性 | 最低版本 | 推荐版本 |
|------|----------|----------|
| `node:` 前缀导入 | 14.18.0 | 18.0.0+ |
| 本项目依赖 | 16.0.0+ | **20.x LTS** |
| PM2 兼容 | 14.0.0+ | 20.x LTS |

**当前项目需要 Node.js >= 18.0.0**

---

## ✅ 解决方案

### 方案 1: 升级服务器 Node.js（推荐）

#### 使用 nvm（推荐）

```bash
# 1. 检查当前版本
node --version

# 2. 安装 nvm（如果未安装）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc  # 或 source ~/.zshrc

# 3. 安装 Node.js 20 LTS
nvm install 20
nvm use 20
nvm alias default 20

# 4. 验证版本
node --version  # 应显示 v20.x.x
npm --version
```

#### 使用包管理器（Ubuntu/Debian）

```bash
# 1. 添加 NodeSource 仓库
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# 2. 安装 Node.js
sudo apt-get install -y nodejs

# 3. 验证版本
node --version
```

#### 使用包管理器（CentOS/RHEL）

```bash
# 1. 添加 NodeSource 仓库
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -

# 2. 安装 Node.js
sudo yum install -y nodejs

# 3. 验证版本
node --version
```

---

### 方案 2: 更新 PM2 配置（如果必须使用旧版 Node.js）

如果无法升级 Node.js，可以指定 Node.js 路径：

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'inventory-master-backend',
      script: './dist/index.js',
      interpreter: '/path/to/node20', // 指定 Node.js 20 路径
      // ... 其他配置
    }
  ]
}
```

---

## 🧪 部署前检查

### 创建部署检查脚本

在服务器上运行以下脚本检查环境：

```bash
#!/bin/bash
# check-deployment.sh

echo "🔍 检查部署环境..."
echo ""

# 检查 Node.js 版本
echo "📦 Node.js 版本:"
node --version
REQUIRED_VERSION="20"
CURRENT_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)

if [ "$CURRENT_VERSION" -lt "$REQUIRED_VERSION" ]; then
  echo "❌ Node.js 版本过低！需要 >= v${REQUIRED_VERSION}.0.0"
  echo "   当前版本: $(node --version)"
  exit 1
else
  echo "✅ Node.js 版本符合要求"
fi

# 检查 npm 版本
echo ""
echo "📦 npm 版本:"
npm --version

# 检查 PM2
echo ""
echo "📦 PM2 版本:"
if command -v pm2 &> /dev/null; then
  pm2 --version
  echo "✅ PM2 已安装"
else
  echo "❌ PM2 未安装"
  echo "   安装命令: npm install -g pm2"
fi

# 检查必要的环境变量
echo ""
echo "🔐 环境变量检查:"
if [ -f .env ]; then
  echo "✅ .env 文件存在"
else
  echo "❌ .env 文件不存在"
fi

# 检查数据库连接
echo ""
echo "🗄️  MySQL 连接检查:"
if command -v mysql &> /dev/null; then
  echo "✅ MySQL 客户端已安装"
else
  echo "⚠️  MySQL 客户端未安装（可选）"
fi

# 检查 Redis 连接
echo ""
echo "🔴 Redis 连接检查:"
if command -v redis-cli &> /dev/null; then
  echo "✅ Redis 客户端已安装"
else
  echo "⚠️  Redis 客户端未安装（可选）"
fi

echo ""
echo "✅ 环境检查完成！"
```

---

## 📋 完整部署流程

### 1. 服务器环境准备

```bash
# 升级 Node.js 到 20.x LTS
nvm install 20
nvm use 20
nvm alias default 20

# 安装 PM2（如果未安装）
npm install -g pm2

# 创建项目目录
mkdir -p ~/apps/inventory-master
cd ~/apps/inventory-master
```

### 2. 上传代码

**方式 A: Git 部署（推荐）**

```bash
# 在服务器上
cd ~/apps/inventory-master
git clone <你的仓库地址> .
git checkout master
```

**方式 B: 手动上传**

```bash
# 在本地打包
cd /Users/oliver/Projects/inventory_master
tar -czf inventory-master.tar.gz backend frontend

# 上传到服务器
scp inventory-master.tar.gz user@server:/path/to/apps/

# 在服务器上解压
tar -xzf inventory-master.tar.gz
```

### 3. 后端部署

```bash
cd backend

# 复制环境变量文件
cp .env.example .env
nano .env  # 编辑配置

# 安装依赖
npm install --production

# 构建 TypeScript
npm run build

# 启动服务
npm run pm2:start

# 查看状态
pm2 status
pm2 logs inventory-master-backend
```

### 4. 前端部署

```bash
cd frontend

# 安装依赖并构建
npm install
npm run build

# 部署到 Nginx（假设已安装 Nginx）
sudo cp -r dist/* /var/www/html/inventory-master/
```

### 5. Nginx 配置（可选）

```nginx
# /etc/nginx/sites-available/inventory-master
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html/inventory-master;
    index index.html;

    # 前端路由
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 代理
    location /api {
        proxy_pass http://localhost:9702;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

启用配置：

```bash
sudo ln -s /etc/nginx/sites-available/inventory-master /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🔧 常见问题

### 问题 1: PM2 启动失败

**检查日志：**
```bash
pm2 logs inventory-master-backend --lines 100
```

**常见原因：**
- 端口被占用
- 环境变量未配置
- Node.js 版本不匹配
- 依赖未安装

### 问题 2: 数据库连接失败

**检查配置：**
```bash
# 查看 .env
cat .env | grep DB_

# 测试 MySQL 连接
mysql -h 数据库地址 -u 用户名 -p
```

### 问题 3: Redis 连接失败

**检查 Redis：**
```bash
# 测试连接
redis-cli -h Redis地址 -p 端口 ping

# 查看 Redis 状态
redis-cli info
```

### 问题 4: SMTP 邮件发送失败

参考 `EMAIL_TROUBLESHOOTING.md`

---

## 📊 监控和维护

### PM2 常用命令

```bash
# 查看状态
pm2 status

# 查看日志
pm2 logs inventory-master-backend

# 重启服务
pm2 restart inventory-master-backend

# 停止服务
pm2 stop inventory-master-backend

# 删除服务
pm2 delete inventory-master-backend

# 保存 PM2 配置
pm2 save

# 设置开机自启
pm2 startup
```

### 日志管理

```bash
# 查看最近日志
pm2 logs --lines 100

# 清空日志
pm2 flush

# 日志轮转
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

---

## 🚀 自动化部署脚本

创建 `deploy.sh`：

```bash
#!/bin/bash
# deploy.sh - 自动化部署脚本

set -e  # 遇到错误立即退出

echo "🚀 开始部署..."

# 1. 拉取最新代码
echo "📥 拉取最新代码..."
git pull origin master

# 2. 后端部署
echo "🔨 构建后端..."
cd backend
npm install --production
npm run build

# 3. 重启服务
echo "♻️  重启后端服务..."
npm run pm2:reload

# 4. 前端部署
echo "🎨 构建前端..."
cd ../frontend
npm install
npm run build

# 5. 复制到 Nginx
echo "📦 部署前端..."
sudo cp -r dist/* /var/www/html/inventory-master/

# 6. 检查服务状态
echo "✅ 检查服务状态..."
pm2 status

echo "🎉 部署完成！"
```

使用方法：

```bash
chmod +x deploy.sh
./deploy.sh
```

---

## 📞 获取帮助

如果问题仍未解决：

1. **检查完整错误日志**
   ```bash
   pm2 logs inventory-master-backend --lines 200 --err
   ```

2. **检查系统资源**
   ```bash
   top
   df -h
   free -m
   ```

3. **验证 Node.js 版本**
   ```bash
   which node
   node --version
   pm2 info inventory-master-backend
   ```

---

最后更新: 2025-11-25
