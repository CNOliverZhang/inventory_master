# ⚡ 快速部署指令

## 📋 服务器上执行的命令（复制粘贴即可）

### 1️⃣ 更新 Nginx 配置

```bash
# 备份旧配置
sudo cp /etc/nginx/sites-available/inventory-master.conf /etc/nginx/sites-available/inventory-master.conf.bak

# 编辑配置文件
sudo nano /etc/nginx/sites-available/inventory-master.conf
```

**将以下内容完整复制到配置文件中：**

```nginx
# HTTP 重定向到 HTTPS
server {
    listen 80;
    server_name inventory-master.potatofield.cn;
    
    location / {
        rewrite ^(.*) https://$host$1 permanent;
    }
}

# HTTPS 主服务
server {
    listen 443 ssl;
    server_name inventory-master.potatofield.cn;

    # SSL 证书配置
    ssl_certificate /etc/nginx/ssl/potatofield/fullchain.cer;
    ssl_certificate_key /etc/nginx/ssl/potatofield/private.key;
    
    # SSL 优化配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # 上传文件大小限制
    client_max_body_size 200M;
    
    # 超时配置
    fastcgi_connect_timeout 240s;
    fastcgi_send_timeout 240s;
    fastcgi_read_timeout 240s;
    send_timeout 240s;
    
    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;
    
    # API 后端代理
    location /api {
        proxy_pass http://localhost:9702;
        proxy_http_version 1.1;
        
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        proxy_connect_timeout 240s;
        proxy_send_timeout 240s;
        proxy_read_timeout 240s;
        
        proxy_cache_bypass $http_upgrade;
        proxy_no_cache 1;
        add_header Cache-Control "no-store, no-cache, must-revalidate";
    }
    
    # Favicon 和 PWA 图标
    location /favicon.ico {
        root /web/inventory_master/frontend/icons;
        access_log off;
        log_not_found off;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    location /icons/ {
        root /web/inventory_master/frontend;
        access_log off;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    # 静态资源缓存
    location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$ {
        root /web/inventory_master/frontend;
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
    
    # 前端路由
    location / {
        root /web/inventory_master/frontend;
        try_files $uri $uri/ /index.html;
        
        location = /index.html {
            add_header Cache-Control "no-store, no-cache, must-revalidate";
            expires 0;
        }
    }
    
    # 安全头部
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

**保存并退出：**
- 按 `Ctrl + X`
- 按 `Y`
- 按 `Enter`

---

### 2️⃣ 测试并重载 Nginx

```bash
# 测试配置
sudo nginx -t

# 如果测试通过，重载配置
sudo nginx -s reload

# 查看状态
sudo systemctl status nginx
```

---

### 3️⃣ 确认后端服务运行

```bash
# 检查 PM2 状态
pm2 status

# 应该看到 inventory-master-backend 状态为 online

# 测试后端 API
curl http://localhost:9702/
```

---

### 4️⃣ 测试部署结果

```bash
# 测试 HTTPS
curl -I https://inventory-master.potatofield.cn

# 测试 API 代理
curl https://inventory-master.potatofield.cn/api/

# 测试 Favicon
curl -I https://inventory-master.potatofield.cn/favicon.ico
```

---

## 🎯 预期结果

### ✅ 正常情况

```bash
$ sudo nginx -t
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful

$ curl https://inventory-master.potatofield.cn/api/
{"message":"个人物资管理系统后端 API","version":"1.0.0"}

$ pm2 status
┌─────┬───────────────────────────┬─────────┬─────────┐
│ id  │ name                      │ status  │ restart │
├─────┼───────────────────────────┼─────────┼─────────┤
│ 0   │ inventory-master-backend  │ online  │ 0       │
└─────┴───────────────────────────┴─────────┴─────────┘
```

---

## ❌ 常见问题

### 问题 1: nginx -t 报错

**症状：**
```
nginx: [emerg] unknown directive "..."
```

**解决：**
- 检查配置文件格式（复制时可能有格式问题）
- 确保每行末尾有分号 `;`
- 确保括号成对出现 `{ }`

### 问题 2: API 代理不工作

**症状：**
```
curl https://inventory-master.potatofield.cn/api/
502 Bad Gateway
```

**解决：**
```bash
# 1. 检查后端是否运行
pm2 status
pm2 logs inventory-master-backend

# 2. 测试后端直接访问
curl http://localhost:9702/

# 3. 如果后端未运行，启动它
cd /path/to/backend
npm run pm2:start
```

### 问题 3: Favicon 404

**症状：**
浏览器显示 favicon 404

**解决：**
```bash
# 确保 icons 目录存在
mkdir -p /web/inventory_master/frontend/icons

# 上传 favicon.ico
# 从本地: scp frontend/public/icons/favicon.ico user@server:/web/inventory_master/frontend/icons/

# 设置权限
sudo chown -R www-data:www-data /web/inventory_master/frontend/icons
sudo chmod -R 755 /web/inventory_master/frontend/icons
```

---

## 📱 浏览器测试

在浏览器访问：

1. **首页**: https://inventory-master.potatofield.cn
2. **登录**: https://inventory-master.potatofield.cn/login
3. **API**: https://inventory-master.potatofield.cn/api/

**检查项：**
- [ ] 页面正常显示
- [ ] Favicon 显示
- [ ] 登录功能正常（测试 API）
- [ ] 刷新页面不 404
- [ ] 图片上传正常

---

## 🔍 查看日志

```bash
# Nginx 访问日志
sudo tail -f /var/log/nginx/access.log

# Nginx 错误日志
sudo tail -f /var/log/nginx/error.log

# 后端日志
pm2 logs inventory-master-backend

# 只看错误
pm2 logs inventory-master-backend --err
```

---

## 🎉 完成！

如果所有测试都通过，您的应用已成功部署！

访问地址：
- **前端**: https://inventory-master.potatofield.cn
- **API**: https://inventory-master.potatofield.cn/api/

---

最后更新: 2025-11-25
