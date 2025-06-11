const cron = require("node-cron");
const LeaderboardNotificationService = require("../services/LeaderboardNotificationService.js");
const NotificationService = require("../services/NotificationService.js");

class NotificationScheduler {
  /**
   * Initialize all notification-related scheduled tasks
   */
  static initializeSchedulers() {
    // Daily leaderboard check at 9 AM every day
    cron.schedule("0 9 * * *", async () => {
      console.log("Running daily leaderboard check...");
      try {
        await LeaderboardNotificationService.checkDailyLeaderboard();
      } catch (error) {
        console.error("Daily leaderboard check failed:", error);
      }
    });

    // Weekly leaderboard check every Monday at 10 AM
    cron.schedule("0 10 * * 1", async () => {
      console.log("Running weekly leaderboard check...");
      try {
        await LeaderboardNotificationService.checkWeeklyLeaderboard();
      } catch (error) {
        console.error("Weekly leaderboard check failed:", error);
      }
    }); // Trending posts check every hour
    cron.schedule("0 * * * *", async () => {
      console.log("Running trending posts check...");
      try {
        await LeaderboardNotificationService.checkTrendingPosts();
      } catch (error) {
        console.error("Trending posts check failed:", error);
      }
    });

    // Challenge deadline reminders every hour
    cron.schedule("0 * * * *", async () => {
      console.log("Running challenge deadline check...");
      try {
        await LeaderboardNotificationService.checkChallengeDeadlines();
      } catch (error) {
        console.error("Challenge deadline check failed:", error);
      }
    });

    // Cleanup old notifications every day at midnight
    cron.schedule("0 0 * * *", async () => {
      console.log("Running notification cleanup...");
      try {
        await NotificationService.deleteOldNotifications(30); // Delete notifications older than 30 days
      } catch (error) {
        console.error("Notification cleanup failed:", error);
      }
    });

    console.log("Notification schedulers initialized successfully");
  }

  /**
   * Stop all scheduled tasks (useful for testing or shutdown)
   */
  static stopAllSchedulers() {
    cron.getTasks().forEach((task) => task.stop());
    console.log("All notification schedulers stopped");
  }
}

module.exports = NotificationScheduler;
