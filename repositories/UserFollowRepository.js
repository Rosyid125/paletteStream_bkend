// Import all model
const UserFollow = require("../models/UserFollow");
// For error handling
const currentRepo = "UserFollowRepository";

class UserFollowRepository {
  // Get all user follows
  static async findAll() {
    try {
      const userFollows = await UserFollow.query();
      return userFollows;
    } catch (error) {
      throw error;
    }
  }

  // Get user followings ids by user id
  static async findByFollowerId(user_id) {
    try {
      const userFollows = await UserFollow.query().where({ follower_id: user_id }).select("followed_id");
      return userFollows;
    } catch (error) {
      throw error;
    }
  }

  // Get user followers ids by user id
  static async findByFollowedId(user_id) {
    try {
      const userFollows = await UserFollow.query().where({ followed_id: user_id }).select("follower_id");

      // Array of user ids
      const userIds = userFollows.map((userFollow) => userFollow.follower_id);

      return userIds;
    } catch (error) {
      throw error;
    }
  }

  // Get status by follower id and followed id
  static async findByFollowerIdAndFollowedId(follower_id, followed_id) {
    try {
      const userFollow = await UserFollow.query().findOne({ follower_id, followed_id });

      return userFollow;
    } catch (error) {
      throw error;
    }
  }

  // Get statuses by follower id and followed ids
  static async findByFollowerIdAndFollowedIds(follower_id, followed_ids) {
    try {
      const userFollows = await UserFollow.query().where({ follower_id }).whereIn("followed_id", followed_ids);
      return userFollows;
    } catch (error) {
      throw error;
    }
  }

  // Create a new user follow
  static async create(follower_id, followed_id) {
    try {
      const userFollow = await UserFollow.query().insert({ follower_id, followed_id });
      return userFollow;
    } catch (error) {
      throw error;
    }
  }

  // Delete a user follow
  static async delete(follower_id, followed_id) {
    try {
      const userFollow = await UserFollow.query().findOne({ follower_id, followed_id });
      if (!userFollow) {
        return null;
      }
      await UserFollow.query().findOne({ follower_id, followed_id }).delete();
      return userFollow;
    } catch (error) {
      throw error;
    }
  }

  // Count user followings by user id
  static async countFollowingsByUserId(follower_id) {
    try {
      const result = await UserFollow.query().where({ follower_id }).count("follower_id as count").first();
      return result?.count || 0;
    } catch (error) {
      throw error;
    }
  }
  // Count followers by user id
  static async countFollowersByUserId(followed_id) {
    try {
      const result = await UserFollow.query().where({ followed_id }).count("followed_id as count").first();
      return result?.count || 0;
    } catch (error) {
      throw error;
    }
  }

  // Get followers for achievement system
  static async findFollowers(user_id) {
    try {
      const userFollows = await UserFollow.query().where({ followed_id: user_id }).select("follower_id");
      return userFollows.map((follow) => ({ follower_id: follow.follower_id }));
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserFollowRepository;
