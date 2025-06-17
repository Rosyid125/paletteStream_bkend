# PM2 Setup Guide

Panduan lengkap untuk menjalankan paletteStream API menggunakan PM2.

> **🚂 Railway Deployment**: Untuk deployment ke Railway, lihat [RAILWAY-DEPLOYMENT.md](./RAILWAY-DEPLOYMENT.md)

## 📦 Instalasi PM2

```bash
# PM2 sudah termasuk dalam dependencies
npm install

# Atau install PM2 secara global (opsional untuk local development)
npm install -g pm2
```

## 🚀 Environment Setup

### Railway Production (Otomatis)

Railway akan otomatis menjalankan:

```bash
npm run start  # Menggunakan pm2-runtime untuk production
```

### Local Development & Testing

```bash
npm run dev           # Development dengan nodemon
npm run start:local   # Test PM2 di local dengan daemon
```

## 📋 Available Scripts

| Script        | Command               | Description                          |
| ------------- | --------------------- | ------------------------------------ |
| `start`       | `npm run start`       | **Railway Production** - PM2 runtime |
| `dev`         | `npm run dev`         | Local development dengan nodemon     |
| `start:local` | `npm run start:local` | Test PM2 di local                    |
| `start:dev`   | `npm run start:dev`   | PM2 development mode                 |
| `stop`        | `npm run stop`        | Stop the application                 |
| `restart`     | `npm run restart`     | Restart the application              |
| `reload`      | `npm run reload`      | Zero-downtime reload                 |
| `status`      | `npm run status`      | Show application status              |
| `logs`        | `npm run logs`        | Show application logs                |
| `monitor`     | `npm run monitor`     | Open PM2 monitor                     |

## 🛠️ Manual PM2 Commands

```bash
# Start dengan konfigurasi ecosystem
pm2 start ecosystem.config.js --env production

# Stop aplikasi
pm2 stop palettestream-api

# Restart aplikasi
pm2 restart palettestream-api

# Zero-downtime reload
pm2 reload palettestream-api

# Hapus aplikasi dari PM2
pm2 delete palettestream-api

# Lihat status semua aplikasi
pm2 list

# Lihat logs real-time
pm2 logs palettestream-api

# Monitor aplikasi
pm2 monit

# Informasi detail aplikasi
pm2 info palettestream-api
```

## 🔧 Management Scripts

### Linux/MacOS

```bash
# Berikan permission execute
chmod +x pm2-manager.sh

# Gunakan script
./pm2-manager.sh start       # Start production
./pm2-manager.sh start-dev   # Start development
./pm2-manager.sh status      # Check status
./pm2-manager.sh logs        # View logs
```

### Windows PowerShell

```powershell
# Set execution policy (sekali saja)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Gunakan script
.\pm2-manager.ps1 start      # Start production
.\pm2-manager.ps1 start-dev  # Start development
.\pm2-manager.ps1 status     # Check status
.\pm2-manager.ps1 logs       # View logs
```

## ⚙️ Konfigurasi Ecosystem

File `ecosystem.config.js` mengatur:

- **Auto Restart**: Aplikasi otomatis restart jika crash
- **Memory Limit**: Restart jika memory usage > 500MB
- **Max Restarts**: Maximum 10 restart attempts
- **Restart Delay**: Delay 4 detik sebelum restart
- **Cron Restart**: Auto restart setiap hari jam 02:00
- **Cluster Mode**: Menggunakan semua CPU cores untuk performance
- **Logging**: Semua logs tersimpan di folder `logs/`

### Key Features:

```javascript
{
  autorestart: true,                    // Auto restart on crash
  max_memory_restart: "500M",           // Memory limit
  max_restarts: 10,                     // Max restart attempts
  restart_delay: 4000,                  // 4 second delay
  cron_restart: "0 2 * * *",           // Daily restart at 2 AM
  instances: 1,                         // Number of instances
  exec_mode: "cluster"                  // Cluster mode
}
```

## 📊 Monitoring & Logs

### Real-time Monitoring

```bash
pm2 monit
```

### View Logs

```bash
# Semua logs
pm2 logs

# Logs aplikasi spesifik
pm2 logs palettestream-api

# Follow logs (tail -f)
pm2 logs palettestream-api --lines 50
```

### Log Files Location

- **Combined**: `./logs/combined.log`
- **Output**: `./logs/out.log`
- **Error**: `./logs/error.log`

## 🔄 Auto-Start on Boot

### Setup PM2 Startup

```bash
# Generate startup script
pm2 startup

# Save current process list
pm2 save
```

### Windows Service (PM2-Windows-Service)

```bash
# Install PM2 Windows Service
npm install -g pm2-windows-service

# Setup service
pm2-service-install
```

## 🚨 Error Handling & Recovery

PM2 secara otomatis menangani:

1. **Application Crashes**: Auto restart dengan exponential backoff
2. **Memory Leaks**: Restart jika memory usage berlebihan
3. **Unhandled Exceptions**: Capture dan restart aplikasi
4. **Process Monitoring**: Health check dan monitoring

### Restart Strategies:

- **Immediate Restart**: Jika aplikasi crash
- **Memory Restart**: Jika memory usage > 500MB
- **Scheduled Restart**: Setiap hari jam 2 pagi
- **Manual Restart**: Melalui PM2 commands

## 🔍 Troubleshooting

### Common Issues:

1. **Port Already in Use**

   ```bash
   pm2 stop all
   pm2 start ecosystem.config.js --env production
   ```

2. **Memory Issues**

   ```bash
   pm2 restart palettestream-api
   ```

3. **Application Not Starting**

   ```bash
   pm2 logs palettestream-api
   pm2 info palettestream-api
   ```

4. **Reset PM2**
   ```bash
   pm2 kill
   pm2 start ecosystem.config.js --env production
   ```

## 📈 Performance Tips

1. **Use Cluster Mode**: Untuk multi-core utilization
2. **Set Memory Limits**: Prevent memory leaks
3. **Enable Monitoring**: Track performance metrics
4. **Regular Restarts**: Scheduled daily restarts
5. **Log Rotation**: Prevent log files from growing too large

## 🛡️ Security Considerations

- Jalankan dengan non-root user di production
- Set proper file permissions
- Use environment variables untuk sensitive data
- Enable HTTPS di reverse proxy (nginx/apache)
- Regular security updates

## 📞 Support

Jika ada masalah dengan PM2 setup:

1. Check logs: `pm2 logs palettestream-api`
2. Check status: `pm2 status`
3. Check process info: `pm2 info palettestream-api`
4. Restart aplikasi: `pm2 restart palettestream-api`
