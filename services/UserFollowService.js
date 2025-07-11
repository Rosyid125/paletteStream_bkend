const UserFollowRepository = require("../repositories/UserFollowRepository");
const customError = require("../errors/customError");
const { gamificationEmitter } = require("../emitters/gamificationEmitter");
const NotificationService = require("./NotificationService");

class UserFollowService {
  // Get all user followers by user id
  static async findByFollowedId(userId) {
    try {
      return await UserFollowRepository.findByFollowedId(userId);
    } catch (error) {
      throw error;
    }
  }

  // Get all user followings by user id
  static async findByFollowerId(userId) {
    try {
      return await UserFollowRepository.findByFollowerId(userId);
    } catch (error) {
      throw error;
    }
  }

  // Get user followings with pagination
  static async getFollowingsWithPagination(userId, page = 1, limit = 10) {
    try {
      // Validate pagination parameters
      const pageNum = Math.max(1, parseInt(page) || 1);
      const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 10)); // Max 50 items per page

      return await UserFollowRepository.findFollowingsByFollowerIdWithPagination(userId, pageNum, limitNum);
    } catch (error) {
      throw error;
    }
  }

  // Get user followers with pagination
  static async getFollowersWithPagination(userId, page = 1, limit = 10) {
    try {
      // Validate pagination parameters
      const pageNum = Math.max(1, parseInt(page) || 1);
      const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 10)); // Max 50 items per page

      return await UserFollowRepository.findFollowersByFollowedIdWithPagination(userId, pageNum, limitNum);
    } catch (error) {
      throw error;
    }
  }

  // Get user follow status by follower id and followed id
  static async findByFollowerIdAndFollowedId(follower_id, followed_id) {
    try {
      const userFollow = await UserFollowRepository.findByFollowerIdAndFollowedId(follower_id, followed_id);
      return userFollow;
    } catch (error) {
      throw error;
    }
  }

  // Get user follow status by follower id and followed ids
  static async findByFollowerIdAndFollowedIds(follower_id, followed_ids) {
    try {
      const userFollows = await UserFollowRepository.findByFollowerIdAndFollowedIds(follower_id, followed_ids);

      return userFollows;
    } catch (error) {
      throw error;
    }
  }

  // Create and delete a user follow
  static async createDelete(follower_id, followed_id) {
    try {
      // Check if user follow already exists
      const existingFollow = await UserFollowRepository.findByFollowerIdAndFollowedId(follower_id, followed_id);

      if (existingFollow) {
        // If it exists, delete the follow
        await UserFollowRepository.delete(follower_id, followed_id);

        // Emit the gamification event for unfollow
        gamificationEmitter.emit("userUnfollowed", follower_id);

        // Emit the gamification event for user got unfollowed
        gamificationEmitter.emit("userGotUnfollowed", followed_id);

        return { message: "User follow deleted" };
      }

      // Create a new user follow
      const userFollow = await UserFollowRepository.create(follower_id, followed_id);

      // Check if user follow was created successfully
      if (!userFollow) {
        throw new customError("User follow not found");
      } else {
        // Emit the gamification event for follow
        gamificationEmitter.emit("userFollowed", follower_id);

        // Emit the gamification event for user got followed
        gamificationEmitter.emit("userGotFollowed", followed_id);

        // Send follow notification
        try {
          // Get follower's username for notification
          const UserProfileService = require("./UserProfileService");
          const followerProfile = await UserProfileService.findMiniInfosByUserId(follower_id);

          await NotificationService.notifyUserFollowed(followed_id, follower_id, followerProfile?.username || "Someone");
        } catch (notificationError) {
          console.error("Failed to send follow notification:", notificationError);
        }

        // If it was created successfully, return the user follow
        const userFollowData = {
          id: userFollow.id,
          follower_id: userFollow.follower_id,
          followed_id: userFollow.followed_id,
          created_at: userFollow.created_at,
          updated_at: userFollow.updated_at,
        };

        // Return success message with user follow data
        return { message: "User follow created", data: userFollowData };
      }
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserFollowService;
