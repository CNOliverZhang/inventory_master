# PM2 部署文档

本文档介绍如何使用 PM2 部署 Inventory Master Backend 服务。

## 前置要求

### 1. 安装 PM2

```bash
npm install -g pm2
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并填写配置：

```bash
# Windows PowerShell
Copy-Item .env.example .env

# Linux/Mac
cp .env.example .env
```

然后编辑 `.env` 文件，填写实际的配置信息。

## 部署方式

### 方式一：使用部署脚本（推荐）

#### Windows (PowerShell)

```powershell
# 完整部署（包含安装依赖、编译、启动）
.\deploy.ps1

# 快速更新（仅编译和重载，不安装依赖）
.\deploy.ps1 quick

# 启动服务
.\deploy.ps1 start

# 停止服务
.\deploy.ps1 stop

# 重启服务
.\deploy.ps1 restart

# 重载服务（零停机）
.\deploy.ps1 reload

# 查看状态
.\deploy.ps1 status

# 查看日志
.\deploy.ps1 logs

# 仅编译
.\deploy.ps1 build
```

#### Linux/Mac (Bash)

```bash
# 赋予执行权限
chmod +x deploy.sh

# 完整部署
./deploy.sh

# 快速更新
./deploy.sh quick

# 启动服务
./deploy.sh start

# 停止服务
./deploy.sh stop

# 重启服务
./deploy.sh restart

# 重载服务（零停机）
./deploy.sh reload

# 查看状态
./deploy.sh status

# 查看日志
./deploy.sh logs
```

### 方式二：使用 npm scripts

```bash
# 1. 安装依赖
npm install

# 2. 编译项目
npm run build

# 3. 启动 PM2
npm run pm2:start

# 其他命令
npm run pm2:stop      # 停止服务
npm run pm2:restart   # 重启服务
npm run pm2:reload    # 重载服务（零停机）
npm run pm2:logs      # 查看日志
npm run pm2:status    # 查看状态
npm run pm2:delete    # 删除进程

# 快速部署（编译并重载）
npm run deploy
```

### 方式三：直接使用 PM2 命令

```bash
# 1. 安装依赖并编译
npm install
npm run build

# 2. 启动服务
pm2 start ecosystem.config.js --env production

# 3. 保存进程列表
pm2 save

# 4. 设置开机自启（可选）
pm2 startup
# 按照提示执行命令
```

## PM2 常用命令

### 进程管理

```bash
# 查看所有进程
pm2 list

# 查看特定进程状态
pm2 status inventory-master-backend

# 查看进程详细信息
pm2 show inventory-master-backend

# 重启进程
pm2 restart inventory-master-backend

# 重载进程（零停机）
pm2 reload inventory-master-backend

# 停止进程
pm2 stop inventory-master-backend

# 删除进程
pm2 delete inventory-master-backend
```

### 日志管理

```bash
# 查看实时日志
pm2 logs inventory-master-backend

# 查看最近100行日志
pm2 logs inventory-master-backend --lines 100

# 清空日志
pm2 flush

# 查看错误日志
pm2 logs inventory-master-backend --err

# 查看输出日志
pm2 logs inventory-master-backend --out
```

### 监控和管理

```bash
# 实时监控
pm2 monit

# 查看资源使用情况
pm2 status

# 重置重启计数
pm2 reset inventory-master-backend
```

### 进程持久化

```bash
# 保存当前进程列表
pm2 save

# 重新加载保存的进程列表
pm2 resurrect

# 设置开机自启动
pm2 startup

# 取消开机自启动
pm2 unstartup
```

## 配置说明

### ecosystem.config.js

PM2 配置文件，包含以下关键配置：

- **instances**: 进程实例数量，设置为 1（单实例）
- **exec_mode**: 执行模式，设置为 cluster（集群模式）
- **autorestart**: 自动重启
- **max_memory_restart**: 内存超过 1G 时自动重启
- **error_file**: 错误日志路径
- **out_file**: 输出日志路径
- **log_date_format**: 日志时间格式

可根据实际需求调整配置。

### 多实例部署

如需启动多个实例以提高性能：

```javascript
// 修改 ecosystem.config.js
{
  instances: 4,  // 或者使用 "max" 自动使用所有 CPU 核心
  exec_mode: 'cluster'
}
```

## 日志文件

日志文件存储在 `logs/` 目录下：

- `err.log`: 错误日志
- `out.log`: 标准输出日志
- `combined.log`: 合并日志

## 更新部署

### 快速更新流程

```bash
# 1. 拉取最新代码
git pull

# 2. 编译并重载（零停机）
npm run deploy

# 或使用脚本
.\deploy.ps1 quick    # Windows
./deploy.sh quick     # Linux/Mac
```

### 完整更新流程

```bash
# 1. 拉取最新代码
git pull

# 2. 安装新依赖
npm install

# 3. 编译项目
npm run build

# 4. 重载服务
npm run pm2:reload
```

## 故障排查

### 服务无法启动

```bash
# 查看错误日志
pm2 logs inventory-master-backend --err

# 查看进程详情
pm2 show inventory-master-backend

# 检查环境变量
cat .env  # Linux/Mac
type .env # Windows
```

### 内存或CPU占用过高

```bash
# 查看资源使用
pm2 monit

# 重启服务释放资源
pm2 restart inventory-master-backend
```

### 查看历史日志

日志文件位于 `logs/` 目录，可以直接查看：

```bash
# Linux/Mac
tail -f logs/combined.log

# Windows PowerShell
Get-Content -Path .\logs\combined.log -Tail 50 -Wait
```

## 性能优化建议

1. **调整实例数量**：根据 CPU 核心数调整 instances
2. **监控内存使用**：适当调整 max_memory_restart
3. **日志轮转**：定期清理或归档日志文件
4. **使用集群模式**：利用多核 CPU 提高性能

## 开机自启动

### Linux/Mac

```bash
# 生成启动脚本
pm2 startup

# 保存当前进程列表
pm2 save

# 测试（重启系统后检查）
pm2 list
```

### Windows

使用 PM2 Windows Startup：

```bash
npm install -g pm2-windows-startup
pm2-startup install
pm2 save
```

## 安全建议

1. **保护 .env 文件**：确保 .env 文件权限正确，不要提交到版本控制
2. **定期更新依赖**：运行 `npm audit` 检查安全漏洞
3. **使用防火墙**：限制对数据库和服务端口的访问
4. **HTTPS 配置**：在生产环境使用反向代理（如 Nginx）配置 HTTPS

## 监控和告警

### PM2 Plus（可选）

PM2 Plus 提供高级监控功能：

```bash
# 注册并连接
pm2 plus
```

### 自定义监控

可以集成第三方监控服务，如：
- Prometheus + Grafana
- New Relic
- Datadog

## 备份策略

建议定期备份：
1. 数据库数据
2. 上传的图片文件
3. 环境配置文件 (.env)
4. PM2 进程配置 (ecosystem.config.js)

---

如有问题，请查看日志或联系系统管理员。
