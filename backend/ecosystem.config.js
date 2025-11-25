module.exports = {
  apps: [
    {
      name: 'inventory-master-backend',
      script: './dist/index.js',
      instances: 1,
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 9702
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 9702
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 9702
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      // 自动重启配置
      min_uptime: '10s',
      max_restarts: 10,
      // 进程崩溃后等待重启的时间
      restart_delay: 4000,
      // 优雅关闭超时时间
      kill_timeout: 5000,
      // 等待应用就绪的时间
      listen_timeout: 3000
    }
  ]
}
