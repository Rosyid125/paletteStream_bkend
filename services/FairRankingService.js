/**
 * Fair Ranking Service - Advanced scoring algorithms for more equitable rankings
 *
 * This service implements multiple fairness factors:
 * 1. Time decay for posts to promote fresh content
 * 2. Account age normalization for user rankings
 * 3. Quality metrics beyond raw engagement
 * 4. Anti-gaming measures
 * 5. Diversity and recency bonuses
 */

const UserPostRepository = require("../repositories/UserPostRepository");
const PostLikeRepository = require("../repositories/PostLikeRepository");
const PostCommentService = require("../services/PostCommentService");
const UserExpRepository = require("../repositories/UserExpRepository");
const UserFollowRepository = require("../repositories/UserFollowRepository");
const UserRepository = require("../repositories/UserRepository");

class FairRankingService {
  /**
   * Calculate fair post ranking score with time decay and quality metrics
   */
  static calculatePostScore(post, likeCount, commentCount, replyCount = 0) {
    const now = new Date();
    const postDate = new Date(post.created_at);
    const hoursOld = (now - postDate) / (1000 * 60 * 60);
    const daysOld = hoursOld / 24;

    // Base engagement score
    const baseScore = likeCount * 3 + commentCount * 2 + replyCount * 1;

    // Time decay factor - newer posts get boost, but not too aggressive
    let timeDecayFactor;
    if (hoursOld <= 24) {
      // Fresh content (0-24 hours) gets significant boost
      timeDecayFactor = 1.5 - hoursOld / 48; // 1.5 to 1.0 over 24 hours
    } else if (daysOld <= 7) {
      // Recent content (1-7 days) gets moderate boost
      timeDecayFactor = 1.0 - (daysOld - 1) / 20; // 1.0 to 0.7 over 6 days
    } else if (daysOld <= 30) {
      // Month-old content gets gentle decay
      timeDecayFactor = 0.7 - (daysOld - 7) / 100; // 0.7 to 0.47 over 23 days
    } else {
      // Older content gets significant decay but not zero
      timeDecayFactor = Math.max(0.2, 0.47 - (daysOld - 30) / 200);
    }

    // Quality bonuses
    let qualityMultiplier = 1.0;

    // High engagement rate bonus (comments vs likes ratio)
    if (likeCount > 0) {
      const engagementRate = commentCount / likeCount;
      if (engagementRate > 0.3) qualityMultiplier += 0.2; // High discussion
      else if (engagementRate > 0.15) qualityMultiplier += 0.1; // Good discussion
    }

    // Viral content detection (high engagement in short time)
    if (hoursOld <= 6 && baseScore >= 10) {
      qualityMultiplier += 0.3; // Viral bonus
    } else if (hoursOld <= 24 && baseScore >= 20) {
      qualityMultiplier += 0.2; // Strong early engagement
    }

    // Anti-spam: penalize posts with suspicious patterns
    if (commentCount > likeCount * 3) {
      qualityMultiplier *= 0.8; // Possible comment spam
    }

    return Math.round(baseScore * timeDecayFactor * qualityMultiplier * 100) / 100;
  }

  /**
   * Calculate fair user ranking score with account age normalization
   */
  static calculateUserScore(userExp, followers, posts, likesReceived, accountAgeDays, recentActivityScore = 0) {
    // Normalize by account age to give newer users fair chance
    const ageNormalizationFactor = Math.min(2.0, Math.max(0.5, 100 / (accountAgeDays + 10)));

    // Base experience and level (reduced weight)
    const expScore = (userExp?.exp || 0) * 0.25; // Reduced from 0.4
    const levelScore = (userExp?.level || 0) * 0.15; // Reduced from 0.2

    // Social metrics with age normalization
    const followerScore = followers * 0.2 * ageNormalizationFactor;
    const postScore = posts * 0.1 * ageNormalizationFactor;
    const likeScore = likesReceived * 0.15 * ageNormalizationFactor;

    // Recent activity bonus (heavily weighted for fairness)
    const activityScore = recentActivityScore * 0.25;

    // Quality bonus based on engagement ratio
    let qualityMultiplier = 1.0;
    if (posts > 0) {
      const engagementPerPost = likesReceived / posts;
      if (engagementPerPost > 3) qualityMultiplier += 0.3; // High quality content
      else if (engagementPerPost > 1.5) qualityMultiplier += 0.15; // Good content
    }

    const totalScore = (expScore + levelScore + followerScore + postScore + likeScore + activityScore) * qualityMultiplier;

    return Math.round(totalScore * 100) / 100;
  }

