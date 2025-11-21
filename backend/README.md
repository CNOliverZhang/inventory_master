# 物资管理系统 - 后端

基于 Express + TypeScript + MySQL + Sequelize 构建的物资管理系统后端 API。

## 功能特性

- ✅ RESTful API 设计
- ✅ TypeScript 类型安全
- ✅ MySQL 数据库
- ✅ Sequelize ORM
- ✅ 腾讯云 COS 文件存储
- ✅ 图片上传功能
- ✅ 分类筛选和搜索
- ✅ 统计数据接口

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并填写配置：

```bash
cp .env.example .env
```

配置说明：
- `PORT`: 服务器端口
- `DB_*`: MySQL 数据库连接信息
- `COS_*`: 腾讯云 COS 配置（用于图片存储）

### 3. 创建数据库

在 MySQL 中创建数据库：

```sql
CREATE DATABASE inventory_master CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. 启动开发服务器

```bash
npm run dev
```

服务器将在 `http://localhost:3000` 启动。

## API 文档

### 物资管理

#### 获取物资列表
```
GET /api/materials
Query: ?type=studio&search=关键词
```

#### 获取物资详情
```
GET /api/materials/:id
```

#### 创建物资
```
POST /api/materials
Content-Type: multipart/form-data

Fields:
- name: 物资名称
- type: 物资类型 (studio/clothing/misc)
- location: 存放位置
- photo: 照片文件（可选）
- quantity: 数量（杂物）
- inUseQuantity: 在用数量（工作室物料）
- stockQuantity: 库存数量（工作室物料）
```

#### 更新物资
```
PUT /api/materials/:id
Content-Type: multipart/form-data
```

#### 删除物资
```
DELETE /api/materials/:id
```

#### 获取统计数据
```
GET /api/materials/statistics
```

## 数据模型

### Material（物资）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键 |
| name | STRING | 物资名称 |
| type | ENUM | 类型（studio/clothing/misc） |
| location | STRING | 存放位置 |
| photoUrl | STRING | 照片URL |
| quantity | INTEGER | 数量（杂物、工作室物料） |
| inUseQuantity | INTEGER | 在用数量（工作室物料） |
| stockQuantity | INTEGER | 库存数量（工作室物料） |
| createdAt | DATE | 创建时间 |
| updatedAt | DATE | 更新时间 |

## 项目结构

```
backend/
├── src/
│   ├── config/          # 配置文件
│   │   └── database.ts  # 数据库配置
│   ├── controllers/     # 控制器
│   │   └── materialController.ts
│   ├── models/          # 数据模型
│   │   └── Material.ts
│   ├── routes/          # 路由
│   │   └── materialRoutes.ts
│   ├── services/        # 服务层
│   │   └── cosService.ts
│   └── index.ts         # 入口文件
├── package.json
├── tsconfig.json
└── .env.example
```

## 开发说明

- 使用 TypeScript 进行开发，享受类型安全
- Sequelize 会自动同步数据库模型（开发环境）
- 图片上传自动处理并存储到腾讯云 COS
- 所有 API 返回统一的 JSON 格式

## 生产部署

1. 编译 TypeScript：
```bash
npm run build
```

2. 启动生产服务器：
```bash
npm start
```
