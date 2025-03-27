const PostCommentService = require("../services/PostCommentService");

//import logger
const logger = require("../utils/winstonLogger");

class PostCommentController {
  // Get all post comments by post id
  static async getComments(req, res) {
    try {
      // Get post id from request
      let postId = req.params.postId;

      // Turn params into integer
      postId = parseInt(postId);

      // Get pagination infos
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      // Get all post comments by post id
      const postComments = await PostCommentService.findByPostId(postId, page, limit);

      res.json({ success: true, data: postComments });
    } catch (error) {
      // Tangkap error dan log ke file
      logger.error(`Error: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      res.status(500).json({ success: false, messege: "An unexpected error occurred." });
    }
  }

  // Create a new post comment
  static async create(req, res) {
    try {
      // Get post id, user id, and content from request
      const { post_id, user_id, content } = req.body;

      // Create a new post comment
      const postComment = await PostCommentService.create(post_id, user_id, content);

      res.json({ success: true, data: postComment });
    } catch (error) {
      // Tangkap error dan log ke file
      logger.error(`Error: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      res.status(500).json({ success: false, messege: "An unexpected error occurred." });
    }
  }

  // Delete a post comment
  static async delete(req, res) {
    try {
      // Get post comment id from request
      const id = req.params.id;

      // Delete a post comment
      const postComment = await PostCommentService.delete(id);

      res.json({ success: true, data: postComment });
    } catch (error) {
      // Tangkap error dan log ke file
      logger.error(`Error: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      res.status(500).json({ success: false, messege: "An unexpected error occurred." });
    }
  }

  // Get all comment replies by post comment id
  static async getCommentReplies(req, res) {
    try {
      // Get post comment id from request
      let postCommentId = req.params.postCommentId;

      // Turn post comment id into int
      postCommentId = parseInt(postCommentId);

      // Get pagination infos
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      // Get all post comment replies based on post comment id
      const commentReplies = await PostCommentService.getCommentReplies(postCommentId, page, limit);

      // Return comment replies
      res.json({ success: true, data: commentReplies });
    } catch (error) {
      // Tangkap error dan log ke file
      logger.error(`Error: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      res.status(500).json({ success: false, messege: "An unexpected error occurred." });
    }
  }

  // Create a new comment reply
  static async createCommentReply(req, res) {
    try {
      // Get post comment id, user id, and content from request
      const { post_comment_id, user_id, content } = req.body;

      // Create a new comment reply
      const commentReply = await PostCommentService.createCommentReply(post_comment_id, user_id, content);

      res.json({ success: true, data: commentReply });
    } catch (error) {
      // Tangkap error dan log ke file
      logger.error(`Error: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      res.status(500).json({ success: false, messege: "An unexpected error occurred." });
    }
  }

  // Delete a comment reply
  static async deleteCommentReply(req, res) {
    try {
      // Get comment reply id from request
      const id = req.params.id;

      // Delete a comment reply
      const commentReply = await PostCommentService.deleteCommentReply(id);

      res.json({ success: true, data: commentReply });
    } catch (error) {
      // Tangkap error dan log ke file
      logger.error(`Error: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      res.status(500).json({ success: false, messege: "An unexpected error occurred." });
    }
  }
}

module.exports = PostCommentController;
