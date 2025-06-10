// Import all necessary repositories
const UserPostRepository = require("../repositories/UserPostRepository");
const PostImageRepository = require("../repositories/PostImageRepository");
const PostTagRepository = require("../repositories/PostTagRepository");
const TagRepository = require("../repositories/TagRepository");
const PostLikeRepository = require("../repositories/PostLikeRepository");
const UserBookmarkService = require("./UserBookmarkService");
const UserFollowRepository = require("../repositories/UserFollowRepository");
const PostCommentService = require("../services/PostCommentService");
const { gamificationEmitter } = require("../emitters/gamificationEmitter");

// Import utility functions
const { formatDate } = require("../utils/dateFormatterUtils");
const deleteFile = require("../utils/deleteFileUtils");

// Define the UserPostService class
class UserPostService {
  // Static method to get all user posts and related data for a user profile page
  static async getUserPosts(userId, currentUserId, page, limit) {
    try {
      // Pagination setup
      const offset = (page - 1) * limit;

      // Get posts from related users with pagination
      const relatedPosts = await UserPostRepository.findByUserId(userId, offset, limit);
      if (relatedPosts.length === 0) return [];

      // Get all post IDs
      const postIds = relatedPosts.map((post) => post.id);

      // Fetch all related data in batches
      const [postImages, postTags, postLikeCounts, postCommentCounts, postLikeStatuses, userBookmarkStatuses] = await Promise.all([
        PostImageRepository.findByPostIds(postIds),
        PostTagRepository.findByPostIds(postIds),
        PostLikeRepository.countByPostIds(postIds),
        PostCommentService.countByPostIds(postIds),
        PostLikeRepository.getStatuses(currentUserId, postIds),
        UserBookmarkService.getStatuses(postIds, currentUserId),
      ]);

      // Convert arrays into maps for quick lookup
      const imagesMap = postImages.reduce((acc, img) => {
        acc[img.post_id] = acc[img.post_id] || [];
        acc[img.post_id].push(img.image_url);
        return acc;
      }, {});

      const tagsMap = postTags.reduce((acc, tag) => {
        acc[tag.post_id] = acc[tag.post_id] || [];
        acc[tag.post_id].push(tag.name);
        return acc;
      }, {});

      const likeCountMap = postLikeCounts.reduce((acc, like) => {
        acc[like.post_id] = like.count;
        return acc;
      }, {});

      const commentCountMap = postCommentCounts.reduce((acc, comment) => {
        acc[comment.post_id] = comment.count;
        return acc;
      }, {});

      const likeStatusMap = postLikeStatuses.reduce((acc, status) => {
        acc[status.post_id] = true; // Set true untuk post_id yang ada
        return acc;
      }, {});

      const bookmarkStatusMap = userBookmarkStatuses.reduce((acc, status) => {
        acc[status.post_id] = true; // Set true untuk post_id yang ada
        return acc;
      }, {});

      return relatedPosts.map((post) => ({
        id: post.id,
        userId: post.user_id,
        firstName: post.user.firstName,
        lastName: post.user.lastName,
        username: post.user.profile.username,
        avatar: post.user.profile.avatar,
        level: post.user.experience.level,
        createdAt: formatDate(post.created_at),
        type: post.type,
        title: post.title,
        description: post.description,
        images: imagesMap[post.id] || [],
        tags: tagsMap[post.id] || [],
        postLikeStatus: likeStatusMap[post.id] || false,
        bookmarkStatus: bookmarkStatusMap[post.id] || false,
        likeCount: likeCountMap[post.id] || 0,
        commentCount: commentCountMap[post.id] || 0,
      }));
    } catch (error) {
      throw error;
    }
  }

