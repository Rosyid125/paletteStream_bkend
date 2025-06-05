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

  // GET /achievements/unlocked
  static async getUnlocked(req, res) {
    try {
      const { userId } = req.query;
      const unlocked = await AchievementService.getUnlockedAchievements(userId);
      // Format progress string
      const all = await AchievementRepository.findAll();
      const result = unlocked.map((ua) => {
        const ach = all.find((a) => a.id === ua.achievement_id);
        return {
          ...ua,
          progress: AchievementService.formatProgress(ua.progress, ach.goal),
        };
      });
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = AchievementController;
