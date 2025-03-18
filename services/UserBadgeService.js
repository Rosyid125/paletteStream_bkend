const UserBadgeRepository = require("../repositories/UserBadgeRepository");
const BadgeRepository = require("../repositories/BadgeRepository");

class UserBadgeService {
  // Static method to get user badges
  static async getUserBadges(userId) {
    try {
      // Get user badges by user id
      const userBadges = await UserBadgeRepository.findByUserId(userId);

      if (!userBadges) {
        throw new Error("User badges not found");
      }

      // Get badges info by badge id
      const badges = userBadges.map((userBadge) => userBadge.badge_id);
      badges = await BadgeRepository.findByIds(badges);

      const userBadgesData = userBadges.map((userBadge) => {
        const badge = badges.find((badge) => badge.id === userBadge.badge_id);

        return {
          id: userBadge.id,
          title: badge.title,
          icon: badge.icon,
          description: badge.description,
          created_at: userBadge.created_at,
        };
      });

      return userBadgesData;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Static method to add a badge to a user
  static async addUserBadge(userId, badgeId) {
    try {
      const userBadge = await UserBadgeRepository.create(userId, badgeId);
      if (!userBadge) {
        throw new Error("User badge not found");
      }

      return userBadge;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Static method to create a new badge
  static async createBadge(title, icon, description) {
    try {
      // Create a new badge
      const badge = await BadgeRepository.create(title, icon, description);

      return badge;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Static method to update badge
  static async updateBadge(badgeId, title, icon, description) {
    try {
      const badge = await BadgeRepository.update(badgeId, title, icon, description);
      if (!badge) {
        throw new Error("Badge not found");
      }

      return badge;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Static method to delete badge
  static async deleteBadge(badgeId) {
    try {
      const badge = await BadgeRepository.delete(badgeId);
      if (!badge) {
        throw new Error("Badge not found");
      }

      return badge;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = UserBadgeService;