  // Static method to get all posts for admin
  static async getAllPosts(page, limit) {
    try {
      // Pagination setup
      const offset = (page - 1) * limit;

      // Get all posts with pagination
      const posts = await UserPostRepository.findAll(offset, limit);

      if (posts.length === 0) return [];

      // Get all post IDs
      const postIds = posts.map((post) => post.id);

      // Fetch all related data in batches
      const [postImages, postTags, postLikeCounts, postCommentCounts] = await Promise.all([
        PostImageRepository.findByPostIds(postIds),
        PostTagRepository.findByPostIds(postIds),
        PostLikeRepository.countByPostIds(postIds),
        PostCommentService.countByPostIds(postIds),
      ]);

      // Convert arrays into maps for quick lookup
      const imagesMap = postImages.reduce((acc, img) => {
        acc[img.post_id] = acc[img.post_id] || [];
        acc[img.post_id].push(img.image_url);
        return acc;
      }, {});

      const tagsMap = postTags.reduce((acc, tag) => {
        acc[tag.post_id] = acc[tag.post_id] || [];
        acc[tag.post_id].push(tag.name);
        return acc;
      }, {});

      const likeCountMap = postLikeCounts.reduce((acc, like) => {
        acc[like.post_id] = like.count;
        return acc;
      }, {});

      const commentCountMap = postCommentCounts.reduce((acc, comment) => {
        acc[comment.post_id] = comment.count;
        return acc;
      }, {});

      // Assemble final post data
      return posts.map((post) => ({
        id: post.id,
        userId: post.user_id,
        firstName: post.user.firstName,
        lastName: post.user.lastName,
        username: post.user.profile.username,
        avatar: post.user.profile.avatar,
        level: post.user.experience.level,
        createdAt: post.createdAt,
        type: post.type,
        title: post.title,
        description: post.description,
        images: imagesMap[post.id] || [],
        tags: tagsMap[post.id] || [],
        likeCount: likeCountMap[post.id] || 0,
        commentCount: commentCountMap[post.id] || 0,
      }));
    } catch (error) {
      throw error;
    }
  }

  // Get all posts randomized for discovery page
  static async getRandomPosts(userId, page, limit) {
    try {
      // Pagination setup
      const offset = (page - 1) * limit;
      // Get all posts with pagination
      const posts = await UserPostRepository.findAllRandomized(offset, limit);
      if (posts.length === 0) return [];

      // Get all post IDs
      const postIds = posts.map((post) => post.id);
      // Fetch all related data in batches
      const [postImages, postTags, postLikeCounts, postCommentCounts, postLikeStatuses, userBookmarkStatuses] = await Promise.all([
        PostImageRepository.findByPostIds(postIds),
        PostTagRepository.findByPostIds(postIds),
        PostLikeRepository.countByPostIds(postIds),
        PostCommentService.countByPostIds(postIds),
        PostLikeRepository.getStatuses(userId, postIds),
        UserBookmarkService.getStatuses(postIds, userId),
      ]);

      // Convert arrays into maps for quick lookup
      const imagesMap = postImages.reduce((acc, img) => {
        acc[img.post_id] = acc[img.post_id] || [];
        acc[img.post_id].push(img.image_url);
        return acc;
      }, {});

      const tagsMap = postTags.reduce((acc, tag) => {
        acc[tag.post_id] = acc[tag.post_id] || [];
        acc[tag.post_id].push(tag.name);
        return acc;
      }, {});

      const likeCountMap = postLikeCounts.reduce((acc, like) => {
        acc[like.post_id] = like.count;
        return acc;
      }, {});

      const commentCountMap = postCommentCounts.reduce((acc, comment) => {
        acc[comment.post_id] = comment.count;
        return acc;
      }, {});

      const likeStatusMap = postLikeStatuses.reduce((acc, status) => {
        acc[status.post_id] = true; // Set true untuk post_id yang ada
        return acc;
      }, {});

      const bookmarkStatusMap = userBookmarkStatuses.reduce((acc, status) => {
        acc[status.post_id] = true; // Set true untuk post_id yang ada
        return acc;
      }, {});

      return posts.map((post) => ({
        id: post.id,
        userId: post.user_id,
        firstName: post.user.firstName,
        lastName: post.user.lastName,
        username: post.user.profile.username,
        avatar: post.user.profile.avatar,
        level: post.user.experience.level,
        createdAt: formatDate(post.created_at),
        type: post.type,
        title: post.title,
        description: post.description,
        images: imagesMap[post.id] || [],
        tags: tagsMap[post.id] || [],
        postLikeStatus: likeStatusMap[post.id] || false,
        bookmarkStatus: bookmarkStatusMap[post.id] || false,
        likeCount: likeCountMap[post.id] || 0,
        commentCount: commentCountMap[post.id] || 0,
      }));
    } catch (error) {
      throw error;
    }
  }

