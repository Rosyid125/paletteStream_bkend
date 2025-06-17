module.exports = {
  apps: [
    {
      name: "palettestream-api",
      script: "server.js",
      instances: 1, // Railway biasanya single instance untuk free tier
      exec_mode: "fork", // Fork mode lebih stabil untuk Railway
      watch: false, // Disable watch di production
      max_memory_restart: "450M", // Railway free tier limit ~512MB
      env: {
        NODE_ENV: "development",
        PORT: process.env.PORT || 3000, // Railway menggunakan dynamic PORT
      },
      env_production: {
        NODE_ENV: "production",
        PORT: process.env.PORT || 3000, // Railway menggunakan dynamic PORT
      },
      // Error handling & restart configuration
      min_uptime: "10s", // Minimum uptime sebelum dianggap stable
      max_restarts: 15, // Increase untuk Railway stability
      restart_delay: 4000, // Delay sebelum restart (4 detik)

      // Logging configuration - Railway handles logs
      log_file: "./logs/combined.log",
      out_file: "./logs/out.log",
      error_file: "./logs/error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",

      // Advanced restart strategies
      exponential_backoff_restart_delay: 100,

      // Monitoring
      monitoring: false, // Disable untuk Railway

      // Auto restart pada crash
      autorestart: true,

      // Remove cron restart untuk Railway (tidak diperlukan)
      // cron_restart: "0 2 * * *",

      // Environment variables khusus
      merge_logs: true,

      // Kill timeout - lebih cepat untuk Railway
      kill_timeout: 3000,

      // Listen timeout
      listen_timeout: 8000,

      // Health check (optional)
      health_check_grace_period: 3000,

      // Railway specific optimizations
      ignore_watch: ["node_modules", "logs", "*.log"],
      source_map_support: false,
    },
  ],

  // Deploy configuration (optional)
  deploy: {
    production: {
      user: "deploy",
      host: ["your-server-ip"],
      ref: "origin/main",
      repo: "your-git-repo",
      path: "/var/www/palettestream",
      "post-deploy": "npm install && pm2 reload ecosystem.config.js --env production",
      "pre-setup": "apt update && apt install git -y",
    },
  },
};
