const ChallengeWinnerRepository = require("../repositories/ChallengeWinnerRepository");
const ChallengeRepository = require("../repositories/ChallengeRepository");
const ChallengePostRepository = require("../repositories/ChallengePostRepository");
const PostLikeRepository = require("../repositories/PostLikeRepository");
const UserService = require("./UserService");
const BadgeService = require("./BadgeService");
const customError = require("../errors/customError");

class ChallengeWinnerService {
  // Select winners for a challenge
  static async selectWinners(challengeId, winnersData, adminNote = null) {
    try {
      // Validate challenge exists and is closed
      const challenge = await ChallengeRepository.findById(challengeId);
      if (!challenge) {
        throw new customError("Challenge not found", 404);
      }

      if (!challenge.is_closed) {
        throw new customError("Challenge must be closed before selecting winners", 400);
      }

      // Check if winners already selected
      const existingWinners = await ChallengeWinnerRepository.findByChallengeId(challengeId);
      if (existingWinners.length > 0) {
        throw new customError("Winners have already been selected for this challenge", 400);
      }

      // Validate winnersData format: [{ userId, postId, rank }, ...]
      if (!Array.isArray(winnersData) || winnersData.length === 0) {
        throw new customError("Winners data must be a non-empty array", 400);
      }

      const createdWinners = [];
      const errors = [];

      // Sort by rank to ensure proper order
      const sortedWinners = winnersData.sort((a, b) => a.rank - b.rank);

      for (const winnerData of sortedWinners) {
        try {
          const { userId, postId, rank } = winnerData;

          // Validate required fields
          if (!userId || !postId || !rank) {
            throw new customError("userId, postId, and rank are required for each winner", 400);
          }

          // Check if user participated in the challenge
          const userSubmission = await ChallengePostRepository.findByUserAndChallenge(userId, challengeId);
          if (!userSubmission) {
            throw new customError(`User ${userId} did not participate in this challenge`, 400);
          }

          // Check if the post belongs to the challenge
          const challengePost = await ChallengePostRepository.findByPostAndChallenge(postId, challengeId);
          if (!challengePost || challengePost.user_id !== userId) {
            throw new customError(`Post ${postId} does not belong to user ${userId} in this challenge`, 400);
          }

          // Get final score (like count) for the post
          const likeCount = await PostLikeRepository.countByPostId(postId);
          const finalScore = parseInt(likeCount) || 0;

          // Create winner entry
          const winner = await ChallengeWinnerRepository.create(challengeId, userId, postId, rank, finalScore, adminNote);

          // Award badge to winner
          try {
            await BadgeService.awardBadge(userId, challengeId, challenge.badge_img, `Winner - Rank ${rank}`);
          } catch (badgeError) {
            console.log(`Badge award failed for user ${userId}:`, badgeError.message);
          }

          createdWinners.push(winner);
        } catch (error) {
          errors.push({
            userId: winnerData.userId,
            postId: winnerData.postId,
            rank: winnerData.rank,
            error: error.message,
          });
        }
      }

      return {
        success: true,
        message: `Selected ${createdWinners.length} winners for challenge`,
        winners: createdWinners,
        errors: errors.length > 0 ? errors : null,
      };
    } catch (error) {
      throw error;
    }
  }

  // Get winners for a challenge
  static async getChallengeWinners(challengeId) {
    try {
      const challenge = await ChallengeRepository.findById(challengeId);
      if (!challenge) {
        throw new customError("Challenge not found", 404);
      }

      const winners = await ChallengeWinnerRepository.findByChallengeId(challengeId);
      return winners;
    } catch (error) {
      throw error;
    }
  }

  // Get all wins for a user
  static async getUserWins(userId) {
    try {
      const wins = await ChallengeWinnerRepository.findByUserId(userId);
      return wins;
    } catch (error) {
      throw error;
    }
  }

  // Get winner details by ID
  static async getWinnerById(winnerId) {
    try {
      const winner = await ChallengeWinnerRepository.findById(winnerId);
      if (!winner) {
        throw new customError("Winner not found", 404);
      }
      return winner;
    } catch (error) {
      throw error;
    }
  }
  // Get user win count
  static async getUserWinCount(userId) {
    try {
      const count = await ChallengeWinnerRepository.countByUserId(userId);
      return count;
    } catch (error) {
      throw error;
    }
  }

  // Get top winners leaderboard
  static async getTopWinners(limit = 10) {
    try {
      const topWinners = await ChallengeWinnerRepository.getTopWinners(limit);
      return topWinners;
    } catch (error) {
      throw error;
    }
  }

  // Auto-select winners based on like count (for closed challenges without winners)
  static async autoSelectWinnersByLikes(challengeId, maxWinners = 3, adminNote = "Auto-selected by system") {
    try {
      const challenge = await ChallengeRepository.findById(challengeId);
      if (!challenge) {
        throw new customError("Challenge not found", 404);
      }

      if (!challenge.is_closed) {
        throw new customError("Challenge must be closed to auto-select winners", 400);
      }

      // Check if winners already exist
      const existingWinners = await ChallengeWinnerRepository.findByChallengeId(challengeId);
      if (existingWinners.length > 0) {
        throw new customError("Winners already selected for this challenge", 400);
      }

      // Get challenge leaderboard (sorted by likes)
      const leaderboard = await ChallengeRepository.getChallengeLeaderboard(challengeId);
      if (!leaderboard || !leaderboard.challengePosts || leaderboard.challengePosts.length === 0) {
        throw new customError("No submissions found for this challenge", 400);
      }

      // Take top posts based on like count
      const topPosts = leaderboard.challengePosts.slice(0, maxWinners);

      const winnersData = topPosts.map((challengePost, index) => ({
        userId: challengePost.user_id,
        postId: challengePost.post_id,
        rank: index + 1,
      }));

      // Select winners
      const result = await this.selectWinners(challengeId, winnersData, adminNote);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Check if challenge has winners
  static async challengeHasWinners(challengeId) {
    try {
      return await ChallengeWinnerRepository.challengeHasWinners(challengeId);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ChallengeWinnerService;
