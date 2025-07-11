const ChallengeRepository = require("../repositories/ChallengeRepository");
const UserBadgeRepository = require("../repositories/UserBadgeRepository");
const UserPostService = require("./UserPostService");
const customError = require("../errors/customError");
const { deleteFromCloudinary, extractPublicIdFromUrl } = require("../utils/cloudinaryUtil");

class ChallengeService {
  // Get all challenges
  static async getAllChallenges() {
    try {
      const challenges = await ChallengeRepository.findAll();
      return challenges;
    } catch (error) {
      throw error;
    }
  }

  // Get active challenges only
  static async getActiveChallenges() {
    try {
      const challenges = await ChallengeRepository.findActive();
      return challenges;
    } catch (error) {
      throw error;
    }
  }
  // Get challenge by ID with all details
  static async getChallengeById(id) {
    try {
      const challenge = await ChallengeRepository.findByIdWithCounts(id);
      if (!challenge) {
        throw new customError("Challenge not found", 404);
      }
      return challenge;
    } catch (error) {
      throw error;
    }
  }

  // Get challenges created by user
  static async getChallengesByCreator(userId) {
    try {
      const challenges = await ChallengeRepository.findByCreator(userId);
      return challenges;
    } catch (error) {
      throw error;
    }
  }

  // Create new challenge (Admin only)
  static async createChallenge(title, description, badgeImg, deadline, createdBy) {
    try {
      // Validate deadline is in the future
      const deadlineDate = new Date(deadline);
      if (deadlineDate <= new Date()) {
        throw new customError("Deadline must be in the future", 400);
      }

      const challenge = await ChallengeRepository.create(title, description, badgeImg, deadline, createdBy);

      return challenge;
    } catch (error) {
      throw error;
    }
  }
  // Update challenge (Admin only)
  static async updateChallenge(id, updateData) {
    try {
      const existingChallenge = await ChallengeRepository.findById(id);
      if (!existingChallenge) {
        throw new customError("Challenge not found", 404);
      }

      // Tidak boleh update jika challenge sudah closed
      if (existingChallenge.is_closed) {
        throw new customError("Challenge is already closed and cannot be edited", 400);
      }

      // Validate deadline if provided
      if (updateData.deadline) {
        const deadlineDate = new Date(updateData.deadline);
        if (deadlineDate <= new Date()) {
          throw new customError("Deadline must be in the future", 400);
        }
      }

      // Handle old badge image deletion if new image is uploaded
      if (updateData.badge_img && existingChallenge.badge_img) {
        try {
          // Check if old image is from Cloudinary
          if (existingChallenge.badge_img.includes("cloudinary.com")) {
            const publicId = extractPublicIdFromUrl(existingChallenge.badge_img);
            if (publicId) {
              await deleteFromCloudinary(publicId);
            }
          }
          // For local files, you might want to add fs.unlink logic here if needed
        } catch (deleteError) {
          console.error("Error deleting old badge image:", deleteError);
          // Continue with update even if old image deletion fails
        }
      }

      const challenge = await ChallengeRepository.update(id, updateData);
      return challenge;
    } catch (error) {
      throw error;
    }
  }

  // Close challenge manually (Admin only)
  static async closeChallenge(id) {
    try {
      const challenge = await ChallengeRepository.findById(id);
      if (!challenge) {
        throw new customError("Challenge not found", 404);
      }

      if (challenge.is_closed) {
        throw new customError("Challenge is already closed", 400);
      }

      await ChallengeRepository.close(id);
      return { success: true, message: "Challenge closed successfully" };
    } catch (error) {
      throw error;
    }
  }

  // Delete challenge (Admin only)
  static async deleteChallenge(id) {
    try {
      const challenge = await ChallengeRepository.findById(id);
      if (!challenge) {
        throw new customError("Challenge not found", 404);
      }

      // Delete badge image from Cloudinary if it exists
      if (challenge.badge_img) {
        try {
          // Check if image is from Cloudinary
          if (challenge.badge_img.includes("cloudinary.com")) {
            const publicId = extractPublicIdFromUrl(challenge.badge_img);
            if (publicId) {
              await deleteFromCloudinary(publicId);
            }
          }
          // For local files, you might want to add fs.unlink logic here if needed
        } catch (deleteError) {
          console.error("Error deleting badge image:", deleteError);
          // Continue with challenge deletion even if image deletion fails
        }
      }

      const deleted = await ChallengeRepository.delete(id);
      if (!deleted) {
        throw new customError("Failed to delete challenge", 500);
      }

      return { success: true, message: "Challenge deleted successfully" };
    } catch (error) {
      throw error;
    }
  }