  // Static method to get all posts for the home feed
  static async getHomePosts(userId, page, limit) {
    try {
      // Get all following user IDs
      const relatedUsers = await UserFollowRepository.findByFollowerId(userId);

      const followingIds = relatedUsers.map((user) => user.followed_id); // Extract followed user IDs
      followingIds.push(userId); // Include the current user

      if (followingIds.length === 0) return [];

      // Pagination setup
      const offset = (page - 1) * limit;

      // Get posts from related users with pagination
      const relatedPosts = await UserPostRepository.findByUsersIds(followingIds, offset, limit);
      if (relatedPosts.length === 0) return [];

      // Get all post IDs
      const postIds = relatedPosts.map((post) => post.id);

      // Fetch all related data in batches
      const [postImages, postTags, postLikeCounts, postCommentCounts, postLikeStatuses, userBookmarkStatuses] = await Promise.all([
        PostImageRepository.findByPostIds(postIds),
        PostTagRepository.findByPostIds(postIds),
        PostLikeRepository.countByPostIds(postIds),
        PostCommentService.countByPostIds(postIds),
        PostLikeRepository.getStatuses(userId, postIds),
        UserBookmarkService.getStatuses(postIds, userId),
      ]);

      // Convert arrays into maps for quick lookup
      const imagesMap = postImages.reduce((acc, img) => {
        acc[img.post_id] = acc[img.post_id] || [];
        acc[img.post_id].push(img.image_url);
        return acc;
      }, {});

      const tagsMap = postTags.reduce((acc, tag) => {
        acc[tag.post_id] = acc[tag.post_id] || [];
        acc[tag.post_id].push(tag.name);
        return acc;
      }, {});

      const likeCountMap = postLikeCounts.reduce((acc, like) => {
        acc[like.post_id] = like.count;
        return acc;
      }, {});

      const commentCountMap = postCommentCounts.reduce((acc, comment) => {
        acc[comment.post_id] = comment.count;
        return acc;
      }, {});

      const likeStatusMap = postLikeStatuses.reduce((acc, status) => {
        acc[status.post_id] = true; // Set true untuk post_id yang ada
        return acc;
      }, {});

      const bookmarkStatusMap = userBookmarkStatuses.reduce((acc, status) => {
        acc[status.post_id] = true; // Set true untuk post_id yang ada
        return acc;
      }, {});

      return relatedPosts.map((post) => ({
        id: post.id,
        userId: post.user_id,
        firstName: post.user.firstName,
        lastName: post.user.lastName,
        username: post.user.profile.username,
        avatar: post.user.profile.avatar,
        level: post.user.experience.level,
        createdAt: formatDate(post.created_at),
        type: post.type,
        title: post.title,
        description: post.description,
        images: imagesMap[post.id] || [],
        tags: tagsMap[post.id] || [],
        postLikeStatus: likeStatusMap[post.id] || false,
        bookmarkStatus: bookmarkStatusMap[post.id] || false,
        likeCount: likeCountMap[post.id] || 0,
        commentCount: commentCountMap[post.id] || 0,
      }));
    } catch (error) {
      throw error;
    }
  }

