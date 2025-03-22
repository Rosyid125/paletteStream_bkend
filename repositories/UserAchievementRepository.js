// Import model
const UserAchievement = require("../models/UserAchievement");

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
  static async create(user_id, achievement_id, progress, status) {
    const userAchievement = await UserAchievement.query().insert({ user_id, achievement_id, progress, status });
    return userAchievement;
  }

  // Update user achievement
  static async update(user_id, achievement_id, progress, status) {
    const userAchievement = await UserAchievement.query().findOne({ user_id });
    if (!userAchievement) {
      return null;
    }
    await UserAchievement.query().findOne({ user_id }).patch({ achievement_id, progress, status });
    return userAchievement;
  }
}

module.exports = UserAchievementRepository;