  // Submit post to challenge
  static async submitPostToChallenge(challengeId, postId, userId) {
    try {
      // Check if challenge exists and is active
      const challenge = await ChallengeRepository.findById(challengeId);
      if (!challenge) {
        throw new customError("Challenge not found", 404);
      }

      if (challenge.is_closed) {
        throw new customError("Challenge is closed", 400);
      }

      if (new Date(challenge.deadline) <= new Date()) {
        throw new customError("Challenge deadline has passed", 400);
      } // Check if post exists and belongs to user
      const post = await UserPostService.getPostById(postId);
      if (!post || post.user_id !== userId) {
        throw new customError("Post not found or unauthorized", 404);
      }

      const ChallengePostService = require("./ChallengePostService");

      // Check if user already submitted to this challenge
      const existingSubmission = await ChallengePostService.findByUserAndChallenge(userId, challengeId);
      if (existingSubmission) {
        throw new customError("You have already submitted to this challenge", 400);
      }

      // Check if post is already submitted to this challenge
      const existingPost = await ChallengePostService.findByPostAndChallenge(postId, challengeId);
      if (existingPost) {
        throw new customError("This post is already submitted to this challenge", 400);
      }

      // Check if post is already submitted to ANY other challenge
      const postInOtherChallenge = await ChallengePostService.findByPostId(postId);
      if (postInOtherChallenge && postInOtherChallenge.challenge_id !== challengeId) {
        throw new customError("This post has already been submitted to another challenge and cannot be reused", 400);
      }

      const challengePost = await ChallengePostService.create(challengeId, postId, userId);
      return challengePost;
    } catch (error) {
      throw error;
    }
  }

  // Get challenge submissions/leaderboard
  static async getChallengeLeaderboard(challengeId) {
    try {
      const challenge = await ChallengeRepository.getChallengeLeaderboard(challengeId);
      if (!challenge) {
        throw new customError("Challenge not found", 404);
      }

      return challenge;
    } catch (error) {
      throw error;
    }
  }

  // Auto-close expired challenges (for cron job)
  static async autoCloseExpiredChallenges() {
    try {
      const expiredChallenges = await ChallengeRepository.findExpiredNotClosed();

      const closedChallenges = [];
      for (const challenge of expiredChallenges) {
        await ChallengeRepository.close(challenge.id);
        closedChallenges.push(challenge);
      }

      return {
        success: true,
        message: `Auto-closed ${closedChallenges.length} expired challenges`,
        closedChallenges,
      };
    } catch (error) {
      throw error;
    }
  } // Get user's challenge history
  static async getUserChallengeHistory(userId) {
    try {
      const ChallengePostService = require("./ChallengePostService");
      const challengePosts = await ChallengePostService.findByUserId(userId);
      const userBadges = await UserBadgeRepository.findByUserId(userId);

      return {
        submissions: challengePosts,
        badges: userBadges,
      };
    } catch (error) {
      throw error;
    }
  }

  // Get user's challenge participations with challenge details
  static async getUserChallengeParticipations(userId) {
    try {
      const ChallengePostService = require("./ChallengePostService");
      const challengePosts = await ChallengePostService.findByUserId(userId);

      // Get unique challenge IDs from user's posts
      const challengeIds = [...new Set(challengePosts.map((cp) => cp.challenge_id))];

      // Get challenge details for each participated challenge
      const challengeDetails = await Promise.all(challengeIds.map((challengeId) => ChallengeRepository.findById(challengeId)));

      // Combine challenge details with participation info
      const participations = challengeDetails.map((challenge) => {
        const userPost = challengePosts.find((cp) => cp.challenge_id === challenge.id);
        return {
          challenge_id: challenge.id,
          title: challenge.title,
          description: challenge.description,
          badge_img: challenge.badge_img,
          deadline: challenge.deadline,
          is_closed: challenge.is_closed,
          created_at: userPost.created_at, // participation date
          post_id: userPost.post_id,
        };
      });

      return participations;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ChallengeService;
