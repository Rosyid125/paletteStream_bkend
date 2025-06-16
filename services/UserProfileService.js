// Import all necessary repositories
const UserAchievementRepository = require("../repositories/UserAchievementRepository");
const UserBadgeRepository = require("../repositories/UserBadgeRepository");
const ChallengePostService = require("./ChallengePostService");
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
const deleteFile = require("../utils/deleteFileUtils");
const { deleteImage, extractPublicId, isCloudinaryUrl } = require("../utils/cloudinaryUtil");

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

      // Get challenge participation and wins count
      const userChallengeSubmissions = await ChallengePostService.findByUserId(userId);
      const userChallengeCount = userChallengeSubmissions.length;
      const userChallengeWinCount = await UserBadgeRepository.countByUserId(userId);

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
        current_treshold: userExp.current_treshold,
        next_treshold: userExp.next_treshold,
        followings: userFollowingsCount,
        followers: userFollowersCount,
        userFollowStatus: userFollowStatus ? true : false,
        posts: userPostCount,
        likes: userLikeCount,
        comments: userCommentCount,
        challanges: userChallengeCount,
        challangeWins: userChallengeWinCount,
      };
    } catch (error) {
      throw error;
    }
  }

  // Spesific method to get user profile for top artist leaderboard page
  static async getUserProfileForTopUser(userId, score) {
    try {
      // Get user profile by user id
      const user = await UserRepository.findById(userId);
      const userProfile = await UserProfileRepository.findByUserId(userId);
      const userExp = await UserExpRepository.findByUserId(userId);
      // Get followers count
      const userFollowersCount = await UserFollowRepository.countFollowersByUserId(userId);
      // Get user post count
      const userPostCount = await UserPostRepository.countByUserId(userId); // Get user post like count
      const userLikeCount = await PostLikeRepository.countByUserId(userId); // Get challenge participation and wins count
      const userChallengeSubmissions = await ChallengePostService.findByUserId(userId);
      const userChallengeCount = userChallengeSubmissions.length;
      const userChallengeWinCount = await UserBadgeRepository.countByUserId(userId);
      const userAchievementsCount = await UserAchievementRepository.findByUserId(userId);
      const userBadgesCount = await UserBadgeRepository.findByUserId(userId);

      if (!user) {
        throw new customError("User not found");
      }

      return {
        // id: user.id,
        username: userProfile.username,
        avatar: userProfile.avatar,
        exp: userExp.exp,
        level: userExp.level,
        followers: userFollowersCount,
        posts: userPostCount,
        likes: userLikeCount,
        score: score,
        challanges: userChallengeCount,
        challangeWins: userChallengeWinCount,
        achievements: userAchievementsCount.length,
        badges: userBadgesCount.length,
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
  // Static method to get a user profile by user id
  static async getUserProfileById(userId) {
    try {
      // Get user data from users table
      const user = await UserRepository.findById(userId);
      if (!user) {
        throw new customError("User not found");
      }

      // Get user profile data from user_profiles table
      const userProfile = await UserProfileRepository.findByUserId(userId);
      if (!userProfile) {
        throw new customError("User profile not found");
      }

      // Get platform links
      const userPlatformLinks = await UserSocialLinkService.findAllByUserId(userId);

      // Return complete editable user profile data
      return {
        id: userProfile.id,
        user_id: userProfile.user_id,
        username: userProfile.username,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email, // untuk display saja, tidak boleh diedit
        avatar: userProfile.avatar,
        bio: userProfile.bio,
        location: userProfile.location,
        platform_links: userPlatformLinks,
      };
    } catch (error) {
      throw error;
    }
  }
  // Static method to update user profile
  static async updateUserProfile(userId, updateData) {
    try {
      // 1. Ambil data user dan profile yang ada
      const user = await UserRepository.findById(userId);
      const userProfile = await UserProfileRepository.findByUserId(userId);

      if (!user || !userProfile) {
        throw new customError("User or user profile not found", 404);
      }

      // 2. Simpan path avatar lama SEBELUM diupdate (jika ada avatar baru)
      let oldAvatarPath = userProfile.avatar;

      // 3. Persiapkan data untuk update tabel USERS (first_name, last_name)
      const userFieldsToUpdate = {};
      if (updateData.first_name !== undefined) userFieldsToUpdate.first_name = updateData.first_name;
      if (updateData.last_name !== undefined) userFieldsToUpdate.last_name = updateData.last_name;      // 4. Persiapkan data untuk update tabel USER_PROFILES (username, bio, location, avatar)
      const profileFieldsToUpdate = {};
      if (updateData.username !== undefined) profileFieldsToUpdate.username = updateData.username;
      if (updateData.bio !== undefined) profileFieldsToUpdate.bio = updateData.bio;
      if (updateData.location !== undefined) profileFieldsToUpdate.location = updateData.location;
      if (updateData.avatarUrl !== undefined) {
        profileFieldsToUpdate.avatar = updateData.avatarUrl;
      }

      // 5. Lakukan update ke tabel USERS (JIKA ADA PERUBAHAN)
      let userUpdateSuccess = false;
      if (Object.keys(userFieldsToUpdate).length > 0) {
        await UserRepository.update(userId, userFieldsToUpdate);
        userUpdateSuccess = true;
      } else {
        userUpdateSuccess = true; // Tidak ada yang diubah, anggap sukses
      }

      // 6. Lakukan update ke tabel USER_PROFILES (JIKA ADA PERUBAHAN)
      let profileUpdateSuccess = false;
      if (Object.keys(profileFieldsToUpdate).length > 0) {
        await UserProfileRepository.update(userId, profileFieldsToUpdate);
        profileUpdateSuccess = true;
      } else {
        profileUpdateSuccess = true; // Tidak ada yang diubah, anggap sukses
      }

      // 7. Update Social Links (JIKA ADA)
      if (updateData.platforms !== undefined) {
        const socialLinksData = Array.isArray(updateData.platforms) ? updateData.platforms : [];

        await UserSocialLinkService.update(userId, socialLinksData);
      }      // 8. Hapus avatar lama jika ada avatar baru dan berbeda
      if (userUpdateSuccess && profileUpdateSuccess && updateData.avatarUrl !== undefined && oldAvatarPath && oldAvatarPath !== updateData.avatarUrl) {
        // Tidak hapus avatar default
        if (oldAvatarPath !== "storage/avatars/noimage.png" && oldAvatarPath !== process.env.DEFAULT_USER_AVATAR) {
          if (isCloudinaryUrl(oldAvatarPath)) {
            try {
              const publicId = extractPublicId(oldAvatarPath);
              if (publicId) {
                await deleteImage(publicId);
                console.log(`Deleted old avatar from Cloudinary: ${publicId}`);
              }
            } catch (error) {
              console.error(`Failed to delete old avatar from Cloudinary: ${oldAvatarPath}`, error);
              // Continue with other operations even if avatar deletion fails
            }
          } else {
            // For backward compatibility, handle local storage files
            await deleteFile(oldAvatarPath);
          }
        }
      }

      // 9. Ambil data profile yang sudah diupdate dari DB
      const updatedProfile = await UserProfileRepository.findByUserId(userId);
      if (!updatedProfile) {
        throw new customError("Updated user profile not found", 404);
      }

      return updatedProfile;
    } catch (error) {
      throw error;
    }
  }
}

// Export the UserProfileService class
module.exports = UserProfileService;