  // Static method to get all liked posts by a user
  static async getLikedPosts(userId, page, limit) {
    try {
      // Pagination setup
      const offset = (page - 1) * limit;

      // Get all liked post IDs by user
      const likedPostIds = await PostLikeRepository.findPostIdsByUserId(userId, offset, limit);

      if (likedPostIds.length === 0) return [];

      // Ensure post_ids is an array of numbers, not objects
      const postIds = Array.isArray(likedPostIds) ? likedPostIds.map((item) => (typeof item === "object" ? item.post_id : item)) : [likedPostIds];

      // Get all related posts by liked post IDs
      const relatedPosts = await UserPostRepository.findByPostIds(postIds);

      if (relatedPosts.length === 0) return [];

      // Fetch all related data in batches
      const [postImages, postTags, postLikeCounts, postCommentCounts, postLikeStatuses, userBookmarkStatuses] = await Promise.all([
        PostImageRepository.findByPostIds(postIds),
        PostTagRepository.findByPostIds(postIds),
        PostLikeRepository.countByPostIds(postIds),
        PostCommentService.countByPostIds(postIds),
        PostLikeRepository.getStatuses(userId, postIds),
        UserBookmarkService.getStatuses(postIds, userId),
      ]);

      // Convert arrays into maps for quick lookup
      const imagesMap = postImages.reduce((acc, img) => {
        acc[img.post_id] = acc[img.post_id] || [];
        acc[img.post_id].push(img.image_url);
        return acc;
      }, {});

      const tagsMap = postTags.reduce((acc, tag) => {
        acc[tag.post_id] = acc[tag.post_id] || [];
        acc[tag.post_id].push(tag.name);
        return acc;
      }, {});

      const likeCountMap = postLikeCounts.reduce((acc, like) => {
        acc[like.post_id] = like.count;
        return acc;
      }, {});

      const commentCountMap = postCommentCounts.reduce((acc, comment) => {
        acc[comment.post_id] = comment.count;
        return acc;
      }, {});

      const likeStatusMap = postLikeStatuses.reduce((acc, status) => {
        acc[status.post_id] = true; // Set true untuk post_id yang ada
        return acc;
      }, {});

      const bookmarkStatusMap = userBookmarkStatuses.reduce((acc, status) => {
        acc[status.post_id] = true; // Set true untuk post_id yang ada
        return acc;
      }, {});

      return relatedPosts.map((post) => ({
        id: post.id,
        userId: post.user_id,
        firstName: post.user.firstName,
        lastName: post.user.lastName,
        username: post.user.profile.username,
        avatar: post.user.profile.avatar,
        level: post.user.experience.level,
        createdAt: formatDate(post.created_at),
        type: post.type,
        title: post.title,
        description: post.description,
        images: imagesMap[post.id] || [],
        tags: tagsMap[post.id] || [],
        postLikeStatus: likeStatusMap[post.id] || false,
        bookmarkStatus: bookmarkStatusMap[post.id] || false,
        likeCount: likeCountMap[post.id] || 0,
        commentCount: commentCountMap[post.id] || 0,
      }));
    } catch (error) {
      throw error;
    }
  }

  // Static method to get all bookmarked posts by a user
  static async getBookmarkedPosts(userId, page, limit) {
    try {
      // Get all bookmarked post IDs by user
      const bookmarkedPostIds = await UserBookmarkService.findPostIdsByUserId(userId, page, limit);

      if (bookmarkedPostIds.length === 0) return [];

      // Ensure post_ids is an array of numbers, not objects
      const postIds = Array.isArray(bookmarkedPostIds) ? bookmarkedPostIds.map((item) => (typeof item === "object" ? item.post_id : item)) : [bookmarkedPostIds];

      // Get all related posts by liked post IDs
      const relatedPosts = await UserPostRepository.findByPostIds(postIds);

      if (relatedPosts.length === 0) return [];

      // Fetch all related data in batches
      const [postImages, postTags, postLikeCounts, postCommentCounts, postLikeStatuses, userBookmarkStatuses] = await Promise.all([
        PostImageRepository.findByPostIds(postIds),
        PostTagRepository.findByPostIds(postIds),
        PostLikeRepository.countByPostIds(postIds),
        PostCommentService.countByPostIds(postIds),
        PostLikeRepository.getStatuses(userId, postIds),
        UserBookmarkService.getStatuses(postIds, userId),
      ]);

      // Convert arrays into maps for quick lookup
      const imagesMap = postImages.reduce((acc, img) => {
        acc[img.post_id] = acc[img.post_id] || [];
        acc[img.post_id].push(img.image_url);
        return acc;
      }, {});

      const tagsMap = postTags.reduce((acc, tag) => {
        acc[tag.post_id] = acc[tag.post_id] || [];
        acc[tag.post_id].push(tag.name);
        return acc;
      }, {});

      const likeCountMap = postLikeCounts.reduce((acc, like) => {
        acc[like.post_id] = like.count;
        return acc;
      }, {});

      const commentCountMap = postCommentCounts.reduce((acc, comment) => {
        acc[comment.post_id] = comment.count;
        return acc;
      }, {});

      const likeStatusMap = postLikeStatuses.reduce((acc, status) => {
        acc[status.post_id] = true; // Set true untuk post_id yang ada
        return acc;
      }, {});

      const bookmarkStatusMap = userBookmarkStatuses.reduce((acc, status) => {
        acc[status.post_id] = true; // Set true untuk post_id yang ada
        return acc;
      }, {});

      return relatedPosts.map((post) => ({
        id: post.id,
        userId: post.user_id,
        firstName: post.user.firstName,
        lastName: post.user.lastName,
        username: post.user.profile.username,
        avatar: post.user.profile.avatar,
        level: post.user.experience.level,
        createdAt: formatDate(post.created_at),
        type: post.type,
        title: post.title,
        description: post.description,
        images: imagesMap[post.id] || [],
        tags: tagsMap[post.id] || [],
        postLikeStatus: likeStatusMap[post.id] || false,
        bookmarkStatus: bookmarkStatusMap[post.id] || false,
        likeCount: likeCountMap[post.id] || 0,
        commentCount: commentCountMap[post.id] || 0,
      }));
    } catch (error) {
      throw error;
    }
  }

