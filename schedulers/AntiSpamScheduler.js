const cron = require("node-cron");
const AntiSpamService = require("../services/AntiSpamService");

/**
 * Scheduler untuk cleanup spam data dan expired locks
 * Berjalan setiap hari jam 2 pagi
 */
class AntiSpamScheduler {
  static start() {
    // Cleanup setiap hari jam 2:00 AM
    cron.schedule(
      "0 2 * * *",
      async () => {
        console.log("🧹 Starting anti-spam cleanup job...");

        try {
          await AntiSpamService.cleanup();
          console.log("✅ Anti-spam cleanup completed successfully");
        } catch (error) {
          console.error("❌ Anti-spam cleanup failed:", error);
        }
      },
      {
        scheduled: false,
        timezone: "Asia/Jakarta",
      }
    );

    console.log("📅 Anti-spam scheduler initialized");
  }

  static async runCleanupNow() {
    console.log("🧹 Running manual anti-spam cleanup...");
    try {
      await AntiSpamService.cleanup();
      console.log("✅ Manual cleanup completed successfully");
    } catch (error) {
      console.error("❌ Manual cleanup failed:", error);
      throw error;
    }
  }
}

module.exports = AntiSpamScheduler;
