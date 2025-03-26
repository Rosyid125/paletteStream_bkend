const PostCommentService = require("../services/PostCommentService");

class PostCommentController {
  // Get all post comments by post id
  static async getComments(req, res) {
    try {
      // Get post id from request
      const postId = req.params.postId;

      // Get pagination infos
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      // Get all post comments by post id
      const postComments = await PostCommentService.findByPostId(postId, page, limit);

      res.json(postComments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Create a new post comment
  static async create(req, res) {
    try {
      // Get post id, user id, and content from request
      const { post_id, user_id, content } = req.body;

      // Create a new post comment
      const postComment = await PostCommentService.create(post_id, user_id, content);
      res.json(postComment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Delete a post comment
  static async delete(req, res) {
    try {
      // Get post comment id from request
      const id = req.params.id;

      // Delete a post comment
      const postComment = await PostCommentService.delete(id);
      res.json(postComment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get all comment replies by post comment id
  static async getCommentReplies(req, res) {
    try {
      // Get post comment id from request
      const post_comment_id = req.params.post_comment_id;

      // Get all comment replies by post comment id
      const commentReplies = await PostCommentService.getCommentReplies(post_comment_id);
      res.json(commentReplies);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Create a new comment reply
  static async createCommentReply(req, res) {
    try {
      // Get post comment id, user id, and content from request
      const { post_comment_id, user_id, content } = req.body;

      // Create a new comment reply
      const commentReply = await PostCommentService.createCommentReply(post_comment_id, user_id, content);
      res.json(commentReply);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Delete a comment reply
  static async deleteCommentReply(req, res) {
    try {
      // Get comment reply id from request
      const id = req.params.id;

      // Delete a comment reply
      const commentReply = await PostCommentService.deleteCommentReply(id);
      res.json(commentReply);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = PostCommentController;
