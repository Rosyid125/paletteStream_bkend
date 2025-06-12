const ChallengePostRepository = require("../repositories/ChallengePostRepository");
const PostCommentService = require("./PostCommentService");
const PostLikeRepository = require("../repositories/PostLikeRepository");

class ChallengePostService {
  // Get challenge posts by user ID with accurate comment counts
  static async findByUserId(userId) {
    try {
      // Get challenge posts from repository (without comment count data from relations)
      const challengePosts = await ChallengePostRepository.findByUserId(userId);

      if (challengePosts.length === 0) {
        return [];
      }

      // Extract post IDs for batch processing
      const postIds = challengePosts.map((cp) => cp.post.id);

      // Get accurate comment counts (comments + replies) and like counts
      const [commentCounts, likeCounts] = await Promise.all([PostCommentService.countByPostIds(postIds), PostLikeRepository.countByPostIds(postIds)]);

      // Create maps for quick lookup
      const commentCountMap = commentCounts.reduce((acc, row) => {
        acc[row.post_id] = parseInt(row.count) || 0;
        return acc;
      }, {});

      const likeCountMap = likeCounts.reduce((acc, row) => {
        acc[row.post_id] = parseInt(row.count) || 0;
        return acc;
      }, {});

      // Add accurate counts to each challenge post
      const enrichedChallengePosts = challengePosts.map((challengePost) => ({
        ...challengePost,
        post: {
          ...challengePost.post,
          commentCount: commentCountMap[challengePost.post.id] || 0,
          likeCount: likeCountMap[challengePost.post.id] || 0,
        },
      }));

      return enrichedChallengePosts;
    } catch (error) {
      throw error;
    }
  }

  // Get all challenge posts
  static async findAll() {
    try {
      return await ChallengePostRepository.findAll();
    } catch (error) {
      throw error;
    }
  }

  // Get challenge posts by challenge ID
  static async findByChallengeId(challengeId) {
    try {
      return await ChallengePostRepository.findByChallengeId(challengeId);
    } catch (error) {
      throw error;
    }
  }

  // Get challenge post by ID
  static async findById(id) {
    try {
      return await ChallengePostRepository.findById(id);
    } catch (error) {
      throw error;
    }
  }

  // Check if user already submitted to challenge
  static async findByUserAndChallenge(userId, challengeId) {
    try {
      return await ChallengePostRepository.findByUserAndChallenge(userId, challengeId);
    } catch (error) {
      throw error;
    }
  }

  // Check if post is already submitted to challenge
  static async findByPostAndChallenge(postId, challengeId) {
    try {
      return await ChallengePostRepository.findByPostAndChallenge(postId, challengeId);
    } catch (error) {
      throw error;
    }
  }

  // Check if post is already submitted to any challenge
  static async findByPostId(postId) {
    try {
      return await ChallengePostRepository.findByPostId(postId);
    } catch (error) {
      throw error;
    }
  }

  // Create challenge post submission
  static async create(challengeId, postId, userId) {
    try {
      return await ChallengePostRepository.create(challengeId, postId, userId);
    } catch (error) {
      throw error;
    }
  }

  // Delete challenge post
  static async delete(id) {
    try {
      return await ChallengePostRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }

  // Delete by post ID and challenge ID
  static async deleteByPostAndChallenge(postId, challengeId) {
    try {
      return await ChallengePostRepository.deleteByPostAndChallenge(postId, challengeId);
    } catch (error) {
      throw error;
    }
  }

  // Get challenge posts with like counts (for leaderboard)
  static async findByChallengeWithLikeCounts(challengeId) {
    try {
      return await ChallengePostRepository.findByChallengeWithLikeCounts(challengeId);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ChallengePostService;
