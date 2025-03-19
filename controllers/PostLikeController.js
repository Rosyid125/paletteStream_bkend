const PostLikeService = require("../services/PostLikeService");

class PostLikeController {
  // Get all post likes by post id
  static async getAll(req, res) {
    try {
      const { postId } = req.params;

      const postLikes = await PostLikeService.findByPostId(postId);

      if (!postLikes) {
        return res.status(404).json({ success: false, message: "Post not found" });
      }

      res.json({ success: true, data: postLikes });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
  // Create a new post like
  static async create(req, res) {
    try {
      const { postId, userId } = req.body;

      const postLike = await PostLikeService.create(postId, userId);

      res.json({ success: true, data: postLike });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
  // Delete a post like
  static async delete(req, res) {
    try {
      const { postId, userId } = req.body;

      const postLike = await PostLikeService.delete(postId, userId);

      if (!postLike) {
        return res.status(404).json({ success: false, message: "Like not found" });
      }

      res.json({ success: true, message: "Like deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = PostLikeController;
