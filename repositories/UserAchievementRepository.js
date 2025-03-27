// Import model
const UserAchievement = require("../models/UserAchievement");
// For error handling
const currentRepo = "UserAchievementRepository";

class UserAchievementRepository {
  // Get all user achievements
  static async findAll() {
    try {
      const userAchievements = await UserAchievement.query();
      return userAchievements;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Get user achievement by user id
  static async findByUserId(user_id) {
    try {
      const userAchievement = await UserAchievement.query().findOne({ user_id });
      return userAchievement;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Create a new user achievement
  static async create(user_id, achievement_id, progress, status) {
    try {
      const userAchievement = await UserAchievement.query().insert({ user_id, achievement_id, progress, status });
      return userAchievement;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Update user achievement
  static async update(user_id, achievement_id, progress, status) {
    try {
      const userAchievement = await UserAchievement.query().findOne({ user_id });
      if (!userAchievement) {
        return null;
      }
      await UserAchievement.query().findOne({ user_id }).patch({ achievement_id, progress, status });
      return userAchievement;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }
}

module.exports = UserAchievementRepository;
