#!/bin/bash

# 部署脚本 - Inventory Master Backend
# 使用方法: ./deploy.sh [start|stop|restart|reload|status|logs]

set -e

APP_NAME="inventory-master-backend"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "========================================"
echo "  Inventory Master Backend 部署脚本"
echo "========================================"
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查 PM2 是否安装
check_pm2() {
    if ! command -v pm2 &> /dev/null; then
        echo -e "${RED}错误: PM2 未安装${NC}"
        echo "请运行: npm install -g pm2"
        exit 1
    fi
    echo -e "${GREEN}✓ PM2 已安装${NC}"
}

# 检查环境配置
check_env() {
    if [ ! -f "$SCRIPT_DIR/.env" ]; then
        echo -e "${YELLOW}警告: .env 文件不存在${NC}"
        echo "请复制 .env.example 并配置："
        echo "cp .env.example .env"
        exit 1
    fi
    echo -e "${GREEN}✓ 环境配置文件存在${NC}"
}

# 安装依赖
install_deps() {
    echo -e "${YELLOW}正在安装依赖...${NC}"
    cd "$SCRIPT_DIR"
    npm install --production
    echo -e "${GREEN}✓ 依赖安装完成${NC}"
}

# 编译 TypeScript
build() {
    echo -e "${YELLOW}正在编译 TypeScript...${NC}"
    cd "$SCRIPT_DIR"
    npm run build
    echo -e "${GREEN}✓ 编译完成${NC}"
}

# 创建日志目录
create_log_dir() {
    if [ ! -d "$SCRIPT_DIR/logs" ]; then
        mkdir -p "$SCRIPT_DIR/logs"
        echo -e "${GREEN}✓ 日志目录已创建${NC}"
    fi
}

# 启动服务
start() {
    echo -e "${YELLOW}正在启动服务...${NC}"
    cd "$SCRIPT_DIR"
    pm2 start ecosystem.config.js --env production
    pm2 save
    echo -e "${GREEN}✓ 服务已启动${NC}"
}

# 停止服务
stop() {
    echo -e "${YELLOW}正在停止服务...${NC}"
    pm2 stop $APP_NAME
    echo -e "${GREEN}✓ 服务已停止${NC}"
}

# 重启服务
restart() {
    echo -e "${YELLOW}正在重启服务...${NC}"
    pm2 restart $APP_NAME
    echo -e "${GREEN}✓ 服务已重启${NC}"
}

# 重载服务（零停机时间）
reload() {
    echo -e "${YELLOW}正在重载服务...${NC}"
    pm2 reload $APP_NAME
    echo -e "${GREEN}✓ 服务已重载${NC}"
}

# 查看状态
status() {
    pm2 status $APP_NAME
}

# 查看日志
logs() {
    pm2 logs $APP_NAME --lines 100
}

# 完整部署流程
full_deploy() {
    echo "开始完整部署流程..."
    echo ""
    
    check_pm2
    check_env
    install_deps
    build
    create_log_dir
    
    # 检查是否已经运行
    if pm2 list | grep -q $APP_NAME; then
        echo -e "${YELLOW}检测到服务已运行，执行重载...${NC}"
        reload
    else
        echo -e "${YELLOW}首次部署，启动服务...${NC}"
        start
    fi
    
    echo ""
    echo -e "${GREEN}========================================"
    echo "  部署完成！"
    echo "========================================${NC}"
    echo ""
    status
    echo ""
    echo "常用命令："
    echo "  查看日志: pm2 logs $APP_NAME"
    echo "  查看状态: pm2 status"
    echo "  重启服务: pm2 restart $APP_NAME"
    echo "  停止服务: pm2 stop $APP_NAME"
}

# 快速更新（不重新安装依赖）
quick_update() {
    echo "开始快速更新..."
    echo ""
    
    build
    reload
    
    echo ""
    echo -e "${GREEN}快速更新完成！${NC}"
    status
}

# 主函数
main() {
    case "${1:-}" in
        start)
            check_pm2
            check_env
            create_log_dir
            start
            ;;
        stop)
            stop
            ;;
        restart)
            restart
            ;;
        reload)
            reload
            ;;
        status)
            status
            ;;
        logs)
            logs
            ;;
        build)
            build
            ;;
        quick)
            quick_update
            ;;
        *)
            full_deploy
            ;;
    esac
}

main "$@"
