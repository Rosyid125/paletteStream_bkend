const PostLikeService = require("../services/PostLikeService");
// import logger
const logger = require("../utils/winstonLogger");

class PostLikeController {
  // Get all post likes by post id
  static async getAll(req, res) {
    try {
      // Get post id from request
      let { postId } = req.params;

      // Turn params into integer
      postId = parseInt(postId);

      // Get page and limit from query
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      // Panggil service untuk mendapatkan semua like post
      const postLikes = await PostLikeService.findByPostId(postId, page, limit);

      if (!postLikes) {
        return res.status(404).json({ success: false, message: "Post not found" });
      }

      res.json({ success: true, data: postLikes });
    } catch (error) {
      // Tangkap error dan log ke file
      logger.error(`Error: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      res.status(500).json({ success: false, messege: "An unexpected error occurred." });
    }
  }
  // Create and delete a post like
  static async createDelete(req, res) {
    try {
      const { postId, userId } = req.body;

      const postLike = await PostLikeService.createDelete(postId, userId);

      res.json({ success: true, data: postLike });
    } catch (error) {
      // Tangkap error dan log ke file
      logger.error(`Error: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      res.status(500).json({ success: false, messege: "An unexpected error occurred." });
    }
  }
  // // Delete a post like
  // static async delete(req, res) {
  //   try {
  //     const { postId, userId } = req.body;

  //     const postLike = await PostLikeService.delete(postId, userId);

  //     if (!postLike) {
  //       return res.status(404).json({ success: false, message: "Like not found" });
  //     }

  //     res.json({ success: true, message: "Like deleted successfully" });
  //   } catch (error) {
  //     // Tangkap error dan log ke file
  //     logger.error(`Error: ${error.message}`, {
  //       stack: error.stack,
  //       timestamp: new Date().toISOString(),
  //     });

  //     res.status(500).json({ success: false, messege: "An unexpected error occurred." });
  //   }
  // }
}

module.exports = PostLikeController;
