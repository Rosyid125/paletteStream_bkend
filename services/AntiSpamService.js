const UserSpamLockRepository = require("../repositories/UserSpamLockRepository");
const CommentSpamTrackingRepository = require("../repositories/CommentSpamTrackingRepository");
const NotificationService = require("./NotificationService");
const AntiSpamLogger = require("../utils/AntiSpamLogger");

class AntiSpamService {
  static SPAM_THRESHOLDS = {
    COMMENT_SPAM: {
      MAX_SAME_COMMENTS: 5, // Maksimal 5 comment yang sama
      TIME_WINDOW_MINUTES: 10, // Dalam periode 10 menit
      RAPID_COMMENT_LIMIT: 3, // Maksimal 3 comment dalam 5 menit
      RAPID_TIME_WINDOW: 5, // 5 menit
      LOCK_DURATION_HOURS: 24, // Lock selama 24 jam
    },
  };

  /**
   * Cek dan handle comment spam sebelum memberikan EXP
   * @param {number} userId
   * @param {number} postId
   * @param {string} commentContent
   * @returns {Promise<{isSpam: boolean, canGiveExp: boolean, reason?: string}>}
   */
  static async checkCommentSpam(userId, postId, commentContent) {
    try {
      // 1. Cek apakah user sedang dalam lock status
      const isLocked = await UserSpamLockRepository.isUserLocked(userId, "comment_spam");
      if (isLocked) {
        const lockDetail = await UserSpamLockRepository.getUserLock(userId, "comment_spam");
        return {
          isSpam: true,
          canGiveExp: false,
          reason: `User is locked until ${lockDetail.unlock_at}`,
          lockDetail,
        };
      }

      // 2. Track comment ini
      await CommentSpamTrackingRepository.trackComment(userId, postId, commentContent);

      // 3. Cek rapid commenting (terlalu cepat comment di post yang sama)
      const isRapidCommenting = await CommentSpamTrackingRepository.isRapidCommenting(userId, postId, this.SPAM_THRESHOLDS.COMMENT_SPAM.RAPID_TIME_WINDOW, this.SPAM_THRESHOLDS.COMMENT_SPAM.RAPID_COMMENT_LIMIT);
      if (isRapidCommenting) {
        AntiSpamLogger.logSpamDetected(userId, "rapid_commenting", {
          post_id: postId,
          comment_content: commentContent,
          time_window: this.SPAM_THRESHOLDS.COMMENT_SPAM.RAPID_TIME_WINDOW,
          limit: this.SPAM_THRESHOLDS.COMMENT_SPAM.RAPID_COMMENT_LIMIT,
        });

        await this.handleSpamDetected(userId, "rapid_commenting", {
          post_id: postId,
          comment_content: commentContent,
          reason: "Rapid commenting detected",
        });

        return {
          isSpam: true,
          canGiveExp: false,
          reason: "Rapid commenting detected - user locked for 24 hours",
        };
      }

      // 4. Cek duplicate content (comment yang sama berulang)
      const similarCount = await CommentSpamTrackingRepository.countSimilarComments(userId, postId, commentContent, this.SPAM_THRESHOLDS.COMMENT_SPAM.TIME_WINDOW_MINUTES);
      if (similarCount >= this.SPAM_THRESHOLDS.COMMENT_SPAM.MAX_SAME_COMMENTS) {
        AntiSpamLogger.logSpamDetected(userId, "duplicate_comments", {
          post_id: postId,
          comment_content: commentContent,
          similar_count: similarCount,
          threshold: this.SPAM_THRESHOLDS.COMMENT_SPAM.MAX_SAME_COMMENTS,
        });

        await this.handleSpamDetected(userId, "duplicate_comments", {
          post_id: postId,
          comment_content: commentContent,
          similar_count: similarCount,
          reason: "Duplicate comments detected",
        });

        return {
          isSpam: true,
          canGiveExp: false,
          reason: `Duplicate comments detected (${similarCount} times) - user locked for 24 hours`,
        };
      }

      // 5. Comment valid, boleh dapat EXP
      return {
        isSpam: false,
        canGiveExp: true,
      };
    } catch (error) {
      console.error("Error in checkCommentSpam:", error);
      // Jika ada error, default ke allow (tapi log error)
      return {
        isSpam: false,
        canGiveExp: true,
        error: error.message,
      };
    }
  }

