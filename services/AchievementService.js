// Service untuk logika bisnis achievement & progress
const AchievementRepository = require("../repositories/AchievementRepository");
const UserAchievementRepository = require("../repositories/UserAchievementRepository");
const UserPostRepository = require("../repositories/UserPostRepository");
const PostLikeRepository = require("../repositories/PostLikeRepository");
const PostCommentRepository = require("../repositories/PostCommentRepository");
const CommentReplyRepository = require("../repositories/CommentReplyRepository");
const customError = require("../errors/customError");

class AchievementService {
  // Ambil semua achievement (maks 20)
  static async getAllAchievements() {
    const achievements = await AchievementRepository.findAll();
    return achievements.slice(0, 20);
  }

  // Ambil achievement yang sudah unlocked user
  static async getUnlockedAchievements(userId) {
    const userAchievements = await UserAchievementRepository.findByUserId(userId);
    return userAchievements?.filter((a) => a.status === "completed") || [];
  }

  // Update progress achievement (triggered by event)
  static async updateProgress({ userId, trigger, value = 1 }) {
    // Mapping trigger ke achievement_id (bisa pakai config/enum)
    // Contoh: { UPLOAD_POST: 1, LEVEL_UP: 2, ... }
    const triggerMap = {
      UPLOAD_POST: 1,
      LEVEL_UP: 2,
      // Tambahkan mapping lain sesuai kebutuhan
    };
    const achievementId = triggerMap[trigger];
    if (!achievementId) throw new customError("Invalid trigger", 400);
    const achievement = await AchievementRepository.findById(achievementId);
    if (!achievement) throw new customError("Achievement not found", 404);
    // Cek user_achievement
    let userAch = await UserAchievementRepository.findByUserAndAchievement(userId, achievementId);
    if (!userAch) {
      // Belum ada, insert baru
      userAch = await UserAchievementRepository.create(userId, achievementId, value, value >= achievement.goal ? "completed" : "in-progress");
    } else {
      // Update progress
      let newProgress = userAch.progress + value;
      let status = newProgress >= achievement.goal ? "completed" : "in-progress";
      if (newProgress > achievement.goal) newProgress = achievement.goal;
      await UserAchievementRepository.update(userId, achievementId, newProgress, status);
    }
    return true;
  }