  // Get post leaderboards, sorted by like and comment count
  static async getPostLeaderboards(userId, page, limit) {
    try {
      const offset = (page - 1) * limit;

      const posts = await UserPostRepository.findSortedByEngagement(offset, limit);
      if (posts.length === 0) return [];

      // 2. Get all post IDs
      const postIds = posts.map((post) => post.id);

      // Fetch all related data in batches
      const [postImages, postTags, postLikeCounts, postCommentCounts, postLikeStatuses, userBookmarkStatuses] = await Promise.all([
        PostImageRepository.findByPostIds(postIds),
        PostTagRepository.findByPostIds(postIds),
        PostLikeRepository.countByPostIds(postIds),
        PostCommentService.countByPostIds(postIds),
        PostLikeRepository.getStatuses(userId, postIds),
        UserBookmarkService.getStatuses(postIds, userId),
      ]);

      // Convert arrays into maps for quick lookup
      const imagesMap = postImages.reduce((acc, img) => {
        acc[img.post_id] = acc[img.post_id] || [];
        acc[img.post_id].push(img.image_url);
        return acc;
      }, {});

      const tagsMap = postTags.reduce((acc, tag) => {
        acc[tag.post_id] = acc[tag.post_id] || [];
        acc[tag.post_id].push(tag.name);
        return acc;
      }, {});

      const likeCountMap = postLikeCounts.reduce((acc, like) => {
        acc[like.post_id] = like.count;
        return acc;
      }, {});

      const commentCountMap = postCommentCounts.reduce((acc, comment) => {
        acc[comment.post_id] = comment.count;
        return acc;
      }, {});

      const likeStatusMap = postLikeStatuses.reduce((acc, status) => {
        acc[status.post_id] = true; // Set true untuk post_id yang ada
        return acc;
      }, {});

      const bookmarkStatusMap = userBookmarkStatuses.reduce((acc, status) => {
        acc[status.post_id] = true; // Set true untuk post_id yang ada
        return acc;
      }, {});

      return posts.map((post) => ({
        id: post.id,
        userId: post.user_id,
        firstName: post.user.firstName,
        lastName: post.user.lastName,
        username: post.user.profile.username,
        avatar: post.user.profile.avatar,
        level: post.user.experience.level,
        createdAt: formatDate(post.created_at),
        type: post.type,
        title: post.title,
        description: post.description,
        images: imagesMap[post.id] || [],
        tags: tagsMap[post.id] || [],
        postLikeStatus: likeStatusMap[post.id] || false,
        bookmarkStatus: bookmarkStatusMap[post.id] || false,
        likeCount: likeCountMap[post.id] || 0,
        commentCount: commentCountMap[post.id] || 0,
      }));
    } catch (error) {
      throw error;
    }
  }

