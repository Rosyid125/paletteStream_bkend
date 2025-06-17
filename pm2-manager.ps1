# paletteStream PM2 Management Script for Windows
# Usage: .\pm2-manager.ps1 [start|stop|restart|status|logs|monitor]

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("start", "start-dev", "stop", "restart", "reload", "delete", "status", "logs", "monitor", "info", "save", "startup")]
    [string]$Action
)

$AppName = "palettestream-api"
$NodeEnv = "production"

Write-Host "🔧 paletteStream PM2 Manager" -ForegroundColor Cyan
Write-Host "Action: $Action" -ForegroundColor Yellow

switch ($Action) {
    "start" {
        Write-Host "🚀 Starting $AppName in production mode..." -ForegroundColor Green
        $env:NODE_ENV = "production"
        pm2 start ecosystem.config.js --env production
        Write-Host "✅ $AppName started successfully!" -ForegroundColor Green
        pm2 save
    }
    
    "start-dev" {
        Write-Host "🚀 Starting $AppName in development mode..." -ForegroundColor Green
        $env:NODE_ENV = "development"
        pm2 start ecosystem.config.js
        Write-Host "✅ $AppName started in development mode!" -ForegroundColor Green
        pm2 save
    }
    
    "stop" {
        Write-Host "🛑 Stopping $AppName..." -ForegroundColor Red
        pm2 stop $AppName
        Write-Host "✅ $AppName stopped!" -ForegroundColor Green
    }
    
    "restart" {
        Write-Host "🔄 Restarting $AppName..." -ForegroundColor Yellow
        pm2 restart $AppName
        Write-Host "✅ $AppName restarted!" -ForegroundColor Green
    }
    
    "reload" {
        Write-Host "🔄 Reloading $AppName (zero downtime)..." -ForegroundColor Yellow
        pm2 reload $AppName
        Write-Host "✅ $AppName reloaded!" -ForegroundColor Green
    }
    
    "delete" {
        Write-Host "🗑️ Deleting $AppName..." -ForegroundColor Red
        pm2 delete $AppName
        Write-Host "✅ $AppName deleted!" -ForegroundColor Green
    }
    
    "status" {
        Write-Host "📊 $AppName Status:" -ForegroundColor Blue
        pm2 status $AppName
    }
    
    "logs" {
        Write-Host "📋 Showing logs for $AppName:" -ForegroundColor Blue
        pm2 logs $AppName
    }
    
    "monitor" {
        Write-Host "📈 Opening PM2 Monitor..." -ForegroundColor Blue
        pm2 monit
    }
    
    "info" {
        Write-Host "ℹ️ $AppName Information:" -ForegroundColor Blue
        pm2 info $AppName
    }
    
    "save" {
        Write-Host "💾 Saving PM2 process list..." -ForegroundColor Blue
        pm2 save
        Write-Host "✅ Process list saved!" -ForegroundColor Green
    }
    
    "startup" {
        Write-Host "🔧 Setting up PM2 startup script..." -ForegroundColor Blue
        pm2 startup
        Write-Host "✅ Follow the instructions above to enable auto-start on boot!" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Available commands:" -ForegroundColor Cyan
Write-Host "  start     - Start the app in production mode" -ForegroundColor White
Write-Host "  start-dev - Start the app in development mode" -ForegroundColor White
Write-Host "  stop      - Stop the app" -ForegroundColor White
Write-Host "  restart   - Restart the app" -ForegroundColor White
Write-Host "  reload    - Reload the app (zero downtime)" -ForegroundColor White
Write-Host "  delete    - Delete the app from PM2" -ForegroundColor White
Write-Host "  status    - Show app status" -ForegroundColor White
Write-Host "  logs      - Show app logs" -ForegroundColor White
Write-Host "  monitor   - Open PM2 monitor" -ForegroundColor White
Write-Host "  info      - Show detailed app information" -ForegroundColor White
Write-Host "  save      - Save current PM2 process list" -ForegroundColor White
Write-Host "  startup   - Setup PM2 to start on boot" -ForegroundColor White
