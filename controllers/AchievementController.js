const AchievementService = require("../services/AchievementService");
const AchievementRepository = require("../repositories/AchievementRepository");
const UserAchievementRepository = require("../repositories/UserAchievementRepository");
const AchievementUtils = require("../utils/achievementUtils");
const customError = require("../errors/customError");

class AchievementController {
  // GET /achievements
  static async getAll(req, res) {
    try {
      const achievements = await AchievementService.getAllAchievements();
      res.json({ success: true, data: achievements });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // POST /achievements/progress
  static async updateProgress(req, res) {
    try {
      const { userId, trigger, value } = req.body;
      await AchievementService.updateProgress({ userId, trigger, value });
      res.json({ success: true, message: "Progress updated" });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // GET /achievements/user/:userId
  static async getProgressByUserId(req, res) {
    try {
      const userId = req.params.userId;
      if (!userId) return res.status(400).json({ success: false, message: "userId required" });
      const achievements = await AchievementService.getAllAchievements();
      const userAchievements = await UserAchievementRepository.findByUserId(userId);
      const progressList = achievements.map((ach) => {
        const userAch = userAchievements.find((ua) => ua.achievement_id === ach.id);
        return {
          id: ach.id,
          title: ach.title,
          icon: ach.icon,
          description: ach.description,
          goal: ach.goal,
          progress: userAch ? userAch.progress : 0,
          status: userAch ? userAch.status : "in-progress",
        };
      });
      res.json({ success: true, data: progressList });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // GET /achievements/user/:userId/summary
  static async getProgressSummary(req, res) {
    try {
      const userId = parseInt(req.params.userId);
      if (!userId) return res.status(400).json({ success: false, message: "Valid userId required" });
      
      const summary = await AchievementUtils.getProgressSummary(userId);
      res.json({ success: true, data: summary });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // POST /achievements/user/:userId/recalculate
  static async recalculateAchievements(req, res) {
    try {
      const userId = parseInt(req.params.userId);
      if (!userId) return res.status(400).json({ success: false, message: "Valid userId required" });
      
      await AchievementUtils.recalculateAllAchievements(userId);
      res.json({ success: true, message: "Achievements recalculated successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // GET /achievements/completed/:userId
  static async getCompletedAchievements(req, res) {
    try {
      const userId = parseInt(req.params.userId);
      if (!userId) return res.status(400).json({ success: false, message: "Valid userId required" });
      
      const completedAchievements = await AchievementService.getUnlockedAchievements(userId);
      res.json({ success: true, data: completedAchievements });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = AchievementController;
