// Import all necessary repositories
const UserPostRepository = require("../repositories/UserPostRepository");
const PostImageRepository = require("../repositories/PostImageRepository");
const PostTagRepository = require("../repositories/PostTagRepository");
const UserRepository = require("../repositories/UserRepository");
const UserProfileRepository = require("../repositories/UserProfileRepository");
const UserExpRepository = require("../repositories/UserExpRepository");
const TagRepository = require("../repositories/TagRepository");

// Import needed services
const PostCommentService = require("./PostCommentService");
const PostLikeService = require("./PostLikeService");

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

  // Static method to get all posts
  static async getAllPosts() {
    // Get all posts
    const posts = await UserPostRepository.findAll();
    if (!posts || posts.length === 0) {
      return null;
    }

    // Get all images, tags, like counts, and comment counts for all posts
    const postsWithDetails = [];

    for (const post of posts) {
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
      const user = await UserRepository.findById(post.user_id);

      // Get user profile information
      const userProfile = await UserProfileRepository.findByUserId(post.user_id);

      // Get user experience information
      const userExp = await UserExpRepository.findByUserId(post.user_id);

      // Assemble the data for the current post
      postsWithDetails.push({
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
        tags: postTags.map((tag) => tag.name),
        likeCount: postLikeCount || 0,
        commentCount: postCommentCount || 0,
      });
    }

    return postsWithDetails;
  }

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
