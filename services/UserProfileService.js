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
        current_treshold: userExp.current_treshold,
        next_treshold: userExp.next_treshold,
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
      const userPostCount = await UserPostRepository.countByUserId(userId);
      // Get user post like count
      const userLikeCount = await PostLikeRepository.countByUserId(userId);
      // Comming soon: Get user challange count, user challange win count, user achievements, user badges

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
        // score: score,
        // challanges: userChallangeCount,
        // challangeWins: userChallangeWinCount,
        // achievements: userAchievements,
        // badges: userBadges,
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
      // Get user profile by user id
      const userProfile = await UserProfileRepository.findByUserId(userId);
      if (!userProfile) {
        throw new customError("User profile not found");
      }

      // Return user profile
      return userProfile;
    } catch (error) {
      throw error;
    }
  }

  // Static method to update user profile
  static async updateUserProfile(userId, updateData) {
    // updateData = { name, bio, location, avatarPath, platforms }
    // 'platforms' sekarang kita anggap sebagai data untuk 'social links'

    // 1. Dapatkan profil user yang ada
    const userProfile = await UserProfileRepository.findByUserId(userId);
    if (!userProfile) {
      logger.warn(`UserProfileService: User profile not found for userId: ${userId}`);
      // Bisa throw error agar ditangkap controller dan dikembalikan sebagai 404
      throw new Error(`User profile not found for userId: ${userId}`);
      // Atau return null jika controller sudah menghandle null response
      // return null;
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
      try {
        await UserProfileRepository.update(userId, fieldsToUpdate); // Perlu method update(userId, data)
        logger.info(`User profile fields updated for user ${userId}`, { fields: Object.keys(fieldsToUpdate) });
        profileUpdateSuccess = true; // Tandai bahwa update DB profile berhasil
      } catch (updateError) {
        logger.error(`Error saving profile field updates for user ${userId}: ${updateError.message}`, { stack: updateError.stack });
        // Jika update field dasar gagal, kita hentikan prosesnya
        throw new Error(`Failed to save profile updates: ${updateError.message}`);
      }
    } else {
      // Tidak ada field dasar yang diubah, anggap "sukses" untuk melanjutkan ke social links/hapus file
      profileUpdateSuccess = true;
    }

    // --- 5. DELEGASIKAN Update Social Links ke Service terpisah ---
    // Cek jika 'platforms' (data social links) ada di request
    if (updateData.platforms !== undefined) {
      try {
        // Pastikan kita mengirim array yang bersih ke service social link
        const socialLinksData = Array.isArray(updateData.platforms)
          ? updateData.platforms // Asumsikan service social link bisa menangani sanitasi internal
          : []; // Kirim array kosong jika bukan array

        // Panggil service social link untuk menangani update
        // Kita tidak perlu lagi logika find/create/delete di sini
        await UserSocialLinkService.update(userId, socialLinksData); // Asumsi service ini menangani semuanya
        logger.info(`Social links update delegated to UserSocialLinkService for user ${userId}`);
      } catch (socialLinkError) {
        logger.error(`Error during social link update delegation for user ${userId}: ${socialLinkError.message}`, { stack: socialLinkError.stack });
        // Jika update social links gagal, mungkin kita ingin menganggap seluruh operasi gagal
        // Tergantung pada kebutuhan bisnis, apakah update profile harus atomik
        throw new Error(`Failed to update social links: ${socialLinkError.message}`);
      }
    }
    // ---------------------------------------------------------------

    // 6. Hapus file avatar LAMA jika:
    //    a) Ada avatar BARU yang disediakan (updateData.avatarPath !== undefined)
    //    b) Path avatar BARU BERBEDA dengan path avatar LAMA
    //    c) Update profile fields (jika ada) BERHASIL (profileUpdateSuccess === true)
    if (profileUpdateSuccess && updateData.avatarPath !== undefined && oldAvatarPath && oldAvatarPath !== updateData.avatarPath) {
      try {
        await deleteFile(oldAvatarPath); // Panggil fungsi utilitas penghapus file
        logger.info(`Old avatar file deleted successfully: ${oldAvatarPath} for user ${userId}`);
      } catch (deleteError) {
        // Gagal menghapus file lama seharusnya tidak menggagalkan response sukses utama
        // Cukup log sebagai warning atau error terpisah
        logger.warn(`Failed to delete old avatar file ${oldAvatarPath} for user ${userId}: ${deleteError.message}`);
      }
    }

    // 7. Ambil data profil TERBARU setelah semua update potensial
    // Gunakan metode yang mengambil profil beserta relasi (seperti social links)
    const finalUpdatedProfile = await UserProfileRepository.findWithDetails(userId); // Ganti nama metode jika perlu

    return finalUpdatedProfile; // Kembalikan profil yang sudah terupdate
  }
}

// Export the UserProfileService class
module.exports = UserProfileService;
