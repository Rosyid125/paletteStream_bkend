// Service untuk logika bisnis achievement & progress
const AchievementRepository = require("../repositories/AchievementRepository");
const UserAchievementRepository = require("../repositories/UserAchievementRepository");
const customError = require("../errors/customError");

class AchievementService {
  // Ambil semua achievement (maks 20)
  static async getAllAchievements() {
    const achievements = await AchievementRepository.findAll();
    return achievements.slice(0, 20);
  }

  // Ambil achievement yang sudah unlocked user
  static async getUnlockedAchievements(userId) {
    const userAchievements = await UserAchievementRepository.findByUserId(userId);
    return userAchievements?.filter((a) => a.status === "completed") || [];
  }

  // Update progress achievement (triggered by event)
  static async updateProgress({ userId, trigger, value = 1 }) {
    // Mapping trigger ke achievement_id (bisa pakai config/enum)
    // Contoh: { UPLOAD_POST: 1, LEVEL_UP: 2, ... }
    const triggerMap = {
      UPLOAD_POST: 1,
      LEVEL_UP: 2,
      // Tambahkan mapping lain sesuai kebutuhan
    };
    const achievementId = triggerMap[trigger];
    if (!achievementId) throw new customError("Invalid trigger", 400);
    const achievement = await AchievementRepository.findById(achievementId);
    if (!achievement) throw new customError("Achievement not found", 404);
    // Cek user_achievement
    let userAch = await UserAchievementRepository.findByUserAndAchievement(userId, achievementId);
    if (!userAch) {
      // Belum ada, insert baru
      userAch = await UserAchievementRepository.create(userId, achievementId, value, value >= achievement.goal ? "completed" : "in-progress");
    } else {
      // Update progress
      let newProgress = userAch.progress + value;
      let status = newProgress >= achievement.goal ? "completed" : "in-progress";
      if (newProgress > achievement.goal) newProgress = achievement.goal;
      await UserAchievementRepository.update(userId, achievementId, newProgress, status);
    }
    return true;
  }

  // Format progress string
  static formatProgress(progress, goal) {
    return `${progress}/${goal}`;
  }
}

module.exports = AchievementService;
