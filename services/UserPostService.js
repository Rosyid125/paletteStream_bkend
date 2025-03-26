// Import all necessary repositories
const UserPostRepository = require("../repositories/UserPostRepository");
const PostImageRepository = require("../repositories/PostImageRepository");
const PostTagRepository = require("../repositories/PostTagRepository");
const UserRepository = require("../repositories/UserRepository");
const UserProfileRepository = require("../repositories/UserProfileRepository");
const UserExpRepository = require("../repositories/UserExpRepository");
const TagRepository = require("../repositories/TagRepository");
const PostLikeRepostory = require("./PostLikeService");

// Import needed services (for more complicated services (tidak cukup dengan repository))
const PostCommentService = require("./PostCommentService");

// Define the UserPostService class
class UserPostService {
  // Static method to get all user posts and related data for a user profile page
  static async getUserPosts(userId) {
    // Get all posts by userId
    const userPosts = await UserPostRepository.findByUserId(userId);
    if (!userPosts || userPosts.length === 0) {
      return null;
    }

    // Get all images, tags, like counts, and comment counts for the user's posts
    const postsWithDetails = [];

    for (const post of userPosts) {
      // Get images for the current post
      const postImages = await PostImageRepository.findByPostId(post.id);

      // Get tag id for the current post
      const postTags = await PostTagRepository.findByPostId(post.id);

      // Get tag name based on tag id
      for (const tag of postTags) {
        const tagDetails = await TagRepository.findById(tag.tag_id);
        tag.name = tagDetails.name;
      }

      // Get like counts for the current post
      const postLikeCount = await PostLikeService.countByPostId(post.id);

      // Get comment counts for the current post
      const postCommentCount = await PostCommentService.countByPostId(post.id);

      // Get user information
      const user = await UserRepository.findById(userId);

      // Get user profile information
      const userProfile = await UserProfileRepository.findByUserId(userId);

      // Get user experience information
      const userExp = await UserExpRepository.findByUserId(userId);

      // Assemble the data for the current post
      postsWithDetails.push({
        id: post.id,
        userId: userId,
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
        tags: postTags.map((tag) => tag.name),
        likeCount: postLikeCount || 0,
        commentCount: postCommentCount || 0,
      });
    }

    return postsWithDetails;
  }

  // Static method to get all posts for admin
  static async getAllPosts(page, limit) {
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
      PostCommentRepository.countByPostIds(postIds),
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
      username: post.profile.username,
      avatar: post.profile.avatar,
      level: post.exp.level,
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
  }

  // Static method to get all posts for the home feed
  static async getHomePosts(userId, page, limit) {
    // Get all following user IDs
    const relatedUsers = await UserFollowRepository.findByFollowerId(userId);
    const followingIds = relatedUsers.map((user) => user.following_id);
    followingIds.push(userId); // Include the current user

    if (followingIds.length === 0) return [];

    // Pagination setup
    const offset = (page - 1) * limit;

    // Get posts from related users with pagination
    const relatedPosts = await UserPostRepository.findByUserIdsPaginated(followingIds, offset, limit);
    if (relatedPosts.length === 0) return [];

    // Get all post IDs
    const postIds = relatedPosts.map((post) => post.id);

    // Fetch all related data in batches
    const [postImages, postTags, postLikeCounts, postCommentCounts, postLikeStatuses] = await Promise.all([
      PostImageRepository.findByPostIds(postIds),
      PostTagRepository.findByPostIds(postIds),
      PostLikeRepository.countByPostIds(postIds),
      PostCommentRepository.countByPostIds(postIds),
      PostLikeRepository.getStatuses(userid, postIds),
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
      username: post.profile.username,
      avatar: post.profile.avatar,
      level: post.exp.level,
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
  }

  // Static method to get a single post with all details
  static async getPostDetails(postId) {
    // Get post by postId
    const post = await UserPostRepository.findById(postId);
    if (!post) {
      return null;
    }

    // Get all necessary post data in one go
    const [postImages, postTags, postLikeCount, postCommentCount, user, userProfile, userExp] = await Promise.all([
      PostImageRepository.findByPostId(post.id),
      PostTagRepository.findByPostId(post.id),
      PostLikeRepository.countByPostId(post.id),
      PostCommentRepository.countByPostId(post.id),
      UserRepository.findById(post.user_id),
      UserProfileRepository.findByUserId(post.user_id),
      UserExpRepository.findByUserId(post.user_id),
    ]);

    // Ambil semua tag ID dari `postTags`
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
      commentCount: postCommentCount || 0,
    };
  }

  // Static method to create a new post
  static async createPost(userId, title, description, tags, imagePaths, type) {
    // Simpan post baru
    const post = await UserPostRepository.create(userId, title, description, type);

    // Cari atau buat tags
    const createdTags = await Promise.all(tags.map((tag) => TagRepository.findOrCreate(tag)));

    // Hubungkan tags dengan post
    const postTags = await Promise.all(createdTags.map((tag) => PostTagRepository.create(post.id, tag.id)));

    // Simpan path gambar ke database
    const postImages = await Promise.all(imagePaths.map((imagePath) => PostImageRepository.create(post.id, imagePath)));

    return { post, postTags, postImages };
  }

  // Static method to update a post
  static async updatePost(postId, title, description, tags, images, type) {
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
  }

  // Static method to delete a post
  static async deletePost(postId) {
    // Delete the post
    const post = await UserPostRepository.delete(postId);

    // Delete post tags
    const postTags = await PostTagRepository.deleteByPostId(postId);

    // Delete post images
    const postImages = await PostImageRepository.deleteByPostId(postId);

    return { post, postTags, postImages };
  }
}

// Export the UserPostService class
module.exports = UserPostService;
