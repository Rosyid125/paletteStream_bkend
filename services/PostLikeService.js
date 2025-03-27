const PostLikeRepository = require("../repositories/PostLikeRepository");

// For error handling
const currentService = "PostLikeService";

class PostLikeService {
  // Get all post likes by post id
  static async findByPostId(postId, page, limit) {
    try {
      // Pagination setup
      const offset = (page - 1) * limit;

      // Get all post likes by post id
      const postLikes = await PostLikeRepository.findByPostId(postId, offset, limit);

      // Return post likes
      return postLikes.map((like) => ({
        id: like.id,
        user_id: like.user_id,
        username: like.user.profile.username,
        avatar: like.user.profile.avatar,
        level: like.user.experience.level,
      }));
    } catch (error) {
      throw new Error(`${currentService} Error: ${error.message}`);
    }
  }

  // Create a new post like
  static async create(postId, userId) {
    try {
      // Create a new post like
      const postLike = await PostLikeRepository.create(postId, userId);
      if (!postLike) {
        throw new Error(`${currentService} Error: Post like not found`);
      }

      // Return post like
      return postLike;
    } catch (error) {
      throw new Error(`${currentService} Error: ${error.message}`);
    }
  }

  // Delete a post like
  static async delete(postId, userId) {
    try {
      // Delete a post like by post id
      const postLike = await PostLikeRepository.delete(postId, userId);
      if (!postLike) {
        throw new Error(`${currentService} Error: Post ID not found`);
      }

      // Return deleted post like
      return postLike;
    } catch (error) {
      throw new Error(`${currentService} Error: ${error.message}`);
    }
  }
}

module.exports = PostLikeService;
