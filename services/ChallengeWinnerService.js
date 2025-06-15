const ChallengeWinnerRepository = require("../repositories/ChallengeWinnerRepository");
const ChallengeRepository = require("../repositories/ChallengeRepository");
const ChallengePostRepository = require("../repositories/ChallengePostRepository");
const PostLikeRepository = require("../repositories/PostLikeRepository");
const UserService = require("./UserService");
const BadgeService = require("./BadgeService");
const NotificationService = require("./NotificationService");
const customError = require("../errors/customError");
const FairRankingService = require("./FairRankingService");
const { gamificationEmitter } = require("../emitters/gamificationEmitter");

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
          const finalScore = parseInt(likeCount) || 0;          // Create winner entry
          const winner = await ChallengeWinnerRepository.create(challengeId, userId, postId, rank, finalScore, adminNote);

          // Emit challengeWinner event untuk gamifikasi
          gamificationEmitter.emit('challengeWinner', userId);

          // Award badge to winner
          try {
            await BadgeService.awardBadge(userId, challengeId, challenge.badge_img, `Winner - Rank ${rank}`);
          } catch (badgeError) {
            console.log(`Badge award failed for user ${userId}:`, badgeError.message);
          }

          // Send winner notification
          try {
            await NotificationService.notifyChallengeWinner(userId, challengeId, challenge.title, rank, `Rank ${rank} in ${challenge.title}`);

            await NotificationService.notifyBadgeAwarded(userId, challengeId, challenge.title, challenge.badge_img, rank);
          } catch (notificationError) {
            console.error("Failed to send winner notification:", notificationError);
          }

          // Emit challengeWinner event
          try {
            gamificationEmitter.emit("challengeWinner", {
              userId,
              challengeId,
              postId,
              rank,
              finalScore,
              adminNote,
            });
          } catch (emitError) {
            console.error("Failed to emit challengeWinner event:", emitError);
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
  // Auto-select winners based on fair challenge ranking (not just raw likes)
  static async autoSelectWinnersByLikes(challengeId, maxWinners = 3, adminNote = "Auto-selected by fair ranking system") {
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

      // Get challenge leaderboard with fair ranking considerations
      const leaderboard = await ChallengeRepository.getChallengeLeaderboard(challengeId);
      if (!leaderboard || !leaderboard.challengePosts || leaderboard.challengePosts.length === 0) {
        throw new customError("No submissions found for this challenge", 400);
      }

      // Apply fair challenge scoring to posts
      const scoredPosts = leaderboard.challengePosts.map((challengePost) => {
        const likeCount = challengePost.post.likeCount || 0;
        const commentCount = challengePost.post.commentCount || 0;
        const submissionTime = challengePost.created_at;
        const challengeDeadline = challenge.deadline;

        const fairScore = FairRankingService.calculateChallengeScore(likeCount, commentCount, submissionTime, challengeDeadline);

        return {
          ...challengePost,
          fairScore,
          originalScore: likeCount, // Keep original for comparison
        };
      });

      // Sort by fair score (highest first)
      scoredPosts.sort((a, b) => b.fairScore - a.fairScore);

      // Take top posts based on fair score
      const topPosts = scoredPosts.slice(0, maxWinners);

      const winnersData = topPosts.map((challengePost, index) => ({
        userId: challengePost.user_id,
        postId: challengePost.post_id,
        rank: index + 1,
        fairScore: challengePost.fairScore,
        originalScore: challengePost.originalScore,
      }));

      // Log fair ranking results for transparency
      console.log(`🏆 Fair Challenge Winner Selection for Challenge ${challengeId}:`);
      winnersData.forEach((winner, index) => {
        console.log(`  ${index + 1}. User ${winner.userId} - Fair Score: ${winner.fairScore}, Original Score: ${winner.originalScore}`);
      });

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
