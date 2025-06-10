const UserBadgeRepository = require("../repositories/UserBadgeRepository");
const ChallengeRepository = require("../repositories/ChallengeRepository");
const ChallengePostRepository = require("../repositories/ChallengePostRepository");
const customError = require("../errors/customError");

class BadgeService {
  // Get all user badges
  static async getAllUserBadges(userId) {
    try {
      const badges = await UserBadgeRepository.findByUserId(userId);
      return badges;
    } catch (error) {
      throw error;
    }
  }

  // Get badge by ID
  static async getBadgeById(id) {
    try {
      const badge = await UserBadgeRepository.findById(id);
      if (!badge) {
        throw new customError("Badge not found", 404);
      }
      return badge;
    } catch (error) {
      throw error;
    }
  }

  // Award badge to user (Admin only)
  static async awardBadge(userId, challengeId, badgeImg, adminNote) {
    try {
      // Check if challenge exists
      const challenge = await ChallengeRepository.findById(challengeId);
      if (!challenge) {
        throw new customError("Challenge not found", 404);
      }

      // Check if user participated in challenge
      const userSubmission = await ChallengePostRepository.findByUserAndChallenge(userId, challengeId);
      if (!userSubmission) {
        throw new customError("User did not participate in this challenge", 400);
      }

      // Check if user already has badge for this challenge
      const existingBadge = await UserBadgeRepository.findByUserAndChallenge(userId, challengeId);
      if (existingBadge) {
        throw new customError("User already has badge for this challenge", 400);
      }

      const badge = await UserBadgeRepository.create(userId, challengeId, badgeImg, adminNote);
      return badge;
    } catch (error) {
      throw error;
    }
  }

  // Award badges to multiple winners
  static async awardBadgesToWinners(challengeId, winners, badgeImg, adminNote) {
    try {
      const challenge = await ChallengeRepository.findById(challengeId);
      if (!challenge) {
        throw new customError("Challenge not found", 404);
      }

      const awardedBadges = [];
      const errors = [];

      for (const winner of winners) {
        try {
          const badge = await this.awardBadge(winner.userId, challengeId, badgeImg, adminNote);
          awardedBadges.push(badge);
        } catch (error) {
          errors.push({ userId: winner.userId, error: error.message });
        }
      }

      return {
        success: true,
        awardedBadges,
        errors,
      };
    } catch (error) {
      throw error;
    }
  }

  // Select winners and award badges
  static async selectWinnersAndAwardBadges(challengeId, winnerUserIds, adminNote) {
    try {
      const challenge = await ChallengeRepository.findById(challengeId);
      if (!challenge) {
        throw new customError("Challenge not found", 404);
      }

      if (!challenge.is_closed) {
        throw new customError("Challenge must be closed before selecting winners", 400);
      }

      const awardedBadges = [];
      const errors = [];

      for (const userId of winnerUserIds) {
        try {
          const badge = await this.awardBadge(userId, challengeId, challenge.badge_img, adminNote);
          awardedBadges.push(badge);
        } catch (error) {
          errors.push({ userId, error: error.message });
        }
      }

      return {
        success: true,
        message: `Awarded badges to ${awardedBadges.length} winners`,
        awardedBadges,
        errors,
      };
    } catch (error) {
      throw error;
    }
  }

  // Get challenge winners (users with badges)
  static async getChallengeWinners(challengeId) {
    try {
      const winners = await UserBadgeRepository.findByChallengeId(challengeId);
      return winners;
    } catch (error) {
      throw error;
    }
  }

  // Update badge note
  static async updateBadgeNote(badgeId, adminNote) {
    try {
      const badge = await UserBadgeRepository.findById(badgeId);
      if (!badge) {
        throw new customError("Badge not found", 404);
      }

      const updatedBadge = await UserBadgeRepository.update(badgeId, { admin_note: adminNote });
      return updatedBadge;
    } catch (error) {
      throw error;
    }
  }

  // Remove badge from user
  static async removeBadge(badgeId) {
    try {
      const badge = await UserBadgeRepository.findById(badgeId);
      if (!badge) {
        throw new customError("Badge not found", 404);
      }

      const deleted = await UserBadgeRepository.delete(badgeId);
      if (!deleted) {
        throw new customError("Failed to remove badge", 500);
      }

      return { success: true, message: "Badge removed successfully" };
    } catch (error) {
      throw error;
    }
  }

  // Get user badge count
  static async getUserBadgeCount(userId) {
    try {
      const count = await UserBadgeRepository.countByUserId(userId);
      return count;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = BadgeService;
