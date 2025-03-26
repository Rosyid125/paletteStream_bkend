const PostLikeRepository = require("../repositories/PostLikeRepository");

class PostLikeService {
  // Get all post likes by post id
  static async findByPostId(post_id) {
    return PostLikeRepository.findByPostId(post_id);
  }

  // Create a new post like
  static async create(post_id, user_id) {
    // Create a new post like
    const postLike = await PostLikeRepository.create(post_id, user_id);
    if (!postLike) {
      throw new Error("Post like not found");
    }

    // Return post like
    return postLike;
  }

  // Delete a post like
  static async delete(postId, userId) {
    // Delete a post like by post id
    const postLike = await PostLikeRepository.delete(postId, userId);
    if (!postLike) {
      throw new Error("Post ID not found");
    }

    // Return deleted post like
    return postLike;
  }
}

module.exports = PostLikeService;
