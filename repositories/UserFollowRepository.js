// Import all model
const UserFollow = require("../models/UserFollow");

class UserFollowRepository {
  // Get all user follows
  static async findAll() {
    const userFollows = await UserFollow.query();
    return userFollows;
  }

  // Get user followers by user id
  static async findByFollowerId(user_id) {
    const userFollows = await UserFollow.query().where({ follower_id: user_id });
    return userFollows;
  }

  // Get user followings by user id
  static async findByFollowedId(user_id) {
    const userFollows = await UserFollow.query().where({ followed_id: user_id });
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
    const count = await UserFollow.query().count("follower_id").where({ follower_id });
    return count;
  }

  // Count followers by user id
  static async countFollowersByUserId(followed_id) {
    const count = await UserFollow.query().count("followed_id").where({ followed_id });
    return count;
  }
}

module.exports = UserFollowRepository;
