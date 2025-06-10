const Challenge = require("../models/Challenge");

class ChallengeRepository {
  // Get all challenges
  static async findAll() {
    try {
      const challenges = await Challenge.query().withGraphFetched("[creator.[profile], challengePosts.post.[images, tags, user.[profile, experience]]]").orderBy("created_at", "desc");
      return challenges;
    } catch (error) {
      throw error;
    }
  }
  // Get active challenges (not closed and deadline not passed)
  static async findActive() {
    try {
      const challenges = await Challenge.query()
        .withGraphFetched("[creator.[profile], challengePosts.post.[images, tags, user.[profile, experience]]]")
        .where("is_closed", false)
        .where("deadline", ">", new Date().toISOString())
        .orderBy("created_at", "desc");
      return challenges;
    } catch (error) {
      throw error;
    }
  } // Get challenge by ID
  static async findById(id) {
    try {
      const challenge = await Challenge.query().findById(id).withGraphFetched("[creator.[profile], challengePosts.post.[images, tags, user.[profile, experience]], userBadges.user.[profile], winners.user.[profile]]");
      return challenge;
    } catch (error) {
      throw error;
    }
  }

  // Get challenge by ID with full details including likes and comment counts
  static async findByIdWithCounts(id) {
    try {
      const challenge = await Challenge.query().findById(id).withGraphFetched("[creator.[profile], challengePosts.post.[images, tags, user.[profile, experience]], userBadges.user.[profile]]");

      if (!challenge) return null;

      // If there are challenge posts, we'll need to get the counts via service layer
      if (challenge.challengePosts && challenge.challengePosts.length > 0) {
        const PostLikeRepository = require("./PostLikeRepository");
        const PostCommentService = require("../services/PostCommentService");

        const postIds = challenge.challengePosts.map((cp) => cp.post.id);

        // Get like and comment counts
        const [likeCounts, commentCounts] = await Promise.all([PostLikeRepository.countByPostIds(postIds), PostCommentService.countByPostIds(postIds)]);

        // Create maps for quick lookup
        const likeCountMap = likeCounts.reduce((acc, row) => {
          acc[row.post_id] = parseInt(row.count) || 0;
          return acc;
        }, {});

        const commentCountMap = commentCounts.reduce((acc, row) => {
          acc[row.post_id] = parseInt(row.count) || 0;
          return acc;
        }, {}); // Enrich challenge posts with counts
        challenge.challengePosts = challenge.challengePosts.map((challengePost) => ({
          ...challengePost,
          post: {
            ...challengePost.post,
            likeCount: likeCountMap[challengePost.post.id] || 0,
            commentCount: commentCountMap[challengePost.post.id] || 0,
          },
        }));

        // Sort posts by like count (descending - most liked first)
        challenge.challengePosts.sort((a, b) => {
          return b.post.likeCount - a.post.likeCount;
        });
      }

      return challenge;
    } catch (error) {
      throw error;
    }
  }
  // Get challenges created by a user
  static async findByCreator(userId) {
    try {
      const challenges = await Challenge.query().where("created_by", userId).withGraphFetched("[challengePosts.post.[images, tags, user.[profile, experience]]]").orderBy("created_at", "desc");
      return challenges;
    } catch (error) {
      throw error;
    }
  }

  // Get expired challenges that are not closed
  static async findExpiredNotClosed() {
    try {
      const challenges = await Challenge.query().where("is_closed", false).where("deadline", "<=", new Date().toISOString());
      return challenges;
    } catch (error) {
      throw error;
    }
  }

  // Create a new challenge
  static async create(title, description, badgeImg, deadline, createdBy) {
    try {
      const challenge = await Challenge.query().insert({
        title,
        description,
        badge_img: badgeImg,
        deadline,
        created_by: createdBy,
      });
      return challenge;
    } catch (error) {
      throw error;
    }
  }

  // Update challenge
  static async update(id, updateData) {
    try {
      const challenge = await Challenge.query().findById(id).patch(updateData);
      return challenge;
    } catch (error) {
      throw error;
    }
  }

  // Close challenge
  static async close(id) {
    try {
      const challenge = await Challenge.query().findById(id).patch({ is_closed: true });
      return challenge;
    } catch (error) {
      throw error;
    }
  }

  // Delete challenge
  static async delete(id) {
    try {
      const deletedCount = await Challenge.query().deleteById(id);
      return deletedCount > 0;
    } catch (error) {
      throw error;
    }
  } // Get challenge posts with like counts for leaderboard
  static async getChallengeLeaderboard(challengeId) {
    try {
      const challenge = await Challenge.query().findById(challengeId).withGraphFetched("[challengePosts.post.[images, tags, user.[profile, experience]]]");

      if (!challenge) return null;

      // If there are challenge posts, get accurate counts
      if (challenge.challengePosts && challenge.challengePosts.length > 0) {
        const PostLikeRepository = require("./PostLikeRepository");
        const PostCommentService = require("../services/PostCommentService");

        const postIds = challenge.challengePosts.map((cp) => cp.post.id);

        // Get like and comment counts
        const [likeCounts, commentCounts] = await Promise.all([PostLikeRepository.countByPostIds(postIds), PostCommentService.countByPostIds(postIds)]);

        // Create maps for quick lookup
        const likeCountMap = likeCounts.reduce((acc, row) => {
          acc[row.post_id] = parseInt(row.count) || 0;
          return acc;
        }, {});

        const commentCountMap = commentCounts.reduce((acc, row) => {
          acc[row.post_id] = parseInt(row.count) || 0;
          return acc;
        }, {});

        // Enrich challenge posts with counts and sort by likes
        challenge.challengePosts = challenge.challengePosts.map((challengePost) => ({
          ...challengePost,
          post: {
            ...challengePost.post,
            likeCount: likeCountMap[challengePost.post.id] || 0,
            commentCount: commentCountMap[challengePost.post.id] || 0,
          },
        }));

        // Sort posts by like count (descending)
        challenge.challengePosts.sort((a, b) => {
          return b.post.likeCount - a.post.likeCount;
        });
      }

      return challenge;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ChallengeRepository;
