# 📦 Nginx 部署配置指南

## 🎯 配置说明

### 功能特性
- ✅ HTTP 自动重定向到 HTTPS
- ✅ API 反向代理（/api → http://localhost:9702）
- ✅ 前端 Vue Router history 模式支持
- ✅ Favicon 和 PWA 图标访问
- ✅ 静态资源长期缓存
- ✅ Gzip 压缩
- ✅ 安全头部配置
- ✅ 文件上传支持（最大 200MB）

---

## 🚀 部署步骤

### 1. 上传 Nginx 配置

```bash
# 将 nginx.conf 上传到服务器
scp nginx.conf user@server:/tmp/

# 在服务器上
sudo cp /tmp/nginx.conf /etc/nginx/sites-available/inventory-master.conf

# 创建软链接
sudo ln -s /etc/nginx/sites-available/inventory-master.conf /etc/nginx/sites-enabled/

# 如果已存在旧配置，先删除
sudo rm /etc/nginx/sites-enabled/inventory-master.conf
sudo ln -s /etc/nginx/sites-available/inventory-master.conf /etc/nginx/sites-enabled/
```

### 2. 创建前端目录结构

确保前端文件结构如下：

```
/web/inventory_master/frontend/
├── index.html
├── assets/
│   ├── *.css
│   ├── *.js
│   └── ...
└── icons/
    ├── favicon.ico
    ├── icon-192x192.png
    ├── icon-512x512.png
    └── ...
```

### 3. 上传前端构建产物

```bash
# 在本地构建
cd frontend
npm run build

# 上传到服务器
scp -r dist/* user@server:/web/inventory_master/frontend/

# 或使用 rsync（推荐）
rsync -avz --delete dist/ user@server:/web/inventory_master/frontend/
```

### 4. 测试 Nginx 配置

```bash
# 测试配置文件语法
sudo nginx -t

# 应该看到：
# nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
# nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### 5. 重启 Nginx

```bash
# 重新加载配置（推荐，无停机）
sudo nginx -s reload

# 或完全重启
sudo systemctl restart nginx

# 查看状态
sudo systemctl status nginx
```

### 6. 验证部署

```bash
# 测试 HTTPS 访问
curl -I https://inventory-master.potatofield.cn

# 测试 API 代理
curl https://inventory-master.potatofield.cn/api/

# 测试 Favicon
curl -I https://inventory-master.potatofield.cn/favicon.ico

# 测试 PWA 图标
curl -I https://inventory-master.potatofield.cn/icons/icon-192x192.png
```

---

## 📁 目录权限设置

```bash
# 设置正确的所有者和权限
sudo chown -R www-data:www-data /web/inventory_master/frontend
sudo chmod -R 755 /web/inventory_master/frontend

# 确保 Nginx 可以读取 SSL 证书
sudo chmod 644 /etc/nginx/ssl/potatofield/fullchain.cer
sudo chmod 600 /etc/nginx/ssl/potatofield/private.key
```

---

## 🔧 配置详解

### API 代理配置

```nginx
location /api {
    proxy_pass http://localhost:9702;  # 后端服务地址
    # ... 其他代理配置
}
```

**访问示例：**
- `https://inventory-master.potatofield.cn/api/auth/login`
- `https://inventory-master.potatofield.cn/api/materials`
- `https://inventory-master.potatofield.cn/api/categories`

### Favicon 配置

```nginx
location /favicon.ico {
    root /web/inventory_master/frontend/icons;
    # favicon.ico 应该在 /web/inventory_master/frontend/icons/favicon.ico
}
```

### PWA 图标配置

```nginx
location /icons/ {
    root /web/inventory_master/frontend;
    # 图标路径: /web/inventory_master/frontend/icons/*.png
}
```

### 静态资源缓存

- **JS/CSS/图片**: 缓存 1 年
- **index.html**: 不缓存（支持热更新）
- **API 响应**: 不缓存

---

## 🎨 前端图标文件准备

### 1. 创建 icons 目录

```bash
cd frontend/dist
mkdir -p icons
```

### 2. 准备图标文件

需要以下文件（在 `frontend/public/icons/` 中）：

```
icons/
├── favicon.ico          # 16x16, 32x32, 48x48
├── icon-192x192.png     # PWA 图标
├── icon-512x512.png     # PWA 图标
├── apple-touch-icon.png # iOS 图标
└── manifest.json        # PWA 清单（可选）
```

### 3. 更新 index.html

确保 `index.html` 中包含：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>物资管理系统</title>
</head>
<body>
  <div id="app"></div>
</body>
</html>
```

---

## 🔍 故障排查

### 问题 1: API 请求失败（404）

**检查后端服务：**
```bash
# 确认后端正在运行
pm2 status
curl http://localhost:9702/

