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
  static async create(user_id, badge_id) {
    const userBadge = await UserBadge.query().insert({ user_id, badge_id });
    return userBadge;
  }

  // Update user badge
  static async update(user_id, badge_id) {
    const userBadge = await UserBadge.query().findOne({ user_id });
    if (!userBadge) {
      return null;
    }
    await UserBadge.query().findOne({ user_id }).patch({ badge_id });
    return userBadge;
  }
}

module.exports = UserBadgeRepository;
