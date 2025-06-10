const cron = require("node-cron");
const ChallengeService = require("../services/ChallengeService");
const logger = require("./winstonLogger");

class ChallengeScheduler {
  // Start the scheduler
  static start() {
    // Run every hour to check for expired challenges
    cron.schedule("0 * * * *", async () => {
      try {
        logger.info("Running auto-close expired challenges job...");
        const result = await ChallengeService.autoCloseExpiredChallenges();
        logger.info(`Auto-close job completed: ${result.message}`);
      } catch (error) {
        logger.error(`Auto-close job failed: ${error.message}`, {
          stack: error.stack,
          timestamp: new Date().toISOString(),
        });
      }
    });

    logger.info("Challenge auto-close scheduler started (runs every hour)");
  }

  // Manual trigger for testing
  static async triggerAutoClose() {
    try {
      logger.info("Manual trigger: auto-closing expired challenges...");
      const result = await ChallengeService.autoCloseExpiredChallenges();
      logger.info(`Manual auto-close completed: ${result.message}`);
      return result;
    } catch (error) {
      logger.error(`Manual auto-close failed: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });
      throw error;
    }
  }
}

module.exports = ChallengeScheduler;
