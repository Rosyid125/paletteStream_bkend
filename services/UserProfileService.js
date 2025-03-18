// Import all necessary repositories
const UserAchievementRepository = require("../repositories/UserAchievementRepository");
const UserBadgeRepository = require("../repositories/UserBadgeRepository");
const UserExpRepository = require("../repositories/UserExpRepository");
const UserRepository = require("../repositories/UserRepository");
const UserProfileRepository = require("../repositories/UserProfileRepository");
const UserFollowRepository = require("../repositories/UserFollowRepository");

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
      const userFollowings = await UserFollowRepository.countFollowingsByUserId(userId);
      const userFollowersCount = await UserFollowRepository.countFollowersByUserId(userId);

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
        followings: userFollowings,
        followers: userFollowersCount,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

// Export the UserProfileService class
module.exports = UserProfileService;
