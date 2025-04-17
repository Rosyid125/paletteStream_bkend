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

const UserFollowService = require("./UserFollowService");
const UserSocialLinkService = require("./UserSocialLinkService");

const customError = require("../errors/customError");

// Define the UserProfileService class
class UserProfileService {
  // Get user mini infos by user id
  static async findMiniInfosByUserId(userId) {
    try {
      // Get user profile by user id
      const user = await UserRepository.findById(userId);
      const userProfile = await UserProfileRepository.findByUserId(userId);
      const userExp = await UserExpRepository.findByUserId(userId);

      if (!user) {
        throw new customError("User not found");
      }

      return {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        username: userProfile.username,
        avatar: userProfile.avatar,
        exp: userExp.exp,
        level: userExp.level,
      };
    } catch (error) {
      throw error;
    }
  }

  // Static method to get user profile for a specific user for a user profile card on user profile page
  static async getUserProfile(currentUserId, userId) {
    try {
      // Get user profile by user id
      const user = await UserRepository.findById(userId);
      const userProfile = await UserProfileRepository.findByUserId(userId);
      const userExp = await UserExpRepository.findByUserId(userId);
      const userAchievements = await UserAchievementRepository.findByUserId(userId);
      const userBadges = await UserBadgeRepository.findByUserId(userId);
      const userPlatformLinks = await UserSocialLinkService.findAllByUserId(userId);
      const userFollowingsCount = await UserFollowRepository.countFollowingsByUserId(userId);
      const userFollowersCount = await UserFollowRepository.countFollowersByUserId(userId);
      const userPostCount = await UserPostRepository.countByUserId(userId);
      const userLikeCount = await PostLikeRepository.countByUserId(userId);
      const userCommentCount = await PostCommentRepository.countByUserId(userId);
      // const userChallangeCount = await UserChallangeService.countByUserId(userId);
      // const userChallangeWinCount = await UserChallangeService.countWinByUserId(userId);
      const userChallangeCount = 0; // Dummy data
      const userChallangeWinCount = 0; // Dummy data

      // get user follow status info
      const userFollowStatus = await UserFollowService.findByFollowerIdAndFollowedId(currentUserId, userId);

      // Return user profile
      if (!user) {
        throw new customError("User not found");
      }

      // Merge data to a one object
      return {
        id: user.id,
        username: userProfile.username,
        first_name: user.first_name,
        last_name: user.last_name,
        avatar: userProfile.avatar,
        bio: userProfile.bio,
        location: userProfile.location,
        platform_links: userPlatformLinks,
        achievements: userAchievements,
        badges: userBadges,
        exp: userExp.exp,
        level: userExp.level,
        followings: userFollowingsCount,
        followers: userFollowersCount,
        userFollowStatus: userFollowStatus ? true : false,
        posts: userPostCount,
        likes: userLikeCount,
        comments: userCommentCount,
        challanges: userChallangeCount,
        challangeWins: userChallangeWinCount,
      };
    } catch (error) {
      throw error;
    }
  }

  // Static method to create a default user profile
  static async createDefaultUserProfile(userId) {
    try {
      // Create a default user profile
      const userProfile = await UserProfileRepository.createDefault(userId);
      if (!userProfile) {
        throw new customError("User profile not found");
      }

      // Return default user profile
      return userProfile;
    } catch (error) {
      throw error;
    }
  }

  // Static method to update user profile
  static async updateUserProfile(userId, username, avatar, bio, location, platforms) {
    try {
      // Update user profile
      const userProfile = await UserProfileRepository.update(userId, username, avatar, bio, location);

      // Insert social links into the database
      const userSocialLinks = UserSocialLinkService.update(userId, platforms);

      if (!userProfile) {
        throw new customError("User profile not found");
      }

      // Return updated user profile with social links
    } catch (error) {
      throw error;
    }
  }
}

// Export the UserProfileService class
module.exports = UserProfileService;
