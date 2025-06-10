const AchievementRepository = require("../repositories/AchievementRepository");
const UserAchievementRepository = require("../repositories/UserAchievementRepository");
const UserRepository = require("../repositories/UserRepository"); // Ensure UserRepository is imported
const customError = require("../errors/customError");

class UserAchievementService {
  // Static method to get user achievements
  static async getUserAchievements(userId) {
    try {
      // Get user achievements by user id
      const userAchievements = await UserAchievementRepository.findByUserId(userId);
      const achievements = await AchievementRepository.findAll();

      const userAchievementData = userAchievements.map((userAchievement) => {
        const achievement = achievements.find((achievement) => achievement.id === userAchievement.achievementId);
        return {
          id: userAchievement.id,
          title: achievement.title,
          icon: achievement.icon,
          description: achievement.description,
          goal: achievement.goal,
          progress: userAchievement.progress,
          status: userAchievement.status,
        };
      });

      return userAchievementData;
    } catch (error) {
      throw error;
    }
  }

  // Static method to update user achievement
  static async updateUserAchievement(userId, achievementId, progress, status) {
    try {
      const userAchievement = await UserAchievementRepository.update(userId, achievementId, progress, status);
      if (!userAchievement) {
        throw new customError("User achievement not found");
      }

      return userAchievement;
    } catch (error) {
      throw error;
    }
  }

  // Static method to create a new achievement
  static async createAchievement(title, icon, description, goal) {
    try {
      // Create a new achievement
      const achievement = await AchievementRepository.create(title, icon, description, goal); // Add default entries to userAchievements table for all users
      const users = await UserRepository.findAllUsers();
      for (const user of users) {
        await UserAchievementRepository.create(user.id, achievement.id, 0, "in-progress");
      }

      return achievement;
    } catch (error) {
      throw error;
    }
  }

  // Static method to update achievement
  static async updateAchievement(achievementId, title, icon, description, goal) {
    try {
      const achievement = await AchievementRepository.update(achievementId, title, icon, description, goal);
      if (!achievement) {
        throw new customError("Achievement not found");
      }

      return achievement;
    } catch (error) {
      throw error;
    }
  }

  // Static method to delete achievement
  static async deleteAchievement(achievementId) {
    try {
      const achievement = await AchievementRepository.delete(achievementId);
      if (!achievement) {
        throw new customError("Achievement not found");
      }

      return achievement;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserAchievementService;
