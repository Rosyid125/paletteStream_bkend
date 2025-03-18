// Import model
const UserAchievement = require("../models/UserAchievement");
const db = require("../config/db");

class UserAchievementRepository {
  // Get all user achievements
  static async findAll() {
    const userAchievements = await UserAchievement.query();
    return userAchievements;
  }

  // Get user achievement by user id
  static async findByUserId(user_id) {
    const userAchievement = await UserAchievement.query().findOne({ user_id });
    return userAchievement;
  }

  // Create a new user achievement
  static async create(userId, achievementId) {
    const userAchievement = await UserAchievement.query().insert({ userId, achievementId });
    return userAchievement;
  }

  // Update user achievement
  static async update(userId, achievementId) {
    const userAchievement = await UserAchievement.query().findOne({ userId });
    if (!userAchievement) {
      return null;
    }
    await UserAchievement.query().findOne({ userId }).patch({ achievementId });
    return userAchievement;
  }

  // More based on app requirements
}

module.exports = UserAchievementRepository;
