const UserFollowRepository = require("../repositories/UserFollowRepository");

// For error handling
const currentService = "UserFollowService";

class UserFollowService {
  // Get all user followers by user id
  static async findByFollowedId(userId) {
    try {
      return await UserFollowRepository.findByFollowedId(userId);
    } catch (error) {
      throw new Error(`${currentService} Error: ${error.message}`);
    }
  }

  // Get all user followings by user id
  static async findByFollowerId(userId) {
    try {
      return await UserFollowRepository.findByFollowerId(userId);
    } catch (error) {
      throw new Error(`${currentService} Error: ${error.message}`);
    }
  }

  // Get user follow status by follower id and followed id
  static async findByFollowerIdAndFollowedId(follower_id, followed_id) {
    console.log("follower_id", follower_id, "followed_id", followed_id);
    try {
      const userFollow = await UserFollowRepository.findByFollowerIdAndFollowedId(follower_id, followed_id);

      return userFollow;
    } catch (error) {
      throw new Error(`${currentService} Error: ${error.message}`);
    }
  }

  // Get user follow status by follower id and followed ids
  static async findByFollowerIdAndFollowedIds(follower_id, followed_ids) {
    try {
      const userFollows = await UserFollowRepository.findByFollowerIdAndFollowedIds(follower_id, followed_ids);

      return userFollows;
    } catch (error) {
      throw new Error(`${currentService} Error: ${error.message}`);
    }
  }

  // Create a new user follow
  static async create(follower_id, followed_id) {
    try {
      // Create a new user follow

      const userFollow = await UserFollowRepository.create(follower_id, followed_id);
      if (!userFollow) {
        throw new Error(`${currentService} Error: User follow not found`);
      }
      // Return user follow
      return userFollow;
    } catch (error) {
      throw new Error(`${currentService} Error: ${error.message}`);
    }
  }

  // Delete a user follow
  static async delete(follower_id, followed_id) {
    try {
      // Delete a user follow
      const userFollow = await UserFollowRepository.delete(follower_id, followed_id);
      if (!userFollow) {
        throw new Error(`${currentService} Error: User follow not found`);
      }

      // Return deleted user follow
      return userFollow;
    } catch (error) {
      throw new Error(`${currentService} Error: ${error.message}`);
    }
  }
}

module.exports = UserFollowService;
