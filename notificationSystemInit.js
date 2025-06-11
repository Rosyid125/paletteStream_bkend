const NotificationScheduler = require("./schedulers/NotificationScheduler.js");

/**
 * Initialize the complete notification system
 * Call this function when starting the application
 */
function initializeNotificationSystem() {
  console.log("🔔 Initializing Notification System...");

  try {
    // Start scheduled notification jobs
    NotificationScheduler.initializeSchedulers();

    console.log("✅ Notification System initialized successfully");
    console.log("📅 Scheduled jobs:");
    console.log("   - Daily leaderboard check (9 AM daily)");
    console.log("   - Weekly leaderboard check (10 AM Monday)");
    console.log("   - Trending posts check (hourly)");
    console.log("   - Challenge deadline reminders (hourly)");
    console.log("   - Notification cleanup (midnight daily)");
    console.log("💬 Real-time WebSocket notifications enabled");
    console.log("🎯 Mention detection active in comments/replies");
  } catch (error) {
    console.error("❌ Failed to initialize notification system:", error);
    throw error;
  }
}

/**
 * Gracefully shutdown notification system
 * Call this function when shutting down the application
 */
function shutdownNotificationSystem() {
  console.log("🔄 Shutting down Notification System...");

  try {
    NotificationScheduler.stopAllSchedulers();
    console.log("✅ Notification System shutdown complete");
  } catch (error) {
    console.error("❌ Error during notification system shutdown:", error);
  }
}

module.exports = {
  initializeNotificationSystem,
  shutdownNotificationSystem,
};

/* 
USAGE EXAMPLE:

// In your main app.js or server.js
const { initializeNotificationSystem, shutdownNotificationSystem } = require('./notificationSystemInit.js');

// Initialize when starting the app
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  initializeNotificationSystem();
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  shutdownNotificationSystem();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  shutdownNotificationSystem();
  process.exit(0);
});
*/
