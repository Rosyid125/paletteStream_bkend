const UserBadge = require("../models/UserBadge");

class UserBadgeRepository {
  // Get all user badges
  static async findAll() {
    try {
      const userBadges = await UserBadge.query().withGraphFetched("[user.[profile], challenge]");
      return userBadges;
    } catch (error) {
      throw error;
    }
  }
  // Get user badges by user ID
  static async findByUserId(userId) {
    try {
      const userBadges = await UserBadge.query().where("user_id", userId).withGraphFetched("[challenge]").orderBy("awarded_at", "desc");
      return userBadges;
    } catch (error) {
      throw error;
    }
  }

  // Get user badges by user ID with rank information from challenge_winners
  static async findByUserIdWithRank(userId) {
    try {
      const userBadges = await UserBadge.query()
        .select("user_badges.*", "challenge_winners.rank")
        .where("user_badges.user_id", userId)
        .leftJoin("challenge_winners", function () {
          this.on("user_badges.user_id", "=", "challenge_winners.user_id").andOn("user_badges.challenge_id", "=", "challenge_winners.challenge_id");
        })
        .withGraphFetched("[challenge]")
        .orderBy("awarded_at", "desc");
      return userBadges;
    } catch (error) {
      throw error;
    }
  }

  // Get user badges by challenge ID
  static async findByChallengeId(challengeId) {
    try {
      const userBadges = await UserBadge.query().where("challenge_id", challengeId).withGraphFetched("[user.[profile]]").orderBy("awarded_at", "desc");
      return userBadges;
    } catch (error) {
      throw error;
    }
  }

  // Get user badge by ID
  static async findById(id) {
    try {
      const userBadge = await UserBadge.query().findById(id).withGraphFetched("[user.[profile], challenge]");
      return userBadge;
    } catch (error) {
      throw error;
    }
  }

  // Check if user already has badge for challenge
  static async findByUserAndChallenge(userId, challengeId) {
    try {
      const userBadge = await UserBadge.query().findOne({ user_id: userId, challenge_id: challengeId }).withGraphFetched("[challenge]");
      return userBadge;
    } catch (error) {
      throw error;
    }
  }

  // Create user badge (award badge)
  static async create(userId, challengeId, badgeImg, adminNote) {
    try {
      const userBadge = await UserBadge.query().insert({
        user_id: userId,
        challenge_id: challengeId,
        badge_img: badgeImg,
        admin_note: adminNote,
      });
      return userBadge;
    } catch (error) {
      throw error;
    }
  }

  // Update user badge
  static async update(id, updateData) {
    try {
      const userBadge = await UserBadge.query().findById(id).patch(updateData);
      return userBadge;
    } catch (error) {
      throw error;
    }
  }

  // Delete user badge
  static async delete(id) {
    try {
      const deletedCount = await UserBadge.query().deleteById(id);
      return deletedCount > 0;
    } catch (error) {
      throw error;
    }
  }

  // Delete by user and challenge
  static async deleteByUserAndChallenge(userId, challengeId) {
    try {
      const deletedCount = await UserBadge.query().delete().where({ user_id: userId, challenge_id: challengeId });
      return deletedCount > 0;
    } catch (error) {
      throw error;
    }
  }

  // Count badges for user
  static async countByUserId(userId) {
    try {
      const count = await UserBadge.query().where("user_id", userId).count("id as count").first();
      return count ? parseInt(count.count) : 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserBadgeRepository;
