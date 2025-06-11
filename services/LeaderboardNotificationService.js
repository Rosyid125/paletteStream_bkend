const UserPostService = require("./UserPostService.js");
const NotificationService = require("./NotificationService.js");
const AchievementService = require("./AchievementService.js");
const ChallengeRepository = require("../repositories/ChallengeRepository.js");

class LeaderboardNotificationService {
  /**
   * Check and notify users about leaderboard changes
   * This should be called periodically (e.g., daily/weekly cron job)
   */
  static async checkAndNotifyLeaderboardChanges() {
    try {
      await this.checkDailyLeaderboard();
      await this.checkWeeklyLeaderboard();
      await this.checkChallengeDeadlines();
    } catch (error) {
      console.error("Error checking leaderboard changes:", error);
    }
  }

  /**
   * Check daily leaderboard and notify top performers
   */
  static async checkDailyLeaderboard() {
    try {
      // Get top 10 posts from leaderboard
      const topPosts = await UserPostService.getPostLeaderboards(1, 1, 10);

      if (!topPosts || topPosts.length === 0) return;

      // Notify users whose posts are in top 10
      for (let i = 0; i < topPosts.length; i++) {
        const post = topPosts[i];
        const rank = i + 1;

        try {
          // Send leaderboard notification
          await NotificationService.notifyPostInLeaderboard(post.userId, post.id, post.title, rank, "daily");

          // Trigger achievement check for top 10 daily leaderboard
          await AchievementService.handleEvent("leaderboard_daily", post.userId, {
            postId: post.id,
            rank: rank,
            isTop10: rank <= 10,
          });
        } catch (notificationError) {
          console.error(`Failed to notify user ${post.userId} about daily leaderboard:`, notificationError);
        }
      }

      console.log(`Processed daily leaderboard notifications for ${topPosts.length} posts`);
    } catch (error) {
      console.error("Error checking daily leaderboard:", error);
    }
  }

  /**
   * Check weekly leaderboard and notify top performers
   * Note: This would need a separate weekly leaderboard query
   */
  static async checkWeeklyLeaderboard() {
    try {
      // Get top 10 posts from weekly leaderboard
      // For now, we'll use the same method but this could be enhanced
      // to include date range filtering for weekly data
      const topPosts = await UserPostService.getPostLeaderboards(1, 1, 10);

      if (!topPosts || topPosts.length === 0) return;

      // Notify users whose posts are in top 10 weekly
      for (let i = 0; i < topPosts.length; i++) {
        const post = topPosts[i];
        const rank = i + 1;

        try {
          // Send weekly leaderboard notification
          await NotificationService.notifyPostInLeaderboard(post.userId, post.id, post.title, rank, "weekly");

          // Trigger achievement check for top 10 weekly leaderboard
          await AchievementService.handleEvent("leaderboard_weekly", post.userId, {
            postId: post.id,
            rank: rank,
            isTop10: rank <= 10,
          });
        } catch (notificationError) {
          console.error(`Failed to notify user ${post.userId} about weekly leaderboard:`, notificationError);
        }
      }

      console.log(`Processed weekly leaderboard notifications for ${topPosts.length} posts`);
    } catch (error) {
      console.error("Error checking weekly leaderboard:", error);
    }
  }

  /**
   * Notify when a user's post climbs significantly in leaderboard
   * This could be called when post engagement changes significantly
   */
  static async notifyLeaderboardClimb(postId, userId, postTitle, previousRank, currentRank) {
    try {
      // Only notify for significant improvements (moved up at least 5 positions)
      if (previousRank - currentRank >= 5) {
        await NotificationService.notifyPostInLeaderboard(userId, postId, postTitle, currentRank, "trending");
      }
    } catch (error) {
      console.error("Error notifying leaderboard climb:", error);
    }
  }

  /**
   * Check for trending posts that gained significant engagement recently
   * This could be called hourly to catch viral content
   */
  static async checkTrendingPosts() {
    try {
      // Get recent top posts (this would ideally filter by recent activity)
      const recentTopPosts = await UserPostService.getPostLeaderboards(1, 1, 5);

      if (!recentTopPosts || recentTopPosts.length === 0) return;

      // Notify users about trending status
      for (let i = 0; i < recentTopPosts.length; i++) {
        const post = recentTopPosts[i];
        const rank = i + 1;

        // Only notify top 3 trending posts
        if (rank <= 3) {
          try {
            await NotificationService.notifyPostInLeaderboard(post.userId, post.id, post.title, rank, "trending");
          } catch (notificationError) {
            console.error(`Failed to notify trending post ${post.id}:`, notificationError);
          }
        }
      }
      console.log(`Processed trending post notifications for ${Math.min(recentTopPosts.length, 3)} posts`);
    } catch (error) {
      console.error("Error checking trending posts:", error);
    }
  }

  /**
   * Check for challenge deadlines and send reminder notifications
   */
  static async checkChallengeDeadlines() {
    try {
      // Get active challenges (not closed)
      const challenges = await ChallengeRepository.findAll();
      const activeChallenges = challenges.filter((challenge) => !challenge.is_closed);

      if (!activeChallenges || activeChallenges.length === 0) return;

      const now = new Date();

      for (const challenge of activeChallenges) {
        const deadline = new Date(challenge.deadline);
        const timeUntilDeadline = deadline - now;

        // Send reminders at different intervals
        const oneDayInMs = 24 * 60 * 60 * 1000;
        const oneHourInMs = 60 * 60 * 1000;

        // 24 hours before deadline
        if (timeUntilDeadline <= oneDayInMs && timeUntilDeadline > oneDayInMs - oneHourInMs) {
          await this.sendChallengeDeadlineReminder(challenge, "24 hours");
        }

        // 6 hours before deadline
        else if (timeUntilDeadline <= 6 * oneHourInMs && timeUntilDeadline > 5 * oneHourInMs) {
          await this.sendChallengeDeadlineReminder(challenge, "6 hours");
        }

        // 1 hour before deadline
        else if (timeUntilDeadline <= oneHourInMs && timeUntilDeadline > 30 * 60 * 1000) {
          await this.sendChallengeDeadlineReminder(challenge, "1 hour");
        }
      }

      console.log(`Processed challenge deadline reminders for ${activeChallenges.length} challenges`);
    } catch (error) {
      console.error("Error checking challenge deadlines:", error);
    }
  }

  /**
   * Send deadline reminder to all challenge participants
   */
  static async sendChallengeDeadlineReminder(challenge, timeRemaining) {
    try {
      // Get all users who have submitted to this challenge
      const challengeWithPosts = await ChallengeRepository.getChallengeLeaderboard(challenge.id);

      if (!challengeWithPosts?.challengePosts) return;

      // Get unique user IDs from challenge participants
      const participantUserIds = [...new Set(challengeWithPosts.challengePosts.map((cp) => cp.user_id))];

      // Send reminder notification to each participant
      for (const userId of participantUserIds) {
        try {
          await NotificationService.notifySystemMessage(userId, `Challenge Deadline Reminder`, `Only ${timeRemaining} left to submit to "${challenge.title}"! Don't miss your chance to win!`, `/challenges/${challenge.id}`);
        } catch (notificationError) {
          console.error(`Failed to send deadline reminder to user ${userId}:`, notificationError);
        }
      }

      console.log(`Sent ${timeRemaining} deadline reminders to ${participantUserIds.length} participants for challenge "${challenge.title}"`);
    } catch (error) {
      console.error(`Error sending deadline reminder for challenge ${challenge.id}:`, error);
    }
  }
}

module.exports = LeaderboardNotificationService;
