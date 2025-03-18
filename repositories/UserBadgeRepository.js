// Import model
const UserBadge = require("../models/UserBadge");
const db = require("../config/db");

class UserBadgeRepository {
  // Get all user badges
  static async findAll() {
    const userBadges = await UserBadge.query();
    return userBadges;
  }

  // Get user badge by user id
  static async findByUserId(user_id) {
    const userBadge = await UserBadge.query().findOne({ user_id });
    return userBadge;
  }

  // Create a new user badge
  static async create(userId, badgeId) {
    const userBadge = await UserBadge.query().insert({ userId, badgeId });
    return userBadge;
  }

  // Update user badge
  static async update(userId, badgeId) {
    const userBadge = await UserBadge.query().findOne({ userId });
    if (!userBadge) {
      return null;
    }
    await UserBadge.query().findOne({ userId }).patch({ badgeId });
    return userBadge;
  }

  // More based on app requirements
}

module.exports = UserBadgeRepository;
