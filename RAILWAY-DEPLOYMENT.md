# Railway Deployment Guide

Panduan lengkap untuk deploy paletteStream API ke Railway dengan PM2.

## 🚂 Railway Setup

### 1. Pre-deployment Checklist

✅ PM2 sudah ditambahkan ke dependencies  
✅ Script `start` menggunakan `pm2-runtime`  
✅ Environment variables sudah dikonfigurasi  
✅ Database connection sudah setup dan tested

### 2. Railway Environment Variables

Set environment variables berikut di Railway dashboard:

```bash
NODE_ENV=production
DATABASE_URL=your_mysql_connection_string
JWT_ACCESS_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
# ... environment variables lainnya
```

### 3. Deployment Commands

Railway akan otomatis menjalankan:

```bash
npm install        # Install dependencies
npm run start      # Start production dengan PM2
```

## 📦 Package.json Scripts for Railway

```json
{
  "scripts": {
    "start": "NODE_ENV=production pm2-runtime start ecosystem.config.js --env production",
    "dev": "nodemon server.js",
    "start:local": "NODE_ENV=production pm2 start ecosystem.config.js --env production"
  }
}
```

**Key Points:**

- `start`: Railway akan menggunakan ini secara otomatis
- `pm2-runtime`: Khusus untuk containerized/hosted environments
- `dev`: Untuk development lokal
- `start:local`: Untuk testing PM2 di local dengan daemon

## ⚙️ Ecosystem Configuration for Railway

File `ecosystem.config.js` sudah dioptimasi untuk Railway:

```javascript
{
  instances: 1,           // Single instance untuk Railway
  exec_mode: "fork",      // Fork mode lebih stabil
  max_memory_restart: "450M", // Sesuai Railway limits
  PORT: process.env.PORT, // Dynamic port dari Railway
  autorestart: true,      // Auto restart on crash
  max_restarts: 15,       // Lebih toleran untuk Railway
}
```

## 🔄 Auto-Restart Features

PM2 akan otomatis restart aplikasi jika:

1. **Application Crash**: Uncaught exceptions, unhandled rejections
2. **Memory Limit**: Jika memory usage > 450MB
3. **Process Exit**: Jika process exit dengan error code
4. **File Upload Errors**: Seperti yang kita fix sebelumnya

### Restart Strategy:

- **Immediate**: Restart langsung setelah crash
- **Exponential Backoff**: Delay restart bertambah jika terus crash
- **Max Attempts**: Maksimal 15 restart attempts
- **Min Uptime**: Minimal 10 detik sebelum dianggap stable

## 📊 Monitoring di Railway

### Railway Dashboard

Railway menyediakan built-in monitoring:

- **Logs**: Real-time application logs
- **Metrics**: CPU, Memory, Network usage
- **Deployments**: History dan status deployment

### PM2 Logs

PM2 logs masih tersedia melalui:

```bash
# Via Railway CLI (jika ada akses)
pm2 logs palettestream-api

# Atau check file logs
cat logs/error.log
cat logs/out.log
```

## 🚨 Error Handling Improvements

Dengan fixes yang sudah kita terapkan:

### 1. Multer Error Handling

```javascript
// Sebelum: Server crash dengan error "File too large"
// Setelah: Proper error response dengan specific messages
if (err.code === "LIMIT_FILE_SIZE") {
  return res.status(400).json({
    success: false,
    message: "File size too large. Maximum size is 10MB",
  });
}
```

### 2. Graceful Error Recovery

- Errors tidak lagi menyebabkan server crash
- PM2 tetap akan restart jika ada unhandled errors
- Better error logging untuk debugging

## 🔧 Local Development vs Railway

### Local Development

```bash
# Menggunakan nodemon untuk hot reload
npm run dev

# Atau test PM2 locally
npm run start:local
```

### Railway Production

```bash
# Railway otomatis menjalankan
npm run start
```

## 📝 Deployment Steps

### 1. Connect Repository

- Connect GitHub repo ke Railway
- Set branch ke `main` atau `master`

### 2. Configure Environment

- Add semua environment variables
- Verify database connection string

### 3. Deploy

- Railway akan otomatis build dan deploy
- Monitor logs untuk memastikan PM2 starts correctly

### 4. Verify Deployment

```bash
# Check if service is running
curl https://your-railway-app.railway.app/api/health

# Check specific endpoints
curl https://your-railway-app.railway.app/api/users
```

## 🛠️ Troubleshooting

### Common Railway + PM2 Issues:

1. **Port Binding Error**

   - Pastikan menggunakan `process.env.PORT`
   - Railway assigns dynamic port

2. **Memory Limit Exceeded**

   - Railway free tier: ~512MB limit
   - PM2 restart at 450MB untuk safety margin

3. **Environment Variables**

   - Double-check semua env vars di Railway dashboard
   - Restart deployment setelah changes

4. **Database Connection**
   - Verify DATABASE_URL format
   - Check database server accessibility

### Debug Commands:

```bash
# Railway logs
railway logs

# PM2 status (if accessible)
pm2 status

# Check specific error logs
cat logs/error.log | tail -50
```

## 🚀 Performance Optimization

### Railway Specific:

- Single instance (fork mode)
- Memory limit set to 450MB
- Optimized restart strategies
- Disabled unnecessary features (cron, monitoring)

### General PM2:

- Auto-restart on crash
- Exponential backoff for failed restarts
- Process monitoring and health checks
- Structured logging

## 📞 Support

### Railway Issues:

- Check Railway dashboard logs
- Verify environment variables
- Monitor resource usage

### PM2 Issues:

- Check `logs/error.log`
- Verify ecosystem.config.js
- Test locally with `npm run start:local`

### Application Issues:

- Monitor API endpoints
- Check database connectivity
- Verify file upload functionality

---

**Note**: Railway akan otomatis menggunakan `npm run start` command, jadi pastikan script tersebut sudah benar dikonfigurasi dengan PM2.