  // Search posts by tags
  static async searchPostsByTags(userId, tags, page, limit) {
    try {
      // get tag IDs from tag names
      const tagIds = await TagRepository.findTagIdsByNames(tags);
      if (tagIds.length === 0) return [];
      // Pagination setup
      const offset = (page - 1) * limit;
      // Get all post IDs by tags
      const postIds = await PostTagRepository.findPostIdsByTagIds(tagIds, offset, limit);
      if (postIds.length === 0) return [];
      // Ensure post_ids is an array of numbers, not objects
      const postIdsArray = Array.isArray(postIds) ? postIds.map((item) => (typeof item === "object" ? item.post_id : item)) : [postIds];
      // Get all related posts by post IDs
      const relatedPosts = await UserPostRepository.findByPostIds(postIdsArray);
      if (relatedPosts.length === 0) return [];
      // Fetch all related data in batches
      const [postImages, postTags, postLikeCounts, postCommentCounts, postLikeStatuses, userBookmarkStatuses] = await Promise.all([
        PostImageRepository.findByPostIds(postIdsArray),
        PostTagRepository.findByPostIds(postIdsArray),
        PostLikeRepository.countByPostIds(postIdsArray),
        PostCommentService.countByPostIds(postIdsArray),
        PostLikeRepository.getStatuses(userId, postIdsArray),
        UserBookmarkService.getStatuses(postIdsArray, userId),
      ]);

      // Convert arrays into maps for quick lookup
      const imagesMap = postImages.reduce((acc, img) => {
        acc[img.post_id] = acc[img.post_id] || [];
        acc[img.post_id].push(img.image_url);
        return acc;
      }, {});

      const tagsMap = postTags.reduce((acc, tag) => {
        acc[tag.post_id] = acc[tag.post_id] || [];
        acc[tag.post_id].push(tag.name);
        return acc;
      }, {});

      const likeCountMap = postLikeCounts.reduce((acc, like) => {
        acc[like.post_id] = like.count;
        return acc;
      }, {});

      const commentCountMap = postCommentCounts.reduce((acc, comment) => {
        acc[comment.post_id] = comment.count;
        return acc;
      }, {});

      const likeStatusMap = postLikeStatuses.reduce((acc, status) => {
        acc[status.post_id] = true; // Set true untuk post_id yang ada
        return acc;
      }, {});

      const bookmarkStatusMap = userBookmarkStatuses.reduce((acc, status) => {
        acc[status.post_id] = true; // Set true untuk post_id yang ada
        return acc;
      }, {});

      return relatedPosts.map((post) => ({
        id: post.id,
        userId: post.user_id,
        firstName: post.user.firstName,
        lastName: post.user.lastName,
        username: post.user.profile.username,
        avatar: post.user.profile.avatar,
        level: post.user.experience.level,
        createdAt: formatDate(post.created_at),
        type: post.type,
        title: post.title,
        description: post.description,
        images: imagesMap[post.id] || [],
        tags: tagsMap[post.id] || [],
        postLikeStatus: likeStatusMap[post.id] || false,
        bookmarkStatus: bookmarkStatusMap[post.id] || false,
        likeCount: likeCountMap[post.id] || 0,
        commentCount: commentCountMap[post.id] || 0,
      }));
    } catch (error) {
      // Re-throw the error to be caught by the controller's error handler
      throw error;
    }
  }

  // Searh post by a type
  static async searchPostsByType(userId, type, page, limit) {
    try {
      // Pagination setup
      const offset = (page - 1) * limit;
      // Get all post IDs by type
      const postIds = await UserPostRepository.findByType(type, offset, limit);
      if (postIds.length === 0) return [];
      // Ensure post_ids is an array of numbers, not objects
      const postIdsArray = Array.isArray(postIds) ? postIds.map((item) => (typeof item === "object" ? item.id : item)) : [postIds];
      // Get all related posts by post IDs
      const relatedPosts = await UserPostRepository.findByPostIds(postIdsArray);
      if (relatedPosts.length === 0) return [];
      // Fetch all related data in batches
      const [postImages, postTags, postLikeCounts, postCommentCounts, postLikeStatuses, userBookmarkStatuses] = await Promise.all([
        PostImageRepository.findByPostIds(postIdsArray),
        PostTagRepository.findByPostIds(postIdsArray),
        PostLikeRepository.countByPostIds(postIdsArray),
        PostCommentService.countByPostIds(postIdsArray),
        PostLikeRepository.getStatuses(userId, postIdsArray),
        UserBookmarkService.getStatuses(postIdsArray, userId),
      ]);

      // Convert arrays into maps for quick lookup
      const imagesMap = postImages.reduce((acc, img) => {
        acc[img.post_id] = acc[img.post_id] || [];
        acc[img.post_id].push(img.image_url);
        return acc;
      }, {});

      const tagsMap = postTags.reduce((acc, tag) => {
        acc[tag.post_id] = acc[tag.post_id] || [];
        acc[tag.post_id].push(tag.name);
        return acc;
      }, {});

      const likeCountMap = postLikeCounts.reduce((acc, like) => {
        acc[like.post_id] = like.count;
        return acc;
      }, {});

      const commentCountMap = postCommentCounts.reduce((acc, comment) => {
        acc[comment.post_id] = comment.count;
        return acc;
      }, {});

      const likeStatusMap = postLikeStatuses.reduce((acc, status) => {
        acc[status.post_id] = true; // Set true untuk post_id yang ada
        return acc;
      }, {});

      const bookmarkStatusMap = userBookmarkStatuses.reduce((acc, status) => {
        acc[status.post_id] = true; // Set true untuk post_id yang ada
        return acc;
      }, {});

      return relatedPosts.map((post) => ({
        id: post.id,
        userId: post.user_id,
        firstName: post.user.firstName,
        lastName: post.user.lastName,
        username: post.user.profile.username,
        avatar: post.user.profile.avatar,
        level: post.user.experience.level,
        createdAt: formatDate(post.created_at),
        type: post.type,
        title: post.title,
        description: post.description,
        images: imagesMap[post.id] || [],
        tags: tagsMap[post.id] || [],
        postLikeStatus: likeStatusMap[post.id] || false,
        bookmarkStatus: bookmarkStatusMap[post.id] || false,
        likeCount: likeCountMap[post.id] || 0,
        commentCount: commentCountMap[post.id] || 0,
      }));
    } catch (error) {
      // Re-throw the error to be caught by the controller's error handler
      throw error;
    }
  }

