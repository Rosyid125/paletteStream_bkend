const ChallengePost = require("../models/ChallengePost");

class ChallengePostRepository {
  // Get all challenge posts
  static async findAll() {
    try {
      const challengePosts = await ChallengePost.query().withGraphFetched("[challenge, post.[images, tags, user.[profile, experience]], user.[profile]]");
      return challengePosts;
    } catch (error) {
      throw error;
    }
  }
  // Get challenge posts by challenge ID
  static async findByChallengeId(challengeId) {
    try {
      const challengePosts = await ChallengePost.query().where("challenge_id", challengeId).withGraphFetched("[post.[images, tags, user.[profile, experience]], user.[profile]]").orderBy("created_at", "desc");
      return challengePosts;
    } catch (error) {
      throw error;
    }
  } // Get challenge posts by user ID
  static async findByUserId(userId) {
    try {
      const challengePosts = await ChallengePost.query().where("user_id", userId).withGraphFetched("[challenge, post.[images, tags, user.[profile, experience]]]").orderBy("created_at", "desc");
      return challengePosts;
    } catch (error) {
      throw error;
    }
  }
  // Get challenge post by ID
  static async findById(id) {
    try {
      const challengePost = await ChallengePost.query().findById(id).withGraphFetched("[challenge, post.[images, tags, user.[profile, experience]], user.[profile]]");
      return challengePost;
    } catch (error) {
      throw error;
    }
  }
  // Check if user already submitted to challenge
  static async findByUserAndChallenge(userId, challengeId) {
    try {
      const challengePost = await ChallengePost.query().findOne({ user_id: userId, challenge_id: challengeId }).withGraphFetched("[post.[images, tags]]");
      return challengePost;
    } catch (error) {
      throw error;
    }
  }

  // Check if post is already submitted to challenge
  static async findByPostAndChallenge(postId, challengeId) {
    try {
      const challengePost = await ChallengePost.query().findOne({ post_id: postId, challenge_id: challengeId });
      return challengePost;
    } catch (error) {
      throw error;
    }
  }

  // Create challenge post submission
  static async create(challengeId, postId, userId) {
    try {
      const challengePost = await ChallengePost.query().insert({
        challenge_id: challengeId,
        post_id: postId,
        user_id: userId,
      });
      return challengePost;
    } catch (error) {
      throw error;
    }
  }

  // Delete challenge post
  static async delete(id) {
    try {
      const deletedCount = await ChallengePost.query().deleteById(id);
      return deletedCount > 0;
    } catch (error) {
      throw error;
    }
  }

  // Delete by post ID and challenge ID
  static async deleteByPostAndChallenge(postId, challengeId) {
    try {
      const deletedCount = await ChallengePost.query().delete().where({ post_id: postId, challenge_id: challengeId });
      return deletedCount > 0;
    } catch (error) {
      throw error;
    }
  }
  // Get challenge posts with like counts (for leaderboard)
  static async findByChallengeWithLikeCounts(challengeId) {
    try {
      const challengePosts = await ChallengePost.query().where("challenge_id", challengeId).withGraphFetched("[post.[images, tags, user.[profile, experience], likes]]").orderBy("created_at", "desc");

      // Sort by like count
      challengePosts.sort((a, b) => {
        const likesA = a.post.likes ? a.post.likes.length : 0;
        const likesB = b.post.likes ? b.post.likes.length : 0;
        return likesB - likesA;
      });

      return challengePosts;
    } catch (error) {
      throw error;
    }
  }

  // Check if post is submitted to any challenge
  static async findByPostId(postId) {
    try {
      const challengePost = await ChallengePost.query()
        .findOne({ post_id: postId })
        .withGraphFetched("[challenge]");
      return challengePost;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ChallengePostRepository;
