const PostLikeRepository = require("../repositories/PostLikeRepository");
const customError = require("../errors/customError");

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
      throw error;
    }
  }

  // Create and delete a post like
  static async createDelete(postId, userId) {
    try {
      // Check if post like already exists
      const existingLike = await PostLikeRepository.findByUserIdAndPostId(postId, userId);

      if (existingLike) {
        // If it exists, delete the like
        await PostLikeRepository.delete(postId, userId);
        return { message: "Post like deleted" };
      }

      // Create a new post like
      const postLike = await PostLikeRepository.create(postId, userId);

      // Check if post like was created successfully
      if (!postLike) {
        throw new customError("Post like cannot be created");
      } else {
        // If it was created successfully, return the post like
        const postLikeData = {
          id: postLike.id,
          user_id: postLike.user_id,
          post_id: postLike.post_id,
          created_at: postLike.created_at,
          updated_at: postLike.updated_at,
        };

        // Return success message with post like data
        return { message: "Post like created", data: postLikeData };
      }
    } catch (error) {
      throw error;
    }
  }
}

module.exports = PostLikeService;