  // Search post by title and description
  static async searchPostsByTitleAndDescription(userId, query, page, limit) {
    try {
      // Pagination setup
      const offset = (page - 1) * limit;
      // Get all post IDs by query
      const postIds = await UserPostRepository.findByTitleAndDescription(query, offset, limit);
      if (postIds.length === 0) return [];
      // Ensure post_ids is an array of numbers, not objects
      const postIdsArray = Array.isArray(postIds) ? postIds.map((item) => (typeof item === "object" ? item.id : item)) : [postIds];
      // Get all related posts by post IDs
      const relatedPosts = await UserPostRepository.findByPostIds(postIdsArray);
      if (relatedPosts.length === 0) return [];
      // Fetch all related data in batches
      const [postImages, postTags, postLikeCounts, postCommentCounts, postLikeStatuses, userBookmarkStatuses] = await Promise.all([
        PostImageRepository.findByPostIds(postIdsArray),
        PostTagRepository.findByPostIds(postIdsArray),
        PostLikeRepository.countByPostIds(postIdsArray),
        PostCommentService.countByPostIds(postIdsArray),
        PostLikeRepository.getStatuses(userId, postIdsArray),
        UserBookmarkService.getStatuses(postIdsArray, userId),
      ]);

      // Convert arrays into maps for quick lookup
      const imagesMap = postImages.reduce((acc, img) => {
        acc[img.post_id] = acc[img.post_id] || [];
        acc[img.post_id].push(img.image_url);
        return acc;
      }, {});

      const tagsMap = postTags.reduce((acc, tag) => {
        acc[tag.post_id] = acc[tag.post_id] || [];
        acc[tag.post_id].push(tag.name);
        return acc;
      }, {});

      const likeCountMap = postLikeCounts.reduce((acc, like) => {
        acc[like.post_id] = like.count;
        return acc;
      }, {});

      const commentCountMap = postCommentCounts.reduce((acc, comment) => {
        acc[comment.post_id] = comment.count;
        return acc;
      }, {});

      const likeStatusMap = postLikeStatuses.reduce((acc, status) => {
        acc[status.post_id] = true; // Set true untuk post_id yang ada
        return acc;
      }, {});

      const bookmarkStatusMap = userBookmarkStatuses.reduce((acc, status) => {
        acc[status.post_id] = true; // Set true untuk post_id yang ada
        return acc;
      }, {});

      return relatedPosts.map((post) => ({
        id: post.id,
        userId: post.user_id,
        firstName: post.user.firstName,
        lastName: post.user.lastName,
        username: post.user.profile.username,
        avatar: post.user.profile.avatar,
        level: post.user.experience.level,
        createdAt: formatDate(post.created_at),
        type: post.type,
        title: post.title,
        description: post.description,
        images: imagesMap[post.id] || [],
        tags: tagsMap[post.id] || [],
        postLikeStatus: likeStatusMap[post.id] || false,
        bookmarkStatus: bookmarkStatusMap[post.id] || false,
        likeCount: likeCountMap[post.id] || 0,
        commentCount: commentCountMap[post.id] || 0,
      }));
    } catch (error) {
      // Re-throw the error to be caught by the controller's error handler
      throw error;
    }
  }

