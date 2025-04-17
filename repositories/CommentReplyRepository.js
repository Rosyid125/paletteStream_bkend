// Import model
const CommentReply = require("../models/CommentReply");
const PostComment = require("../models/PostComment");
// For error handling
const currentRepo = "CommentReplyRepository";

class CommentReplyRepository {
  // Get all comment replies
  static async findAll() {
    try {
      const commentReplies = await CommentReply.query();
      return commentReplies;
    } catch (error) {
      throw error;
    }
  }

  // Get comment reply by id
  static async findById(id) {
    try {
      const commentReply = await CommentReply.query().findById(id);
      return commentReply;
    } catch (error) {
      throw error;
    }
  }

  // Get comment replies by comment id
  static async findByCommentId(comment_id, offset, limit) {
    try {
      const commentReplies = await CommentReply.query().withGraphFetched("user.[profile,experience]").where({ comment_id }).offset(offset).limit(limit);
      return commentReplies;
    } catch (error) {
      throw error;
    }
  }

  // Create a new comment reply
  static async create(comment_id, user_id, content) {
    try {
      // Get post id by comment id
      const post = await PostComment.query().findById(comment_id);

      // Spesifically get the post id
      const postId = post.post_id;

      // Insert new comment reply
      const commentReply = await CommentReply.query().insert({
        post_id: postId,
        comment_id,
        user_id,
        content,
      });
      return commentReply;
    } catch (error) {
      throw error;
    }
  }

  // Delete comment reply
  static async delete(id) {
    try {
      const commentReply = await CommentReply.query().findById(id);
      if (!commentReply) {
        return null;
      }
      await CommentReply.query().deleteById(id);
      return commentReply;
    } catch (error) {
      throw error;
    }
  }

  // Count comment replies by post id (Untuk single post fetch)
  static async countByPostId(postId) {
    try {
      // Count comment replies by post id
      const result = await CommentReply.query().where({ post_id: postId }).count("post_id as count"); // Alias 'count'

      // Return the count
      return result[0].count;
    } catch (error) {
      throw error;
    }
  }

  // Count comment replies by post ids (Untuk multiple posts fetch)
  static async countByPostIds(postIds) {
    try {
      const result = await CommentReply.query()
        .select("post_id")
        .count("* as count") // Alias 'count'
        .whereIn("post_id", postIds)
        .groupBy("post_id");

      return result; // Formatnya sama: [{ post_id: 1, count: 2 }, { post_id: 2, count: 4 }]
    } catch (error) {
      throw error;
    }
  }

  // Count comment replies by comment ids
  static async countByCommentIds(commentIds) {
    try {
      const result = await CommentReply.query()
        .select("comment_id")
        .count("* as count") // Alias 'count'
        .whereIn("comment_id", commentIds)
        .groupBy("comment_id");

      return result; // Formatnya sama: [{ comment_id: 1, count: 2 }, { comment_id: 2, count: 4 }]
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CommentReplyRepository;