# 查看后端日志
pm2 logs inventory-master-backend
```

**检查 Nginx 代理：**
```bash
# 查看 Nginx 错误日志
sudo tail -f /var/log/nginx/error.log

# 测试代理
curl -v http://localhost:9702/api/
```

### 问题 2: Favicon 不显示

**检查文件路径：**
```bash
# 确认文件存在
ls -la /web/inventory_master/frontend/icons/favicon.ico

# 测试访问
curl -I https://inventory-master.potatofield.cn/favicon.ico
```

**清除浏览器缓存：**
- Chrome: Ctrl+Shift+Delete
- 或使用隐私模式测试

### 问题 3: SSL 证书错误

**检查证书文件：**
```bash
# 验证证书
sudo openssl x509 -in /etc/nginx/ssl/potatofield/fullchain.cer -noout -text

# 检查权限
ls -la /etc/nginx/ssl/potatofield/
```

### 问题 4: 前端路由 404

**检查 try_files 配置：**
```nginx
location / {
    try_files $uri $uri/ /index.html;  # 正确
}
```

### 问题 5: 文件上传失败

**检查上传大小限制：**
```nginx
client_max_body_size 200M;  # 已设置为 200MB
```

---

## 📊 性能优化

### 启用 HTTP/2

```nginx
listen 443 ssl http2;  # 添加 http2
```

### 启用 Brotli 压缩（可选）

```bash
# 安装 Brotli 模块
sudo apt install nginx-module-brotli

# 在 nginx.conf 中添加
load_module modules/ngx_http_brotli_filter_module.so;
load_module modules/ngx_http_brotli_static_module.so;

# 在 server 块中添加
brotli on;
brotli_types text/plain text/css application/json application/javascript text/xml;
```

### CDN 配置（可选）

如果使用 CDN，添加：

```nginx
add_header Access-Control-Allow-Origin "*";
```

---

## 🔒 安全加固

### 1. 隐藏 Nginx 版本

编辑 `/etc/nginx/nginx.conf`：

```nginx
http {
    server_tokens off;  # 隐藏版本号
}
```

### 2. 限制请求方法

```nginx
if ($request_method !~ ^(GET|POST|PUT|DELETE|OPTIONS)$) {
    return 405;
}
```

### 3. 防止 DDoS

```nginx
# 限制连接数
limit_conn_zone $binary_remote_addr zone=addr:10m;
limit_conn addr 10;

# 限制请求速率
limit_req_zone $binary_remote_addr zone=req:10m rate=10r/s;
limit_req zone=req burst=20;
```

---

## 📝 日志配置

### 访问日志

```nginx
access_log /var/log/nginx/inventory-master-access.log;
error_log /var/log/nginx/inventory-master-error.log;
```

### 查看日志

```bash
# 实时查看访问日志
sudo tail -f /var/log/nginx/inventory-master-access.log

# 实时查看错误日志
sudo tail -f /var/log/nginx/inventory-master-error.log

# 查看最近的错误
sudo tail -100 /var/log/nginx/error.log | grep inventory-master
```

---

## 🎉 完整部署检查清单

- [ ] Nginx 配置文件已上传并链接
- [ ] Nginx 配置测试通过（`nginx -t`）
- [ ] 前端文件已上传到 `/web/inventory_master/frontend/`
- [ ] Icons 目录已创建，图标文件已上传
- [ ] 后端服务正在运行（`pm2 status`）
- [ ] Nginx 已重启（`nginx -s reload`）
- [ ] HTTPS 访问正常
- [ ] API 代理正常（测试 `/api/` 路径）
- [ ] Favicon 显示正常
- [ ] 前端路由正常（刷新页面不 404）
- [ ] 文件上传功能正常
- [ ] SSL 证书有效

---

## 🚀 自动化部署脚本

创建 `deploy-frontend.sh`：

```bash
#!/bin/bash
# 前端自动部署脚本

set -e

echo "🚀 开始部署前端..."

# 1. 构建
echo "📦 构建前端..."
cd frontend
npm install
npm run build

# 2. 上传
echo "📤 上传到服务器..."
rsync -avz --delete \
  --exclude 'node_modules' \
  --exclude '.git' \
  dist/ user@server:/web/inventory_master/frontend/

# 3. 设置权限
echo "🔐 设置权限..."
ssh user@server "sudo chown -R www-data:www-data /web/inventory_master/frontend && sudo chmod -R 755 /web/inventory_master/frontend"

# 4. 重载 Nginx
echo "♻️  重载 Nginx..."
ssh user@server "sudo nginx -s reload"

echo "✅ 部署完成！"
echo "🌐 访问: https://inventory-master.potatofield.cn"
```

使用方法：

```bash
chmod +x deploy-frontend.sh
./deploy-frontend.sh
```

---

最后更新: 2025-11-25