  // Static method to create a new post
  static async createPost(userId, title, description, tags, imagePaths, type) {
    let post; // Declare post outside try block for potential cleanup/logging if needed

    try {
      // 1. Create the main post entry
      post = await UserPostRepository.create(userId, title, description, type);
      if (!post || !post.id) {
        // Handle case where post creation might fail silently
        throw new Error(`Failed to create post entry for user ${userId}`);
      }

      // 2. Process Tags: Ensure 'tags' is an array before mapping.
      // If tags is undefined, null, or not an array, treat it as an empty array.
      const tagsToProcess = Array.isArray(tags) ? tags : [];
      let createdTags = [];
      if (tagsToProcess.length > 0) {
        createdTags = await Promise.all(
          tagsToProcess.map((tag) => TagRepository.findOrCreate(tag.trim())) // Trim whitespace from tags
        );
      }

      // 3. Link Tags to Post: Only if tags were actually created/found.
      let postTags = [];
      // Filter out any potential null/undefined results from findOrCreate before mapping
      const validTags = createdTags.filter((tag) => tag && tag.id);
      if (validTags.length > 0) {
        postTags = await Promise.all(validTags.map((tag) => PostTagRepository.create(post.id, tag.id)));
      }

      // 4. Process Images: Ensure 'imagePaths' is an array before mapping (belt-and-suspenders).
      // The controller should already guarantee this, but it doesn't hurt.
      const pathsToProcess = Array.isArray(imagePaths) ? imagePaths : [];
      let postImages = [];
      if (pathsToProcess.length > 0) {
        postImages = await Promise.all(pathsToProcess.map((imagePath) => PostImageRepository.create(post.id, imagePath)));
      }

      // 5. Emit Gamification Event
      gamificationEmitter.emit("postCreated", userId); // Consider passing post.id too if useful

      // 6. Return the comprehensive result
      // Ensure all parts are arrays, even if empty
      return {
        post,
        postTags: Array.isArray(postTags) ? postTags : [],
        postImages: Array.isArray(postImages) ? postImages : [],
      };
    } catch (error) {
      // Re-throw the error to be caught by the controller's error handler
      // You might want to wrap it in a custom service error type here
      throw error;
    }
  }

  // // Static method to update a post
  // static async updatePost(postId, title, description, tags, images, type) {
  //   try {
  //     // Update the post
  //     const post = await UserPostRepository.update(postId, title, description, type);

  //     // Delete post tags
  //     const postTags = await PostTagRepository.deleteByPostId(postId);

  //     // If tag does not exist, create a new tag
  //     const createdTags = await Promise.all(tags.map((tag) => TagRepository.findOrCreate(tag)));

  //     // Create post tags
  //     const newPostTags = await Promise.all(createdTags.map((tag) => PostTagRepository.create(postId, tag.id)));

  //     // Delete post images
  //     const postImages = await PostImageRepository.deleteByPostId(postId);

  //     // Create post images
  //     const newPostImages = await Promise.all(images.map((image) => PostImageRepository.create(postId, image)));

  //     return { post, postTags, newPostTags, postImages, newPostImages };
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // Static method to delete a post
  static async deletePost(postId) {
    try {
      // Get all images paths for the post
      const postImages = await PostImageRepository.findByPostId(postId);

      // Make it array by mapping
      const imagePaths = postImages.map((image) => image.image_url);

      // Delete images from storage with forEach
      imagePaths.forEach((imagePath) => {
        // deleteFileUtils is a utility function to delete files
        deleteFile(imagePath);
      });

      // Delete the post
      const post = await UserPostRepository.delete(postId);

      console.log("Post deleted:", post);
      // Because db alerady has cascade delete, we don't need to delete post tags and images again (so i commented it out, untested though)

      // // Delete post tags
      // const postTags = await PostTagRepository.deleteByPostId(postId);

      // // Delete post images
      // const postImages = await PostImageRepository.deleteByPostId(postId);

      // Gamification event for post deletion
      const userId = post.user_id;
      gamificationEmitter.emit("postDeleted", userId);

      return { post };
    } catch (error) {
      throw error;
    }
  }

  // Static method to get post by ID (for challenge integration)
  static async getPostById(postId) {
    try {
      const post = await UserPostRepository.findByPostId(postId);
      return post;
    } catch (error) {
      throw error;
    }
  }
}

// Export the UserPostService class
module.exports = UserPostService;