  // Modular event handler for achievement progress
  static async handleEvent(eventName, userId, metadata = {}) {
    switch (eventName) {
      case "post_liked": {
        // Community Favorite (id:1), Rising Star (id:2)
        const posts = await UserPostRepository.findByUserId(userId, 0, 1000);
        const postIds = posts.map((p) => p.id);
        if (postIds.length === 0) return;
        const allLikes = await Promise.all(postIds.map((pid) => PostLikeRepository.findByPostIdAll(pid)));
        const uniqueUserIds = new Set();
        allLikes.flat().forEach((like) => {
          if (like && like.user_id && like.user_id !== userId) uniqueUserIds.add(like.user_id);
        });
        await AchievementService._updateUserAchievementProgress(userId, 1, uniqueUserIds.size); // Community Favorite
        let totalLikes = 0;
        allLikes.flat().forEach((like) => {
          if (like && like.user_id !== userId) totalLikes++;
        });
        await AchievementService._updateUserAchievementProgress(userId, 2, totalLikes); // Rising Star
        // Mini Viral (id:10): 5 likes from different users in 1 hour (metadata.postId, metadata.likedAt)
        if (metadata.postId && metadata.likedAt) {
          const likes = await PostLikeRepository.findByPostIdAll(metadata.postId);
          const oneHourAgo = new Date(new Date(metadata.likedAt).getTime() - 60 * 60 * 1000);
          const recentLikes = likes.filter((like) => new Date(like.created_at) >= oneHourAgo);
          const uniqueRecent = new Set(recentLikes.map((like) => like.user_id));
          await AchievementService._updateUserAchievementProgress(userId, 10, uniqueRecent.size);
        }
        break;
      }
      case "post_commented": {
        // Well Commented (id:3): 20 comments from 10 different users on user's posts
        const posts = await UserPostRepository.findByUserId(userId, 0, 1000);
        const postIds = posts.map((p) => p.id);
        if (postIds.length === 0) return;
        const allComments = await Promise.all(postIds.map(async (pid) => {
          const comments = await PostCommentRepository.findByPostId(pid, 0, 1000); // Get first 1000 comments
          return comments;
        }));
        const flatComments = allComments.flat();
        const uniqueCommenters = new Set(flatComments.map((c) => c.user_id).filter((uid) => uid !== userId));
        await AchievementService._updateUserAchievementProgress(userId, 3, flatComments.length);
        break;
      }
      case "comment_replied": {
        // Talk of the Thread (id:4): comment got 10 replies from different users
        const { commentId } = metadata;
        if (!commentId) return;
        const replies = await CommentReplyRepository.findByCommentId(commentId, 0, 1000);
        const uniqueUserIds = new Set();
        replies.forEach((reply) => {
          if (reply && reply.user_id && reply.user_id !== userId) uniqueUserIds.add(reply.user_id);
        });
        await AchievementService._updateUserAchievementProgress(userId, 4, uniqueUserIds.size);
        break;
      }
      case "post_bookmarked": {
        // Saved by Many (id:5): post bookmarked by 20 users
        // Saved by the Crowd (id:15): one post bookmarked by 30 users
        const posts = await UserPostRepository.findByUserId(userId, 0, 1000);
        const postIds = posts.map((p) => p.id);
        if (postIds.length === 0) return;
        // Assume UserBookmarkRepository.findByPostId returns all bookmarks for a post
        const UserBookmarkRepository = require("../repositories/UserBookmarkRepository");
        const allBookmarks = await Promise.all(postIds.map((pid) => UserBookmarkRepository.findByPostId(pid)));
        let totalBookmarks = 0;
        let maxBookmarks = 0;
        allBookmarks.forEach((arr) => {
          totalBookmarks += arr.length;
          if (arr.length > maxBookmarks) maxBookmarks = arr.length;
        });
        await AchievementService._updateUserAchievementProgress(userId, 5, totalBookmarks); // Saved by Many
        await AchievementService._updateUserAchievementProgress(userId, 15, maxBookmarks); // Saved by the Crowd
        break;
      }
      case "user_followed": {
        // Known in the Community (id:6): followed by 50 users
        // Becoming Influential (id:7): followed by 100 users
        const UserFollowRepository = require("../repositories/UserFollowRepository");
        const followers = await UserFollowRepository.findFollowers(userId);
        await AchievementService._updateUserAchievementProgress(userId, 6, followers.length);
        await AchievementService._updateUserAchievementProgress(userId, 7, followers.length);
        break;
      }
      case "chat_started": {
        // Active Connections (id:8): active chats with 10 different users (2-way)
        // Assume MessageRepository.findActiveChats(userId) returns array of unique user_ids
        const MessageRepository = require("../repositories/MessageRepository");
        const activeChats = await MessageRepository.findActiveChats(userId);
        await AchievementService._updateUserAchievementProgress(userId, 8, activeChats.length);
        break;
      }
      case "comment_replied_by_user": {
        // Engaging Commenter (id:9): user replied to comments from 10 different users
        // metadata.commentId, replyId
        const replies = await CommentReplyRepository.findByUserId(userId);
        const uniqueTargetUsers = new Set();
        for (const reply of replies) {
          if (reply.comment_id) {
            const comment = await PostCommentRepository.findById(reply.comment_id);
            if (comment && comment.user_id && comment.user_id !== userId) uniqueTargetUsers.add(comment.user_id);
          }
        }
        await AchievementService._updateUserAchievementProgress(userId, 9, uniqueTargetUsers.size);
        break;
      }
      case "leaderboard_daily": {
        // Daily Leader (id:11): post ranked in top 10 daily leaderboard
        // metadata.postId
        if (metadata.postId && metadata.isTop10) {
          await AchievementService._updateUserAchievementProgress(userId, 11, 1);
        }
        break;
      }
      case "leaderboard_weekly": {
        // Weekly Highlight (id:12): post ranked in top 10 weekly leaderboard
        if (metadata.postId && metadata.isTop10) {
          await AchievementService._updateUserAchievementProgress(userId, 12, 1);
        }
        break;
      }
      case "post_tagged": {
        // One Tag to Rule... (id:13): 10 consecutive posts using the same tag
        // metadata.tagId
        if (!metadata.tagId) return;
        const posts = await UserPostRepository.findByUserId(userId, 0, 1000);
        let count = 0;
        for (let i = posts.length - 1; i >= 0; i--) {
          const post = posts[i];
          if (post.tags && post.tags.some((t) => t.id === metadata.tagId)) {
            count++;
          } else {
            break;
          }
        }
        await AchievementService._updateUserAchievementProgress(userId, 13, count);
        break;
      }
      case "post_uploaded": {
        // Gallery Post (id:14): Uploaded 10 posts, each with 3+ images
        const posts = await UserPostRepository.findByUserId(userId, 0, 1000);
        let count = 0;
        for (const post of posts) {
          if (post.images && post.images.length >= 3) count++;
        }
        await AchievementService._updateUserAchievementProgress(userId, 14, count);
        break;
      }
      default:
        break;
    }
  }

  /**
   * Helper to update or insert user achievement progress
   */
  static async _updateUserAchievementProgress(userId, achievementId, progress) {
    const achievement = await AchievementRepository.findById(achievementId);
    if (!achievement) return;
    let userAch = await UserAchievementRepository.findByUserAndAchievement(userId, achievementId);
    const status = progress >= achievement.goal ? "completed" : "in-progress";
    const cappedProgress = Math.min(progress, achievement.goal);
    if (!userAch) {
      await UserAchievementRepository.create(userId, achievementId, cappedProgress, status);
    } else {
      await UserAchievementRepository.update(userId, achievementId, cappedProgress, status);
    }
  }

  // Format progress string
  static formatProgress(progress, goal) {
    return `${progress}/${goal}`;
  }
}

module.exports = AchievementService;
