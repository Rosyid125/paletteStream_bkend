const UserFollowRepository = require("../repositories/UserFollowRepository");

class UserFollowService {
  // Get all user followers by user id
  static async findByFollowedId(userId) {
    return UserFollowRepository.findByFollowedId(userId);
  }

  // Get all user followings by user id
  static async findByFollowerId(userId) {
    return UserFollowRepository.findByFollowerId(userId);
  }

  // Create a new user follow
  static async create(follower_id, followed_id) {
    // Create a new user follow

    const userFollow = await UserFollowRepository.create(follower_id, followed_id);
    if (!userFollow) {
      throw new Error("User follow not found");
    }
    // Return user follow
    return userFollow;
  }

  // Delete a user follow
  static async delete(follower_id, followed_id) {
    // Delete a user follow
    const userFollow = await UserFollowRepository.delete(follower_id, followed_id);
    if (!userFollow) {
      throw new Error("User follow not found");
    }

    // Return deleted user follow
    return userFollow;
  }

  // Count user followings by user id
  static async countFollowingsByUserId(follower_id) {
    return UserFollowRepository.countFollowingsByUserId(follower_id);
  }

  // Count followers by user id
  static async countFollowersByUserId(followed_id) {
    return UserFollowRepository.countFollowersByUserId(followed_id);
  }
}

module.exports = UserFollowService;
