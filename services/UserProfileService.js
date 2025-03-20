// Import all necessary repositories
const UserAchievementRepository = require("../repositories/UserAchievementRepository");
const UserBadgeRepository = require("../repositories/UserBadgeRepository");
const UserExpRepository = require("../repositories/UserExpRepository");
const UserRepository = require("../repositories/UserRepository");
const UserProfileRepository = require("../repositories/UserProfileRepository");

// Import from another service
const UserFollowService = require("./UserFollowService");

// Define the UserProfileService class
class UserProfileService {
  // Static method to get user profile for a specific user for a user profile card on user profile page
  static async getUserProfile(userId) {
    try {
      // Get user profile by user id
      const userProfile = await UserProfileRepository.findByUserId(userId);
      const user = await UserRepository.findById(userId);
      const userAchievements = await UserAchievementRepository.findByUserId(userId);
      const userBadges = await UserBadgeRepository.findByUserId(userId);
      const userExp = await UserExpRepository.findByUserId(userId);
      const userFollowingsCount = await UserFollowService.countFollowingsByUserId(userId);
      const userFollowersCount = await UserFollowService.countFollowersByUserId(userId);

      // Return user profile
      if (!user) {
        throw new Error("User not found");
      }

      // Merge data to a one object
      return {
        id: user.id,
        username: userProfile.username,
        avatar: userProfile.avatar,
        bio: userProfile.bio,
        location: userProfile.location,
        achievements: userAchievements,
        badges: userBadges,
        exp: userExp.exp,
        level: userExp.level,
        followings: userFollowingsCount,
        followers: userFollowersCount,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Static method to create a default user profile
  static async createDefaultUserProfile(userId) {
    try {
      // Create a default user profile
      const userProfile = await UserProfileRepository.createDefault(userId);
      if (!userProfile) {
        throw new Error("User profile not found");
      }

      // Return default user profile
      return userProfile;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Static method to update user profile
  static async updateUserProfile(userId, username, avatar, bio, location) {
    try {
      // Update user profile
      const userProfile = await UserProfileRepository.update(userId, username, avatar, bio, location);
      if (!userProfile) {
        throw new Error("User profile not found");
      }

      // Return updated user profile
      return userProfile;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

// Export the UserProfileService class
module.exports = UserProfileService;
