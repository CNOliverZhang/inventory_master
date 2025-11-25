# PowerShell 部署脚本 - Inventory Master Backend
# 使用方法: .\deploy.ps1 [start|stop|restart|reload|status|logs]

param(
    [string]$Action = "deploy"
)

$APP_NAME = "inventory-master-backend"
$SCRIPT_DIR = $PSScriptRoot

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Inventory Master Backend 部署脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查 PM2 是否安装
function Check-PM2 {
    try {
        $null = Get-Command pm2 -ErrorAction Stop
        Write-Host "✓ PM2 已安装" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "错误: PM2 未安装" -ForegroundColor Red
        Write-Host "请运行: npm install -g pm2" -ForegroundColor Yellow
        return $false
    }
}

# 检查环境配置
function Check-Env {
    if (-not (Test-Path "$SCRIPT_DIR\.env")) {
        Write-Host "警告: .env 文件不存在" -ForegroundColor Yellow
        Write-Host "请复制 .env.example 并配置：" -ForegroundColor Yellow
        Write-Host "Copy-Item .env.example .env" -ForegroundColor Yellow
        return $false
    }
    Write-Host "✓ 环境配置文件存在" -ForegroundColor Green
    return $true
}

# 安装依赖
function Install-Dependencies {
    Write-Host "正在安装依赖..." -ForegroundColor Yellow
    Set-Location $SCRIPT_DIR
    npm install --production
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ 依赖安装完成" -ForegroundColor Green
        return $true
    }
    return $false
}

# 编译 TypeScript
function Build-Project {
    Write-Host "正在编译 TypeScript..." -ForegroundColor Yellow
    Set-Location $SCRIPT_DIR
    npm run build
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ 编译完成" -ForegroundColor Green
        return $true
    }
    else {
        Write-Host "编译失败" -ForegroundColor Red
        return $false
    }
}

# 创建日志目录
function Create-LogDir {
    $logDir = "$SCRIPT_DIR\logs"
    if (-not (Test-Path $logDir)) {
        New-Item -ItemType Directory -Path $logDir -Force | Out-Null
        Write-Host "✓ 日志目录已创建" -ForegroundColor Green
    }
}

# 启动服务
function Start-Service {
    Write-Host "正在启动服务..." -ForegroundColor Yellow
    Set-Location $SCRIPT_DIR
    pm2 start ecosystem.config.js --env production
    pm2 save
    Write-Host "✓ 服务已启动" -ForegroundColor Green
}

# 停止服务
function Stop-Service {
    Write-Host "正在停止服务..." -ForegroundColor Yellow
    pm2 stop $APP_NAME
    Write-Host "✓ 服务已停止" -ForegroundColor Green
}

# 重启服务
function Restart-Service {
    Write-Host "正在重启服务..." -ForegroundColor Yellow
    pm2 restart $APP_NAME
    Write-Host "✓ 服务已重启" -ForegroundColor Green
}

# 重载服务
function Reload-Service {
    Write-Host "正在重载服务..." -ForegroundColor Yellow
    pm2 reload $APP_NAME
    Write-Host "✓ 服务已重载" -ForegroundColor Green
}

# 查看状态
function Show-Status {
    pm2 status $APP_NAME
}

# 查看日志
function Show-Logs {
    pm2 logs $APP_NAME --lines 100
}

# 完整部署流程
function Full-Deploy {
    Write-Host "开始完整部署流程..." -ForegroundColor Cyan
    Write-Host ""
    
    if (-not (Check-PM2)) { exit 1 }
    if (-not (Check-Env)) { exit 1 }
    
    if (-not (Install-Dependencies)) { exit 1 }
    if (-not (Build-Project)) { exit 1 }
    
    Create-LogDir
    
    # 检查是否已经运行
    $running = pm2 list | Select-String $APP_NAME
    if ($running) {
        Write-Host "检测到服务已运行，执行重载..." -ForegroundColor Yellow
        Reload-Service
    }
    else {
        Write-Host "首次部署，启动服务..." -ForegroundColor Yellow
        Start-Service
    }
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  部署完成！" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Show-Status
    Write-Host ""
    Write-Host "常用命令：" -ForegroundColor Cyan
    Write-Host "  查看日志: pm2 logs $APP_NAME"
    Write-Host "  查看状态: pm2 status"
    Write-Host "  重启服务: pm2 restart $APP_NAME"
    Write-Host "  停止服务: pm2 stop $APP_NAME"
}

# 快速更新
function Quick-Update {
    Write-Host "开始快速更新..." -ForegroundColor Cyan
    Write-Host ""
    
    if (-not (Build-Project)) { exit 1 }
    Reload-Service
    
    Write-Host ""
    Write-Host "快速更新完成！" -ForegroundColor Green
    Show-Status
}

# 主函数
switch ($Action.ToLower()) {
    "start" {
        if (-not (Check-PM2)) { exit 1 }
        if (-not (Check-Env)) { exit 1 }
        Create-LogDir
        Start-Service
    }
    "stop" {
        Stop-Service
    }
    "restart" {
        Restart-Service
    }
    "reload" {
        Reload-Service
    }
    "status" {
        Show-Status
    }
    "logs" {
        Show-Logs
    }
    "build" {
        Build-Project
    }
    "quick" {
        Quick-Update
    }
    default {
        Full-Deploy
    }
}
