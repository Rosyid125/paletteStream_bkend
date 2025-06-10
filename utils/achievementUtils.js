// Utility functions for the Achievement System
const { gamificationEmitter } = require("../emitters/gamificationEmitter");
const AchievementService = require("../services/AchievementService");

class AchievementUtils {
  /**
   * Emit achievement event with metadata
   * @param {string} eventName - The achievement event name
   * @param {number} userId - User ID
   * @param {object} metadata - Additional event data
   */
  static emitAchievementEvent(eventName, userId, metadata = {}) {
    try {
      gamificationEmitter.emitAchievementEvent(eventName, userId, metadata);
      console.log(`🏆 Achievement event emitted: ${eventName} for user ${userId}`);
    } catch (error) {
      console.error(`❌ Failed to emit achievement event ${eventName}:`, error);
    }
  }

  /**
   * Check and update multiple achievements for a user
   * @param {number} userId - User ID
   * @param {Array} events - Array of event objects {eventName, metadata}
   */
  static async updateMultipleAchievements(userId, events) {
    try {
      for (const event of events) {
        await AchievementService.handleEvent(event.eventName, userId, event.metadata || {});
      }
    } catch (error) {
      console.error(`❌ Failed to update multiple achievements for user ${userId}:`, error);
    }
  }

  /**
   * Get achievement progress summary for user
   * @param {number} userId - User ID
   * @returns {object} Progress summary
   */
  static async getProgressSummary(userId) {
    try {
      const achievements = await AchievementService.getAllAchievements();
      const userAchievements = await AchievementService.getUnlockedAchievements(userId);

      const completed = userAchievements.length;
      const total = achievements.length;
      const percentage = Math.round((completed / total) * 100);

      return {
        completed,
        total,
        percentage,
        remaining: total - completed,
      };
    } catch (error) {
      console.error(`❌ Failed to get progress summary for user ${userId}:`, error);
      return { completed: 0, total: 0, percentage: 0, remaining: 0 };
    }
  }

  /**
   * Recalculate all achievements for a user (useful for data migration)
   * @param {number} userId - User ID
   */
  static async recalculateAllAchievements(userId) {
    console.log(`🔄 Recalculating all achievements for user ${userId}...`);

    const events = ["post_uploaded", "post_liked", "post_commented", "comment_replied", "post_bookmarked", "user_followed", "chat_started", "comment_replied_by_user"];

    for (const eventName of events) {
      try {
        await AchievementService.handleEvent(eventName, userId, {});
        console.log(`✅ Recalculated ${eventName} for user ${userId}`);
      } catch (error) {
        console.error(`❌ Failed to recalculate ${eventName} for user ${userId}:`, error);
      }
    }

    console.log(`🎉 Finished recalculating achievements for user ${userId}`);
  }

  /**
   * Log achievement completion
   * @param {number} userId - User ID
   * @param {object} achievement - Achievement object
   */
  static logAchievementCompletion(userId, achievement) {
    console.log(`🏆 ACHIEVEMENT UNLOCKED! User ${userId} completed: ${achievement.title}`);
    // Here you could add notification sending, badge awarding, etc.
  }

  /**
   * Get achievement event mapping
   * @returns {object} Event mapping object
   */
  static getEventMapping() {
    return {
      // Post-related events
      postCreated: "post_uploaded",
      postGotLiked: "post_liked",
      postGotCommented: "post_commented",
      postGotBookmarked: "post_bookmarked",

      // Social events
      userGotFollowed: "user_followed",
      commentGotReplied: "comment_replied",
      replyOnComment: "comment_replied_by_user",

      // Chat events
      chatStarted: "chat_started",

      // Leaderboard events
      dailyLeaderboard: "leaderboard_daily",
      weeklyLeaderboard: "leaderboard_weekly",

      // Tag events
      postTagged: "post_tagged",
    };
  }

  /**
   * Validate achievement event data
   * @param {string} eventName - Event name
   * @param {number} userId - User ID
   * @param {object} metadata - Event metadata
   * @returns {boolean} Is valid
   */
  static validateEventData(eventName, userId, metadata = {}) {
    if (!eventName || typeof eventName !== "string") {
      console.error("❌ Invalid event name");
      return false;
    }

    if (!userId || typeof userId !== "number") {
      console.error("❌ Invalid user ID");
      return false;
    }

    if (typeof metadata !== "object") {
      console.error("❌ Invalid metadata");
      return false;
    }

    return true;
  }
}

module.exports = AchievementUtils;