  /**
   * Get recent activity score for a user (last 7 days)
   */
  static async calculateRecentActivityScore(userId) {
    try {
      // This would ideally query recent posts, likes, comments, etc.
      // For now, we'll use a simplified approach
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      // In a real implementation, you would query:
      // - Recent posts created
      // - Recent likes received
      // - Recent comments/engagement
      // - Recent social interactions

      // Simplified calculation for now
      return 0; // TODO: Implement proper recent activity tracking
    } catch (error) {
      console.error("Error calculating recent activity:", error);
      return 0;
    }
  }

  /**
   * Calculate challenge ranking with fairness considerations
   */
  static calculateChallengeScore(likeCount, commentCount, submissionTime, challengeDeadline) {
    const baseScore = likeCount * 2 + commentCount;

    // Early submission bonus (encourage early participation)
    const totalChallengeTime = new Date(challengeDeadline) - new Date(submissionTime);
    const submissionDelay = new Date(submissionTime) - new Date(challengeDeadline);
    const earlySubmissionBonus = Math.max(0, 1 - submissionDelay / totalChallengeTime) * 0.2;

    // Diversity bonus (would need to check against user's past wins)
    const diversityBonus = 0; // TODO: Implement based on user's win history

    return baseScore * (1 + earlySubmissionBonus + diversityBonus);
  }

  /**
   * Get fair post leaderboard with improved ranking
   */
  static async getFairPostLeaderboard(userId, page, limit) {
    try {
      // Get more posts to ensure fair ranking after score calculation
      const extendedLimit = Math.min(100, limit * 3);
      const offset = 0; // Start from beginning for fair scoring

      const posts = await UserPostRepository.findSortedByEngagement(offset, extendedLimit);
      if (posts.length === 0) return [];

      const postIds = posts.map((post) => post.id);

      // Get engagement data
      const [postLikeCounts, postCommentCounts] = await Promise.all([PostLikeRepository.countByPostIds(postIds), PostCommentService.countByPostIds(postIds)]);

      // Create maps for quick lookup
      const likeCountMap = postLikeCounts.reduce((acc, like) => {
        acc[like.post_id] = parseInt(like.count) || 0;
        return acc;
      }, {});

      const commentCountMap = postCommentCounts.reduce((acc, comment) => {
        acc[comment.post_id] = parseInt(comment.count) || 0;
        return acc;
      }, {});

      // Calculate fair scores for all posts
      const scoredPosts = posts.map((post) => {
        const likeCount = likeCountMap[post.id] || 0;
        const commentCount = commentCountMap[post.id] || 0;
        const fairScore = this.calculatePostScore(post, likeCount, commentCount);

        return {
          ...post,
          likeCount,
          commentCount,
          fairScore,
          originalScore: likeCount * 5 + commentCount, // For comparison
        };
      });

      // Sort by fair score
      scoredPosts.sort((a, b) => b.fairScore - a.fairScore);

      // Apply pagination after fair ranking
      const startIndex = (page - 1) * limit;
      const paginatedPosts = scoredPosts.slice(startIndex, startIndex + limit);

      return paginatedPosts;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get fair user leaderboard with account age normalization
   */
  static async getFairUserLeaderboard(page, limit) {
    try {
      const allUserIds = await UserRepository.findAllUserIdsWithoutPagination();
      const leaderboardData = [];

      for (const id of allUserIds) {
        try {
          const [user, userExp, followers, posts, likes] = await Promise.all([
            UserRepository.findById(id),
            UserExpRepository.findByUserId(id),
            UserFollowRepository.countFollowersByUserId(id),
            UserPostRepository.countByUserId(id),
            PostLikeRepository.countLikesReceivedByUserId(id),
          ]);

          if (!user) continue;

          const accountAgeDays = Math.floor((new Date() - new Date(user.created_at)) / (1000 * 60 * 60 * 24));
          const recentActivityScore = await this.calculateRecentActivityScore(id);

          const fairScore = this.calculateUserScore(userExp, followers, posts, likes, accountAgeDays, recentActivityScore);

          const originalScore = (userExp?.exp || 0) * 0.4 + (userExp?.level || 0) * 0.2 + followers * 0.15 + posts * 0.15 + likes * 0.1;

          leaderboardData.push({
            userId: id,
            fairScore,
            originalScore,
            accountAgeDays,
            metrics: { exp: userExp?.exp, level: userExp?.level, followers, posts, likes },
          });
        } catch (error) {
          console.error(`Error processing user ${id}:`, error);
          continue;
        }
      }

      // Sort by fair score
      leaderboardData.sort((a, b) => b.fairScore - a.fairScore);

      // Apply pagination
      const startIndex = (page - 1) * limit;
      const paginatedData = leaderboardData.slice(startIndex, startIndex + limit);

      return paginatedData;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = FairRankingService;
