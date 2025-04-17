// Import model
const UserBadge = require("../models/UserBadge");
// For error handling
const currentRepo = "UserBadgeRepository";

class UserBadgeRepository {
  // Get all user badges
  static async findAll() {
    try {
      const userBadges = await UserBadge.query();
      return userBadges;
    } catch (error) {
      throw error;
    }
  }

  // Get user badge by user id
  static async findByUserId(user_id) {
    try {
      const userBadge = await UserBadge.query().findOne({ user_id });
      return userBadge;
    } catch (error) {
      throw error;
    }
  }

  // Create a new user badge
  static async create(user_id, badge_id) {
    try {
      const userBadge = await UserBadge.query().insert({ user_id, badge_id });
      return userBadge;
    } catch (error) {
      throw error;
    }
  }

  // Update user badge
  static async update(user_id, badge_id) {
    try {
      const userBadge = await UserBadge.query().findOne({ user_id });
      if (!userBadge) {
        return null;
      }
      await UserBadge.query().findOne({ user_id }).patch({ badge_id });
      return userBadge;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserBadgeRepository;
