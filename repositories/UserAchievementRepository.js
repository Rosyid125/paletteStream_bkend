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
      throw error;
    }
  }

  // Get all user achievements by user id
  static async findByUserId(user_id) {
    try {
      const userAchievements = await UserAchievement.query().where({ user_id });
      return userAchievements;
    } catch (error) {
      throw error;
    }
  }

  // Get user achievement by user id & achievement id
  static async findByUserAndAchievement(user_id, achievement_id) {
    try {
      const userAchievement = await UserAchievement.query().findOne({ user_id, achievement_id });
      return userAchievement;
    } catch (error) {
      throw error;
    }
  }

  // Create a new user achievement
  static async create(user_id, achievement_id, progress, status) {
    try {
      const userAchievement = await UserAchievement.query().insert({ user_id, achievement_id, progress, status });
      return userAchievement;
    } catch (error) {
      throw error;
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
      throw error;
    }
  }
}

module.exports = UserAchievementRepository;
