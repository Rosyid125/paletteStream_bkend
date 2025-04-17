const UserRepository = require("../repositories/UserRepository");

const UserFollowService = require("./UserFollowService");
const UserProfileService = require("./UserProfileService");

class UserService {
  // For now it's also for user recommendation because we don't have any other way to get user recommendation (disini masih ada bug dimana kalau fetch user yang tidak punya profile ata exp tidak bisa (error))
  static async getAllUsers(currentUserId, page, limit) {
    try {
      const offset = (page - 1) * limit;

      const userIds = await UserRepository.findAllUserIds(offset, limit);

      // Get all users mini infos by user ids
      const users = await Promise.all(
        userIds.map(async (userId) => {
          const user = await UserProfileService.findMiniInfosByUserId(userId);
          return user;
        })
      );

      // Getting all user follow status by current user id and followed user ids
      const userFollowStatus = await Promise.all(
        users.map(async (user) => {
          const userFollowStatus = await UserFollowService.findByFollowerIdAndFollowedId(currentUserId, user.id);
          return userFollowStatus;
        })
      );

      return users.map((user, index) => {
        return {
          ...user,
          follow_status: userFollowStatus[index] !== undefined, // Returns true if userFollow exists, false if undefined
        };
      });
    } catch (error) {
      throw error;
    }
  }

  // Get user by recommendation (followed by followed users) (disini masih ada bug dimana kalau fetch user yang tidak punya profile ata exp tidak bisa (error)), masih belum paginate juga
  static async getRecommendedUsers(currentUserId) {
    try {
      // Get all followed users by current userid
      const followedUsersIds = await UserFollowService.findByFollowerId(currentUserId);

      const followedUsersIds2 = (
        await Promise.all(
          followedUsersIds.flat().map(async (user) => {
            return await UserFollowService.findByFollowerId(user.followed_id);
          })
        )
      ).flat();

      const usersWithInfos = await Promise.all(
        followedUsersIds2.map(async (user) => {
          try {
            const info = await UserProfileService.findMiniInfosByUserId(user.followed_id);
            return info ? { ...info, followed_id: user.followed_id } : null;
          } catch {
            return null;
          }
        })
      );

      const filteredUsers = usersWithInfos.filter((u) => u !== null);

      const userFollowStatus = await Promise.all(
        filteredUsers.map(async (user) => {
          return await UserFollowService.findByFollowerIdAndFollowedId(currentUserId, user.followed_id);
        })
      );

      return filteredUsers.map((user, index) => {
        return {
          ...user,
          follow_status: userFollowStatus[index] !== undefined,
        };
      });
    } catch (error) {
      throw error;
    }
  }

  static async deleteUser(id) {
    try {
      return await UserRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }

  static async banUser(id) {
    try {
      return await UserRepository.ban(id);
    } catch (error) {
      throw error;
    }
  }

  static async unBanUser(id) {
    try {
      return await UserRepository.unBan(id);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserService;
