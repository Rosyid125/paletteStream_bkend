// Import model
const PostComment = require("../models/PostComment");

class PostCommentRepository {
  // Get all post comments
  static async findAll() {
    const postComments = await PostComment.query();
    return postComments;
  }

  // Get post comment by id
  static async findById(id) {
    const postComment = await PostComment.query().findOne({ id });
    return postComment;
  }

  // Get post comment by post id
  static async findByPostId(post_id) {
    const postComments = await PostComment.query().where({ post_id });
    return postComments;
  }

  // Get post comment by user id
  static async findByUserId(user_id) {
    const postComments = await PostComment.query().where({ user_id });
    return postComments;
  }

  // Get post comments by post ids
  static async countByPostIds(post_ids) {
    const results = await PostComment.query().select("post_id").count("* as count").whereIn("post_id", post_ids).groupBy("post_id");
    return results;
  }

  // Create a new post comment
  static async create(post_id, user_id, content) {
    const postComment = await PostComment.query().insert({ post_id, user_id, content });
    return postComment;
  }

  // Delete a post comment
  static async delete(id) {
    const postComment = await PostComment.query().findOne({ id });
    if (!postComment) {
      return null;
    }
    await PostComment.query().findOne({ id }).delete();
    return postComment;
  }

  // Count post comments by post id
  static async countByPostId(post_id) {
    const result = await PostComment.query().count("post_id").where({ post_id });
    return result?.count || 0;
  }

  // Count post comments by user id
  static async countByUserId(user_id) {
    // Get all postids by user id
    const postids = await PostComment.query().select("post_id").where({ user_id });
    // Count all post comments from all postids
    const result = await PostComment.query().count("post_id").whereIn("post_id", postids);
    return result?.count || 0;
  }
}

module.exports = PostCommentRepository;
