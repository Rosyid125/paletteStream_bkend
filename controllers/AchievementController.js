const AchievementService = require("../services/AchievementService");
const AchievementRepository = require("../repositories/AchievementRepository");
const UserAchievementRepository = require("../repositories/UserAchievementRepository");
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
}

module.exports = AchievementController;
