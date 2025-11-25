#!/bin/bash
# 服务器环境检查脚本
# 用于诊断部署问题

echo "🔍 开始检查服务器环境..."
echo "========================================"
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查 Node.js 版本
echo "📦 Node.js 版本检查:"
if command -v node &> /dev/null; then
  NODE_VERSION=$(node --version)
  echo "   当前版本: $NODE_VERSION"
  
  # 提取主版本号
  MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'v' -f2 | cut -d'.' -f1)
  
  if [ "$MAJOR_VERSION" -ge 18 ]; then
    echo -e "   ${GREEN}✅ Node.js 版本符合要求 (>= v18.0.0)${NC}"
  else
    echo -e "   ${RED}❌ Node.js 版本过低！${NC}"
    echo -e "   ${YELLOW}需要: >= v18.0.0${NC}"
    echo -e "   ${YELLOW}推荐: v20.x LTS${NC}"
    echo ""
    echo "   升级方法:"
    echo "   1. 使用 nvm: nvm install 20 && nvm use 20"
    echo "   2. 或访问: https://nodejs.org/"
    echo ""
  fi
else
  echo -e "   ${RED}❌ Node.js 未安装${NC}"
  echo "   安装方法: https://nodejs.org/"
fi

echo ""

# 检查 npm 版本
echo "📦 npm 版本检查:"
if command -v npm &> /dev/null; then
  NPM_VERSION=$(npm --version)
  echo "   当前版本: v$NPM_VERSION"
  echo -e "   ${GREEN}✅ npm 已安装${NC}"
else
  echo -e "   ${RED}❌ npm 未安装${NC}"
fi

echo ""

# 检查 PM2
echo "📦 PM2 检查:"
if command -v pm2 &> /dev/null; then
  PM2_VERSION=$(pm2 --version)
  echo "   当前版本: v$PM2_VERSION"
  echo -e "   ${GREEN}✅ PM2 已安装${NC}"
  
  # 检查 PM2 进程
  echo ""
  echo "   PM2 运行状态:"
  pm2 list
else
  echo -e "   ${RED}❌ PM2 未安装${NC}"
  echo "   安装命令: npm install -g pm2"
fi

echo ""

# 检查 .env 文件
echo "🔐 环境变量检查:"
if [ -f .env ]; then
  echo -e "   ${GREEN}✅ .env 文件存在${NC}"
  
  # 检查关键配置项
  if grep -q "DB_HOST" .env; then
    echo "   ✓ 数据库配置存在"
  else
    echo -e "   ${YELLOW}⚠️  缺少数据库配置${NC}"
  fi
  
  if grep -q "SMTP_HOST" .env; then
    echo "   ✓ 邮件配置存在"
  else
    echo -e "   ${YELLOW}⚠️  缺少邮件配置${NC}"
  fi
  
  if grep -q "JWT_SECRET" .env; then
    echo "   ✓ JWT 配置存在"
  else
    echo -e "   ${YELLOW}⚠️  缺少 JWT 配置${NC}"
  fi
else
  echo -e "   ${RED}❌ .env 文件不存在${NC}"
  echo "   请复制 .env.example 并配置环境变量"
fi

echo ""

# 检查编译产物
echo "🔨 编译产物检查:"
if [ -d "dist" ]; then
  echo -e "   ${GREEN}✅ dist 目录存在${NC}"
  if [ -f "dist/index.js" ]; then
    echo "   ✓ dist/index.js 存在"
  else
    echo -e "   ${RED}❌ dist/index.js 不存在${NC}"
    echo "   请运行: npm run build"
  fi
else
  echo -e "   ${RED}❌ dist 目录不存在${NC}"
  echo "   请运行: npm run build"
fi

echo ""

# 检查 node_modules
echo "📚 依赖检查:"
if [ -d "node_modules" ]; then
  echo -e "   ${GREEN}✅ node_modules 存在${NC}"
else
  echo -e "   ${RED}❌ node_modules 不存在${NC}"
  echo "   请运行: npm install"
fi

echo ""

# 检查 MySQL 客户端
echo "🗄️  MySQL 客户端检查:"
if command -v mysql &> /dev/null; then
  MYSQL_VERSION=$(mysql --version)
  echo "   $MYSQL_VERSION"
  echo -e "   ${GREEN}✅ MySQL 客户端已安装${NC}"
else
  echo -e "   ${YELLOW}⚠️  MySQL 客户端未安装（可选）${NC}"
fi

echo ""

# 检查 Redis 客户端
echo "🔴 Redis 客户端检查:"
if command -v redis-cli &> /dev/null; then
  REDIS_VERSION=$(redis-cli --version)
  echo "   $REDIS_VERSION"
  echo -e "   ${GREEN}✅ Redis 客户端已安装${NC}"
else
  echo -e "   ${YELLOW}⚠️  Redis 客户端未安装（可选）${NC}"
fi

echo ""

# 检查端口占用
echo "🔌 端口占用检查:"
if command -v lsof &> /dev/null; then
  if lsof -i :9702 &> /dev/null; then
    echo -e "   ${YELLOW}⚠️  端口 9702 已被占用${NC}"
    lsof -i :9702
  else
    echo -e "   ${GREEN}✅ 端口 9702 可用${NC}"
  fi
elif command -v netstat &> /dev/null; then
  if netstat -tuln | grep :9702 &> /dev/null; then
    echo -e "   ${YELLOW}⚠️  端口 9702 已被占用${NC}"
    netstat -tuln | grep :9702
  else
    echo -e "   ${GREEN}✅ 端口 9702 可用${NC}"
  fi
else
  echo "   无法检查端口状态（lsof/netstat 未安装）"
fi

echo ""

# 系统资源检查
echo "💻 系统资源检查:"
echo "   内存使用:"
free -h 2>/dev/null || echo "   (free 命令不可用)"
echo ""
echo "   磁盘使用:"
df -h . 2>/dev/null || echo "   (df 命令不可用)"

echo ""
echo "========================================"
echo "🎉 环境检查完成！"
echo ""

# 总结建议
if [ "$MAJOR_VERSION" -lt 18 ]; then
  echo -e "${YELLOW}⚠️  关键问题:${NC}"
  echo "   1. Node.js 版本过低，请升级到 v20.x LTS"
  echo ""
fi

if [ ! -f .env ]; then
  echo -e "${YELLOW}⚠️  重要提示:${NC}"
  echo "   1. 需要创建 .env 文件并配置环境变量"
  echo ""
fi

if [ ! -d "dist" ]; then
  echo -e "${YELLOW}⚠️  部署步骤:${NC}"
  echo "   1. 运行 npm install 安装依赖"
  echo "   2. 运行 npm run build 编译代码"
  echo "   3. 运行 npm run pm2:start 启动服务"
  echo ""
fi

echo "详细故障排查指南: 查看 DEPLOYMENT_TROUBLESHOOTING.md"
