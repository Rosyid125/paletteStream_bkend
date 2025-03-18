// Import model
const CommentReply = require("../models/CommentReply");
const db = require("../config/db");

class CommentReplyRepository {
  // Get all comment replies
  static async findAll() {
    const commentReplies = await CommentReply.query();
    return commentReplies;
  }

  // Get comment reply by id
  static async findById(id) {
    const commentReply = await CommentReply.query().findById(id);
    return commentReply;
  }

  // Get comment replies by comment id
  static async findByCommentId(comment_id) {
    const commentReplies = await CommentReply.query().where({ comment_id });
    return commentReplies;
  }

  // Create a new comment reply
  static async create(comment_id, user_id, content) {
    const commentReply = await CommentReply.query().insert({ comment_id, user_id, content });
    return commentReply;
  }

  // Delete comment reply
  static async delete(id) {
    const commentReply = await CommentReply.query().findById(id);
    if (!commentReply) {
      return null;
    }
    await CommentReply.query().deleteById(id);
    return commentReply;
  }

  // Count comment replies by comment id
  static async countByCommentId(comment_id) {
    const count = await CommentReply.query().count("comment_id").where({ comment_id });
    return count;
  }
}

module.exports = CommentReplyRepository;
