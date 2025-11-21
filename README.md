# 个人物资管理系统

一个功能完善的全栈物资管理 Web 应用，支持**多用户注册登录**和独立的物资管理。每个用户只能管理自己的物资数据，确保数据隔离和安全。

## 项目简介

这是一个前后端分离的物资管理系统，帮助您高效管理个人或工作室的各类物资。系统支持照片上传、分类筛选、数量追踪等功能，提供直观美观的用户界面。

## 核心特性

### 🔐 用户认证
- **用户注册和登录** - JWT Token 鉴权
- **数据隔离** - 每个用户只能管理自己的物资
- **自动认证** - Token 自动携带，失效自动跳转
- **安全加密** - 密码 bcrypt 加密存储

### 🌍 多语言支持
- **双语界面** - 中文/English
- **自动检测** - 根据浏览器语言自动选择
- **实时切换** - 无需刷新即可切换语言
- **易于扩展** - 可轻松添加更多语言

### 📦 物资管理

### 三大物资类型

1. **工作室物料** - 支持"在用数量"和"全新库存数量"双重追踪
2. **衣物管理** - 简化的物资管理，专注于分类和位置
3. **杂物管理** - 通用物资管理，支持数量记录

### 核心功能

- ✅ 物资增删改查
- ✅ 照片上传与管理（腾讯云 COS）
- ✅ 分类筛选和搜索
- ✅ 数量管理（支持单数量/双数量）
- ✅ 统计数据可视化
- ✅ 响应式设计

## 技术栈

### 前端
- Vue 3 + TypeScript
- Pinia（状态管理）
- Vite（构建工具）
- Element Plus（UI 组件库）
- Axios（HTTP 客户端）

### 后端
- Express.js + TypeScript
- MySQL + Sequelize（ORM）
- 腾讯云 COS（文件存储）
- Multer（文件上传）

## 快速开始

### 环境要求

- Node.js >= 16
- MySQL >= 5.7
- 腾讯云 COS 账号（用于图片存储）

### 1. 克隆项目

```bash
git clone <repository-url>
cd 20251120213108
```

### 2. 后端设置

```bash
cd backend

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入数据库和 COS 配置

# 创建数据库
mysql -u root -p
CREATE DATABASE material_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 启动开发服务器
npm run dev
```

后端服务器将在 `http://localhost:3000` 启动。

### 3. 前端设置

```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

前端应用将在 `http://localhost:5173` 启动。

## 环境配置

### 后端环境变量 (.env)

```env
# 服务器配置
PORT=3000

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_NAME=material_management
DB_USER=root
DB_PASSWORD=your_password

# 腾讯云 COS 配置
COS_SECRET_ID=your_secret_id
COS_SECRET_KEY=your_secret_key
COS_BUCKET=your_bucket_name
COS_REGION=ap-guangzhou
```

## API 接口

### 认证接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | `/api/auth/register` | 用户注册 | ❌ |
| POST | `/api/auth/login` | 用户登录 | ❌ |
| GET | `/api/auth/me` | 获取当前用户信息 | ✅ |

### 物资管理接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/api/materials` | 获取物资列表 | ✅ |
| GET | `/api/materials/:id` | 获取物资详情 | ✅ |
| POST | `/api/materials` | 创建物资 | ✅ |
| PUT | `/api/materials/:id` | 更新物资 | ✅ |
| DELETE | `/api/materials/:id` | 删除物资 | ✅ |
| GET | `/api/materials/statistics` | 获取统计数据 | ✅ |

**注意**：标记 ✅ 的接口需要在请求头中携带 Token：
```
Authorization: Bearer <your-token>
```

详细 API 文档请查看 [backend/README.md](./backend/README.md)

## 项目结构

```
.
├── backend/              # 后端项目
│   ├── src/
│   │   ├── config/      # 配置文件
│   │   ├── controllers/ # 控制器
│   │   ├── models/      # 数据模型
│   │   ├── routes/      # 路由
│   │   ├── services/    # 服务层
│   │   └── index.ts     # 入口文件
│   └── package.json
│
├── frontend/            # 前端项目
│   ├── src/
│   │   ├── api/        # API 接口
│   │   ├── components/ # 组件
│   │   ├── stores/     # 状态管理
│   │   ├── types/      # 类型定义
│   │   ├── views/      # 页面
│   │   └── main.ts     # 入口文件
│   └── package.json
│
└── README.md           # 项目说明
```

## 开发指南

### 本地开发

1. 确保 MySQL 服务已启动
2. 确保后端服务已启动（端口 3000）
3. 启动前端开发服务器（端口 5173）
4. 访问 `http://localhost:5173` 开始使用

### 构建生产版本

```bash
# 构建后端
cd backend
npm run build

# 构建前端
cd frontend
npm run build
```

## 部署

### 后端部署

1. 设置生产环境变量
2. 运行 `npm run build` 编译 TypeScript
3. 运行 `npm start` 启动服务
4. 推荐使用 PM2 进行进程管理

### 前端部署

1. 运行 `npm run build` 生成静态文件
2. 将 `dist` 目录部署到 Nginx、Vercel 等静态服务器

## 使用说明

### 首次使用

1. **启动服务**：按照上述步骤启动后端和前端
2. **访问系统**：打开浏览器访问 `http://localhost:5173`
3. **注册账户**：首次使用需要注册新账户
4. **开始使用**：登录后即可开始管理物资

### 多用户场景

- 每个用户独立注册账户
- 用户只能查看和管理自己的物资
- 物资数据完全隔离，互不干扰
- 统计数据也是按用户独立计算

### Token 管理

- Token 默认有效期 7 天
- Token 存储在浏览器 localStorage
- Token 失效后会自动跳转到登录页
- 退出登录会清除本地 Token

## 常见问题

### 1. 数据库连接失败

检查 `.env` 文件中的数据库配置是否正确，确保 MySQL 服务已启动。

### 2. 图片上传失败

确认腾讯云 COS 配置正确，包括 SecretId、SecretKey、Bucket 和 Region。

### 3. 跨域问题

开发环境已配置代理，生产环境请在后端添加 CORS 配置。

### 4. 无法登录

检查数据库连接是否正常，JWT_SECRET 是否配置。

### 5. Token 过期

默认 7 天过期，过期后需重新登录。

## 升级说明

### 多用户认证升级

本项目已升级为多用户版本，详细升级内容请查看 [UPGRADE.md](./UPGRADE.md)。

主要变更：
- ✅ 添加用户注册和登录
- ✅ JWT Token 鉴权
- ✅ 数据按用户隔离
- ✅ 路由守卫保护
- ✅ 用户信息展示

### 多语言国际化

系统现已支持多语言（i18n），详细说明请查看 [I18N.md](./I18N.md)。

主要特性：
- ✅ 中文/English 双语支持
- ✅ 自动语言检测
- ✅ 实时语言切换
- ✅ Element Plus 组件国际化
- ✅ 易于扩展更多语言

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！
