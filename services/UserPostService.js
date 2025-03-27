// Import all necessary repositories
const UserPostRepository = require("../repositories/UserPostRepository");
const PostImageRepository = require("../repositories/PostImageRepository");
const PostTagRepository = require("../repositories/PostTagRepository");
const UserRepository = require("../repositories/UserRepository");
const UserProfileRepository = require("../repositories/UserProfileRepository");
const UserExpRepository = require("../repositories/UserExpRepository");
const TagRepository = require("../repositories/TagRepository");
const PostLikeRepository = require("../repositories/PostLikeRepository");
const UserFollowRepository = require("../repositories/UserFollowRepository");
const PostCommentService = require("../services/PostCommentService");

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
      const [postImages, postTags, postLikeCounts, postCommentCounts, postLikeStatuses] = await Promise.all([
        PostImageRepository.findByPostIds(postIds),
        PostTagRepository.findByPostIds(postIds),
        PostLikeRepository.countByPostIds(postIds),
        PostCommentService.countByPostIds(postIds),
        PostLikeRepository.getStatuses(userId, postIds),
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
        acc[status.post_id] = status.is_liked;
        return acc;
      }, {});

      // Assemble final post data
      return relatedPosts.map((post) => ({
        id: post.id,
        userId: post.user_id,
        createdAt: post.createdAt,
        type: post.type,
        title: post.title,
        description: post.description,
        images: imagesMap[post.id] || [],
        tags: tagsMap[post.id] || [],
        postLikeStatus: likeStatusMap[post.id] || false,
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
      const [postImages, postTags, postLikeCounts, postCommentCounts, postLikeStatuses] = await Promise.all([
        PostImageRepository.findByPostIds(postIds),
        PostTagRepository.findByPostIds(postIds),
        PostLikeRepository.countByPostIds(postIds),
        PostCommentService.countByPostIds(postIds),
        PostLikeRepository.getStatuses(userId, postIds),
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
        acc[status.post_id] = status.is_liked;
        return acc;
      }, {});

      // Assemble final post data
      return relatedPosts.map((post) => ({
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
        postLikeStatus: likeStatusMap[post.id] || false,
        likeCount: likeCountMap[post.id] || 0,
        commentCount: commentCountMap[post.id] || 0,
      }));
    } catch (error) {
      throw new Error(`${currentService} Error: ${error.message}`);
    }
  }

  // Static method to get a single post with all details
  static async getPostDetails(postId) {
    try {
      // Get post by postId
      const post = await UserPostRepository.findById(postId);
      if (!post) {
        return null;
      }

      // Get all necessary post data in one go
      const [postImages, postTags, postLikeCount, postLikeStatus, postCommentCount, user, userProfile, userExp] = await Promise.all([
        PostImageRepository.findByPostId(post.id),
        PostTagRepository.findByPostId(post.id),
        PostLikeRepository.countByPostId(post.id),
        PostLikeRepository.getStatus(post.id, post.user_id),
        PostCommentService.countByPostId(post.id),
        UserRepository.findById(post.user_id),
        UserProfileRepository.findByUserId(post.user_id),
        UserExpRepository.findByUserId(post.user_id),
      ]);

      // Ambil semua tag ID dari postTags
      const tagIds = postTags.map((tag) => tag.tag_id);

      // Fetch semua tag dalam satu query
      const tags = tagIds.length > 0 ? await TagRepository.findTagsByIds(tagIds) : [];

      // Mapping tag ID ke nama
      const tagMap = tags.reduce((acc, tag) => {
        acc[tag.id] = tag.name;
        return acc;
      }, {});

      return {
        id: post.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: userProfile.username,
        avatar: userProfile.avatar,
        level: userExp.level,
        createdAt: post.createdAt,
        type: post.type,
        title: post.title,
        description: post.description,
        images: postImages.map((image) => image.image_url),
        tags: postTags.map((tag) => tagMap[tag.tag_id] || "Unknown"),
        likeCount: postLikeCount || 0,
        postLikeStatus: postLikeStatus ? true : false,
        commentCount: postCommentCount || 0,
      };
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
