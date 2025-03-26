// Import all necessary repositories
const UserAchievementRepository = require("../repositories/UserAchievementRepository");
const UserBadgeRepository = require("../repositories/UserBadgeRepository");
const UserExpRepository = require("../repositories/UserExpRepository");
const UserRepository = require("../repositories/UserRepository");
const UserProfileRepository = require("../repositories/UserProfileRepository");
const UserPostRepository = require("../repositories/UserPostRepository");
const UserFollowRepository = require("../repositories/UserFollowRepository");
const PostLikeRepository = require("../repositories/PostLikeRepository");
const PostCommentRepository = require("../repositories/PostCommentRepository");

// Define the UserProfileService class
class UserProfileService {
  // Static method to get user profile for a specific user for a user profile card on user profile page
  static async getUserProfile(userId) {
    // Get user profile by user id
    const userProfile = await UserProfileRepository.findByUserId(userId);
    const user = await UserRepository.findById(userId);
    const userAchievements = await UserAchievementRepository.findByUserId(userId);
    const userBadges = await UserBadgeRepository.findByUserId(userId);
    const userExp = await UserExpRepository.findByUserId(userId);
    // const userPlatformLinks = await UserProfileRepository.findPlatformLinksByUserId(userId);
    const userFollowingsCount = await UserFollowRepository.countFollowingsByUserId(userId);
    const userFollowersCount = await UserFollowRepository.countFollowersByUserId(userId);
    const userPostCount = await UserPostRepository.countByUserId(userId);
    const userLikeCount = await PostLikeRepository.countByUserId(userId);
    const userCommentCount = await PostCommentRepository.countByUserId(userId);
    // const userChallangeCount = await UserChallangeService.countByUserId(userId);
    // const userChallangeWinCount = await UserChallangeService.countWinByUserId(userId);
    const userChallangeCount = 0; // Dummy data
    const userChallangeWinCount = 0; // Dummy data

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
      posts: userPostCount,
      likes: userLikeCount,
      comments: userCommentCount,
      challanges: userChallangeCount,
      challangeWins: userChallangeWinCount,
    };
  }

  // Static method to create a default user profile
  static async createDefaultUserProfile(userId) {
    // Create a default user profile
    const userProfile = await UserProfileRepository.createDefault(userId);
    if (!userProfile) {
      throw new Error("User profile not found");
    }

    // Return default user profile
    return userProfile;
  }

  // Static method to update user profile
  static async updateUserProfile(userId, username, avatar, bio, location) {
    // Update user profile
    const userProfile = await UserProfileRepository.update(userId, username, avatar, bio, location);
    if (!userProfile) {
      throw new Error("User profile not found");
    }

    // Return updated user profile
    return userProfile;
  }
}

// Export the UserProfileService class
module.exports = UserProfileService;
