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
      const userPlatformLinks = await UserSocialLinkService.findAllByUserId(userId);
      // Get user profile by user id
      const userProfile = await UserProfileRepository.findByUserId(userId);

      if (!userProfile) {
        throw new customError("User profile not found");
      }

      // Return editable user profile
      return {
        id: userProfile.id,
        username: userProfile.username,
        first_name: userProfile.first_name,
        last_name: userProfile.last_name,
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
      const userProfile = await UserProfileRepository.findByUserId(userId);
      if (!userProfile) {
        throw new customError("User profile not found", 404); // Ganti dengan error yang sesuai
      }

      // 2. Simpan path avatar lama SEBELUM diupdate (jika ada avatar baru)
      let oldAvatarPath = userProfile.avatar; // Asumsi field di DB adalah 'avatar'

      // 3. Siapkan data untuk update field dasar (name, bio, location, avatar)
      const fieldsToUpdate = {};
      if (updateData.name !== undefined) fieldsToUpdate.name = updateData.name;
      if (updateData.bio !== undefined) fieldsToUpdate.bio = updateData.bio;
      if (updateData.location !== undefined) fieldsToUpdate.location = updateData.location;
      if (updateData.avatarPath !== undefined) {
        // Hanya update jika path baru BERBEDA dari yang lama (opsional, mencegah update DB yg tidak perlu)
        // if (updateData.avatarPath !== oldAvatarPath) {
        fieldsToUpdate.avatar = updateData.avatarPath;
        // }
      }

      // 4. Lakukan update fields dasar & avatar di Database (JIKA ADA PERUBAHAN)
      let profileUpdateSuccess = false;
      if (Object.keys(fieldsToUpdate).length > 0) {
        await UserProfileRepository.update(userId, fieldsToUpdate); // Perlu method update(userId, data)
        profileUpdateSuccess = true; // Tandai bahwa update DB profile berhasil
      } else {
        // Tidak ada field dasar yang diubah, anggap "sukses" untuk melanjutkan ke social links/hapus file
        profileUpdateSuccess = true;
      }

      // --- 5. DELEGASIKAN Update Social Links ke Service terpisah ---
      // Cek jika 'platforms' (data social links) ada di request
      if (updateData.platforms !== undefined) {
        // Pastikan kita mengirim array yang bersih ke service social link
        const socialLinksData = Array.isArray(updateData.platforms)
          ? updateData.platforms // Asumsikan service social link bisa menangani sanitasi internal
          : []; // Kirim array kosong jika bukan array

        await UserSocialLinkService.update(userId, socialLinksData); // Asumsi service ini menangani semuanya
      }

      if (profileUpdateSuccess && updateData.avatarPath !== undefined && oldAvatarPath && oldAvatarPath !== updateData.avatarPath && oldAvatarPath !== "storage/avatars/noimage.png") {
        await deleteFile(oldAvatarPath); // Panggil fungsi utilitas penghapus file
      }

      // 6. Ambil data profile yang sudah diupdate dari DB (JIKA PERLU)
      const updatedProfile = await UserProfileRepository.findByUserId(userId); // Ambil data terbaru dari DB
      if (!updatedProfile) {
        throw new customError("User profile not found", 404); // Ganti dengan error yang sesuai
      }

      return updatedProfile; // Kembalikan data profile yang sudah diupdate
    } catch (error) {
      throw error;
    }
  }
}

// Export the UserProfileService class
module.exports = UserProfileService;
