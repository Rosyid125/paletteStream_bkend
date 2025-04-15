// Import all necessary repositories
const UserPostRepository = require("../repositories/UserPostRepository");
const PostImageRepository = require("../repositories/PostImageRepository");
const PostTagRepository = require("../repositories/PostTagRepository");
const TagRepository = require("../repositories/TagRepository");
const PostLikeRepository = require("../repositories/PostLikeRepository");
const UserBookmarkService = require("./UserBookmarkService");
const UserFollowRepository = require("../repositories/UserFollowRepository");
const PostCommentService = require("../services/PostCommentService");

// Import utility functions
const { formatDate } = require("../utils/dateFormatterUtils");

// For error handling
const currentService = "UserPostService";

// Define the UserPostService class
class UserPostService {
  // Static method to get all user posts and related data for a user profile page
  static async getUserPosts(userId, page, limit) {
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
      throw new Error(`${currentService} Error: ${error.message}`);
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
      throw new Error(`${currentService} Error: ${error.message}`);
    }
  }

  // Static method to get all posts for the home feed
  static async getHomePosts(userId, page, limit) {
    try {
      // Get all following user IDs
      const relatedUsers = await UserFollowRepository.findByFollowerId(userId);
      const followingIds = relatedUsers.map((user) => user.following_id);
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
      throw new Error(`${currentService} Error: ${error.message}`);
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
      throw new Error(`${currentService} Error: ${error.message}`);
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
      throw new Error(`${currentService} Error: ${error.message}`);
    }
  }

  // Static method to create a new post
  static async createPost(userId, title, description, tags, imagePaths, type) {
    try {
      // Simpan post baru
      const post = await UserPostRepository.create(userId, title, description, type);

      // Cari atau buat tags
      const createdTags = await Promise.all(tags.map((tag) => TagRepository.findOrCreate(tag)));

      // Hubungkan tags dengan post
      const postTags = await Promise.all(createdTags.map((tag) => PostTagRepository.create(post.id, tag.id)));

      // Simpan path gambar ke database
      const postImages = await Promise.all(imagePaths.map((imagePath) => PostImageRepository.create(post.id, imagePath)));

      return { post, postTags, postImages };
    } catch (error) {
      throw new Error(`${currentService} Error: ${error.message}`);
    }
  }

  // Static method to update a post
  static async updatePost(postId, title, description, tags, images, type) {
    try {
      // Update the post
      const post = await UserPostRepository.update(postId, title, description, type);

      // Delete post tags
      const postTags = await PostTagRepository.deleteByPostId(postId);

      // If tag does not exist, create a new tag
      const createdTags = await Promise.all(tags.map((tag) => TagRepository.findOrCreate(tag)));

      // Create post tags
      const newPostTags = await Promise.all(createdTags.map((tag) => PostTagRepository.create(postId, tag.id)));

      // Delete post images
      const postImages = await PostImageRepository.deleteByPostId(postId);

      // Create post images
      const newPostImages = await Promise.all(images.map((image) => PostImageRepository.create(postId, image)));

      return { post, postTags, newPostTags, postImages, newPostImages };
    } catch (error) {
      throw new Error(`${currentService} Error: ${error.message}`);
    }
  }

  // Static method to delete a post
  static async deletePost(postId) {
    try {
      // Delete the post
      const post = await UserPostRepository.delete(postId);

      // Delete post tags
      const postTags = await PostTagRepository.deleteByPostId(postId);

      // Delete post images
      const postImages = await PostImageRepository.deleteByPostId(postId);

      return { post, postTags, postImages };
    } catch (error) {
      throw new Error(`${currentService} Error: ${error.message}`);
    }
  }
}

// Export the UserPostService class
module.exports = UserPostService;
