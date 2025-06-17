#!/bin/bash

# paletteStream PM2 Management Script
# Usage: ./pm2-manager.sh [start|stop|restart|status|logs|monitor]

APP_NAME="palettestream-api"
NODE_ENV="production"

case "$1" in
  start)
    echo "🚀 Starting $APP_NAME in production mode..."
    NODE_ENV=production pm2 start ecosystem.config.js --env production
    echo "✅ $APP_NAME started successfully!"
    pm2 save
    ;;
  
  start-dev)
    echo "🚀 Starting $APP_NAME in development mode..."
    NODE_ENV=development pm2 start ecosystem.config.js
    echo "✅ $APP_NAME started in development mode!"
    pm2 save
    ;;
  
  stop)
    echo "🛑 Stopping $APP_NAME..."
    pm2 stop $APP_NAME
    echo "✅ $APP_NAME stopped!"
    ;;
  
  restart)
    echo "🔄 Restarting $APP_NAME..."
    pm2 restart $APP_NAME
    echo "✅ $APP_NAME restarted!"
    ;;
  
  reload)
    echo "🔄 Reloading $APP_NAME (zero downtime)..."
    pm2 reload $APP_NAME
    echo "✅ $APP_NAME reloaded!"
    ;;
  
  delete)
    echo "🗑️  Deleting $APP_NAME..."
    pm2 delete $APP_NAME
    echo "✅ $APP_NAME deleted!"
    ;;
  
  status)
    echo "📊 $APP_NAME Status:"
    pm2 status $APP_NAME
    ;;
  
  logs)
    echo "📋 Showing logs for $APP_NAME:"
    pm2 logs $APP_NAME
    ;;
  
  monitor)
    echo "📈 Opening PM2 Monitor..."
    pm2 monit
    ;;
  
  info)
    echo "ℹ️  $APP_NAME Information:"
    pm2 info $APP_NAME
    ;;
  
  save)
    echo "💾 Saving PM2 process list..."
    pm2 save
    echo "✅ Process list saved!"
    ;;
  
  startup)
    echo "🔧 Setting up PM2 startup script..."
    pm2 startup
    echo "✅ Run the command above to enable auto-start on boot!"
    ;;
  
  *)
    echo "🔧 paletteStream PM2 Manager"
    echo "Usage: $0 {start|start-dev|stop|restart|reload|delete|status|logs|monitor|info|save|startup}"
    echo ""
    echo "Commands:"
    echo "  start     - Start the app in production mode"
    echo "  start-dev - Start the app in development mode"
    echo "  stop      - Stop the app"
    echo "  restart   - Restart the app"
    echo "  reload    - Reload the app (zero downtime)"
    echo "  delete    - Delete the app from PM2"
    echo "  status    - Show app status"
    echo "  logs      - Show app logs"
    echo "  monitor   - Open PM2 monitor"
    echo "  info      - Show detailed app information"
    echo "  save      - Save current PM2 process list"
    echo "  startup   - Setup PM2 to start on boot"
    exit 1
    ;;
esac