  /**
   * Handle ketika spam terdeteksi
   * @param {number} userId
   * @param {string} spamType
   * @param {Object} spamData
   */
  static async handleSpamDetected(userId, spamType, spamData) {
    try {
      // 1. Buat lock untuk user
      const lock = await UserSpamLockRepository.createLock(
        userId,
        "comment_spam",
        {
          type: spamType,
          ...spamData,
          detected_at: new Date(),
        },
        this.SPAM_THRESHOLDS.COMMENT_SPAM.LOCK_DURATION_HOURS
      ); // 2. Kirim notifikasi ke user
      await NotificationService.notifySpamDetected(userId, spamType, lock.unlock_at);

      // 3. Log untuk admin
      AntiSpamLogger.logUserLocked(userId, "comment_spam", lock.unlock_at);
      return lock;
    } catch (error) {
      AntiSpamLogger.logError(error, { userId, spamType });
      console.error("Error handling spam detection:", error);
      throw error;
    }
  }

  /**
   * Cek apakah user bisa mendapat EXP untuk event tertentu
   * @param {number} userId
   * @param {string} eventType
   * @returns {Promise<boolean>}
   */
  static async canUserGetExp(userId, eventType) {
    // Map event types ke spam types
    const eventToSpamType = {
      commentOnPost: "comment_spam",
      replyOnComment: "comment_spam",
      // Bisa ditambahkan untuk event lain
    };

    const spamType = eventToSpamType[eventType];
    if (!spamType) {
      return true; // Event tidak perlu dicek spam
    }

    return !(await UserSpamLockRepository.isUserLocked(userId, spamType));
  }
  /**
   * Mendapatkan info lock user
   * @param {number} userId
   * @returns {Promise<Array>}
   */ static async getUserLockInfo(userId) {
    const UserSpamLock = require("../models/UserSpamLock");
    const locks = await UserSpamLock.query().where("user_id", userId).where("is_active", true).where("unlock_at", ">", new Date().toISOString().slice(0, 19).replace("T", " "));

    return locks;
  }

  /**
   * Cleanup expired locks dan old tracking data
   */
  static async cleanup() {
    try {
      // Deaktivasi lock yang expired
      const expiredLocks = await UserSpamLockRepository.deactivateExpiredLocks();

      // Cleanup old tracking data (older than 30 days)
      const cleanedTracking = await CommentSpamTrackingRepository.cleanOldTrackingData(30);

      AntiSpamLogger.logCleanup(expiredLocks, cleanedTracking);
    } catch (error) {
      AntiSpamLogger.logError(error, { action: "cleanup" });
      console.error("Error in cleanup:", error);
    }
  }

  /**
   * Get spam statistics for admin
   * @returns {Promise<Object>}
   */
  static async getSpamStatistics() {
    try {
      const activeLocks = await UserSpamLockRepository.getActiveLocks();
      const commentSpamLocks = activeLocks.filter((lock) => lock.spam_type === "comment_spam");

      return {
        total_active_locks: activeLocks.length,
        comment_spam_locks: commentSpamLocks.length,
        locks_by_type: activeLocks.reduce((acc, lock) => {
          acc[lock.spam_type] = (acc[lock.spam_type] || 0) + 1;
          return acc;
        }, {}),
      };
    } catch (error) {
      console.error("Error getting spam statistics:", error);
      return { error: error.message };
    }
  }
}

module.exports = AntiSpamService;
