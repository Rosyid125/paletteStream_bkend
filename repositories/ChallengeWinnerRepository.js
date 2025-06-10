const ChallengeWinner = require("../models/ChallengeWinner");

class ChallengeWinnerRepository {
  // Find winners by challenge ID
  static async findByChallengeId(challengeId) {
    try {
      const winners = await ChallengeWinner.query().where("challenge_id", challengeId).withGraphFetched("[user.[profile], post.[images, tags]]").orderBy("rank", "asc");
      return winners;
    } catch (error) {
      throw error;
    }
  }

  // Find winner by ID
  static async findById(id) {
    try {
      const winner = await ChallengeWinner.query().findById(id).withGraphFetched("[challenge, user.[profile], post.[images, tags]]");
      return winner;
    } catch (error) {
      throw error;
    }
  }

  // Find winners by user ID
  static async findByUserId(userId) {
    try {
      const winners = await ChallengeWinner.query().where("user_id", userId).withGraphFetched("[challenge, post.[images, tags]]").orderBy("selected_at", "desc");
      return winners;
    } catch (error) {
      throw error;
    }
  }

  // Check if user is already a winner for a challenge
  static async findByUserAndChallenge(userId, challengeId) {
    try {
      const winner = await ChallengeWinner.query().where("user_id", userId).where("challenge_id", challengeId).first();
      return winner;
    } catch (error) {
      throw error;
    }
  } // Create new winner
  static async create(challengeId, userId, postId, rank, finalScore, adminNote) {
    try {
      console.log("🔍 ChallengeWinnerRepository.create called with:", {
        challengeId,
        userId,
        postId,
        rank,
        finalScore,
        adminNote,
      });

      const now = new Date().toISOString().slice(0, 19).replace("T", " ");
      const winner = await ChallengeWinner.query().insert({
        challenge_id: challengeId,
        user_id: userId,
        post_id: postId,
        rank: rank,
        final_score: finalScore || 0,
        admin_note: adminNote,
        created_at: now,
        updated_at: now,
        selected_at: now,
      });
      console.log("✅ Winner created successfully:", winner);
      return winner;
    } catch (error) {
      console.error("❌ Error creating winner:", error);
      throw error;
    }
  }

  // Delete all winners for a challenge
  static async deleteByChallengeId(challengeId) {
    try {
      const deletedCount = await ChallengeWinner.query().delete().where("challenge_id", challengeId);
      return deletedCount;
    } catch (error) {
      throw error;
    }
  }

  // Count winners by challenge ID
  static async countByChallengeId(challengeId) {
    try {
      const result = await ChallengeWinner.query().where("challenge_id", challengeId).count("id as count").first();
      return parseInt(result.count) || 0;
    } catch (error) {
      throw error;
    }
  }

  // Count total wins by user ID
  static async countByUserId(userId) {
    try {
      const result = await ChallengeWinner.query().where("user_id", userId).count("id as count").first();
      return parseInt(result.count) || 0;
    } catch (error) {
      throw error;
    }
  }

  // Get top winners (users with most wins)
  static async getTopWinners(limit = 10) {
    try {
      const winners = await ChallengeWinner.query().select("user_id").count("id as win_count").withGraphFetched("[user.[profile]]").groupBy("user_id").orderBy("win_count", "desc").limit(limit);
      return winners;
    } catch (error) {
      throw error;
    }
  }

  // Check if challenge has winners
  static async challengeHasWinners(challengeId) {
    try {
      const count = await this.countByChallengeId(challengeId);
      return count > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ChallengeWinnerRepository;
