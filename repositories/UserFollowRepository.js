// Import all model
const UserFollow = require("../models/UserFollow");
const db = require("../config/db");

class UserFollowRepository {
  // Get all user follows
  static async findAll() {
    const userFollows = await UserFollow.query();
    return userFollows;
  }

  // Get user follow by follower id
  static async findByFollowerId(followerId) {
    const userFollow = await UserFollow.query().findOne({ follower_id: followerId });
    return userFollow;
  }

  // Get user follow by followed id
  static async findByFollowedId(followedId) {
    const userFollow = await UserFollow.query().findOne({ followed_id: followedId });
    return userFollow;
  }

  // Create a new user follow
  static async create(followerId, followedId) {
    const userFollow = await UserFollow.query().insert({ followerId, followedId });
    return userFollow;
  }

  // Delete a user follow
  static async delete(followerId, followedId) {
    const userFollow = await UserFollow.query().findOne({ follower_id: followerId, followed_id: followedId });
    if (!userFollow) {
      return null;
    }
    await UserFollow.query().findOne({ follower_id: followerId, followed_id: followedId }).delete();
    return userFollow;
  }

  // Count user followings by user id
  static async countFollowingsByUserId(followerId) {
    const count = await UserFollow.query().count("follower_id").where({ follower_id: followerId });
    return count;
  }

  // Count followers by user id
  static async countFollowersByUserId(followedId) {
    const count = await UserFollow.query().count("followed_id").where({ followed_id: followedId });
    return count;
  }
}

module.exports = UserFollowRepository;
