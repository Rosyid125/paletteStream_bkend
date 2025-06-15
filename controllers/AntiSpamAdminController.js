const AntiSpamService = require("../services/AntiSpamService");
const UserSpamLockRepository = require("../repositories/UserSpamLockRepository");
const CommentSpamTrackingRepository = require("../repositories/CommentSpamTrackingRepository");
const AntiSpamLogger = require("../utils/AntiSpamLogger");
const customError = require("../errors/customError");

class AntiSpamAdminController {
  /**
   * Mendapatkan statistik spam untuk admin dashboard
   */
  static async getSpamStatistics(req, res) {
    try {
      const statistics = await AntiSpamService.getSpamStatistics();

      res.status(200).json({
        success: true,
        data: statistics,
        message: "Spam statistics retrieved successfully",
      });
    } catch (error) {
      console.error("Error getting spam statistics:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve spam statistics",
        error: error.message,
      });
    }
  }

  /**
   * Mendapatkan daftar user yang sedang di-lock
   */
  static async getActiveLocks(req, res) {
    try {
      const { spam_type } = req.query;
      const locks = await UserSpamLockRepository.getActiveLocks(spam_type);

      res.status(200).json({
        success: true,
        data: locks,
        message: "Active spam locks retrieved successfully",
      });
    } catch (error) {
      console.error("Error getting active locks:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve active locks",
        error: error.message,
      });
    }
  }

  /**
   * Mendapatkan history spam dari user tertentu
   */
  static async getUserSpamHistory(req, res) {
    try {
      const { userId } = req.params;
      const { limit = 20 } = req.query;

      const history = await CommentSpamTrackingRepository.getUserSpamHistory(parseInt(userId), parseInt(limit));

      res.status(200).json({
        success: true,
        data: history,
        message: "User spam history retrieved successfully",
      });
    } catch (error) {
      console.error("Error getting user spam history:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve user spam history",
        error: error.message,
      });
    }
  }

  /**
   * Manual unlock user (untuk admin)
   */
  static async unlockUser(req, res) {
    try {
      const { userId } = req.params;
      const { spam_type } = req.body;

      // Deactivate lock
      const updatedLocks = await UserSpamLockRepository.query().where("user_id", parseInt(userId)).where("spam_type", spam_type).where("is_active", true).patch({ is_active: false });

      if (updatedLocks === 0) {
        throw new customError("No active lock found for this user", 404);
      }

      res.status(200).json({
        success: true,
        message: "User unlocked successfully",
        data: { unlocked_locks: updatedLocks },
      });
    } catch (error) {
      console.error("Error unlocking user:", error);
      res.status(500).json({
        success: false,
        message: "Failed to unlock user",
        error: error.message,
      });
    }
  }

  /**
   * Manual cleanup spam data
   */
  static async runCleanup(req, res) {
    try {
      await AntiSpamService.cleanup();

      res.status(200).json({
        success: true,
        message: "Spam cleanup completed successfully",
      });
    } catch (error) {
      console.error("Error running cleanup:", error);
      res.status(500).json({
        success: false,
        message: "Failed to run cleanup",
        error: error.message,
      });
    }
  }

  /**
   * Mendapatkan info lock status user
   */
  static async getUserLockStatus(req, res) {
    try {
      const { userId } = req.params;
      const locks = await AntiSpamService.getUserLockInfo(parseInt(userId));

      res.status(200).json({
        success: true,
        data: {
          user_id: parseInt(userId),
          locks: locks,
          is_locked: locks.length > 0,
        },
        message: "User lock status retrieved successfully",
      });
    } catch (error) {
      console.error("Error getting user lock status:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve user lock status",
        error: error.message,
      });
    }
  }

  /**
   * Mendapatkan log anti-spam terbaru
   */
  static async getAntiSpamLogs(req, res) {
    try {
      const { lines = 50 } = req.query;
      const logs = AntiSpamLogger.getRecentLogs(parseInt(lines));

      res.status(200).json({
        success: true,
        data: logs,
        message: "Anti-spam logs retrieved successfully",
      });
    } catch (error) {
      console.error("Error getting anti-spam logs:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve anti-spam logs",
        error: error.message,
      });
    }
  }

  /**
   * Mendapatkan statistik spam dari logs
   */
  static async getLogStatistics(req, res) {
    try {
      const { hours = 24 } = req.query;
      const stats = AntiSpamLogger.getSpamStats(parseInt(hours));

      res.status(200).json({
        success: true,
        data: stats,
        message: "Log statistics retrieved successfully",
      });
    } catch (error) {
      console.error("Error getting log statistics:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve log statistics",
        error: error.message,
      });
    }
  }
}

module.exports = AntiSpamAdminController;
