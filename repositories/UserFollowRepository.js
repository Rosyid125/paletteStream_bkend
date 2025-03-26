// Import all model
const UserFollow = require("../models/UserFollow");

class UserFollowRepository {
  // Get all user follows
  static async findAll() {
    const userFollows = await UserFollow.query();
    return userFollows;
  }

  // Get user followings ids by user id
  static async findByFollowerId(user_id) {
    const userFollows = await UserFollow.query().where({ follower_id: user_id }).select("followed_id");
    return userFollows;
  }

  // Get user followers ids by user id
  static async findByFollowedId(user_id) {
    const userFollows = await UserFollow.query().where({ followed_id: user_id }).select("follower_id");
    return userFollows;
  }

  // Create a new user follow
  static async create(follower_id, followed_id) {
    const userFollow = await UserFollow.query().insert({ follower_id, followed_id });
    return userFollow;
  }

  // Delete a user follow
  static async delete(follower_id, followed_id) {
    const userFollow = await UserFollow.query().findOne({ follower_id, followed_id });
    if (!userFollow) {
      return null;
    }
    await UserFollow.query().findOne({ follower_id, followed_id }).delete();
    return userFollow;
  }

  // Count user followings by user id
  static async countFollowingsByUserId(follower_id) {
    const result = await UserFollow.query().where({ follower_id }).count("follower_id as count").first();
    return result?.count || 0;
  }

  // Count followers by user id
  static async countFollowersByUserId(followed_id) {
    const result = await UserFollow.query().where({ followed_id }).count("followed_id as count").first();
    return result?.count || 0;
  }
}

module.exports = UserFollowRepository;
