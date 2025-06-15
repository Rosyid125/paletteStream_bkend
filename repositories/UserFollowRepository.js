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
  // Get user followings with pagination and user details
  static async findFollowingsByFollowerIdWithPagination(user_id, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;

      const query = UserFollow.query()
        .where({ follower_id: user_id })
        .joinRelated("followedUser.profile")
        .select(
          "user_follows.followed_id",
          "user_follows.created_at as followed_at",
          "followedUser.id as user_id",
          "followedUser.first_name",
          "followedUser.last_name",
          "followedUser:profile.username",
          "followedUser:profile.avatar",
          "followedUser:profile.bio"
        )
        .orderBy("user_follows.created_at", "desc")
        .offset(offset)
        .limit(limit);

      const followings = await query;

      // Get total count for pagination info
      const totalQuery = UserFollow.query().where({ follower_id: user_id }).count("* as total");

      const totalResult = await totalQuery;
      const total = parseInt(totalResult[0].total);

      return {
        data: followings,
        pagination: {
          current_page: page,
          per_page: limit,
          total: total,
          total_pages: Math.ceil(total / limit),
          has_next: page < Math.ceil(total / limit),
          has_prev: page > 1,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  // Get user followers with pagination and user details
  static async findFollowersByFollowedIdWithPagination(user_id, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;

      const query = UserFollow.query()
        .where({ followed_id: user_id })
        .joinRelated("followerUser.profile")
        .select(
          "user_follows.follower_id",
          "user_follows.created_at as followed_at",
          "followerUser.id as user_id",
          "followerUser.first_name",
          "followerUser.last_name",
          "followerUser:profile.username",
          "followerUser:profile.avatar",
          "followerUser:profile.bio"
        )
        .orderBy("user_follows.created_at", "desc")
        .offset(offset)
        .limit(limit);

      const followers = await query;

      // Get total count for pagination info
      const totalQuery = UserFollow.query().where({ followed_id: user_id }).count("* as total");

      const totalResult = await totalQuery;
      const total = parseInt(totalResult[0].total);

      return {
        data: followers,
        pagination: {
          current_page: page,
          per_page: limit,
          total: total,
          total_pages: Math.ceil(total / limit),
          has_next: page < Math.ceil(total / limit),
          has_prev: page > 1,
        },
      };
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
