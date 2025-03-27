// Import model
const PostComment = require("../models/PostComment");
const currentRepo = "PostCommentRepository";

class PostCommentRepository {
  // Get all post comments
  static async findAll() {
    try {
      const postComments = await PostComment.query();
      return postComments;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Get post comment by id
  static async findById(id) {
    try {
      const postComment = await PostComment.query().findOne({ id });
      return postComment;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Get post comments by post id with pagination
  static async findByPostId(post_id, offset, limit) {
    try {
      const postComments = await PostComment.query().withGraphFetched("user.[profile,experience]").where({ post_id }).offset(offset).limit(limit);
      return postComments;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Get post comment by user id
  static async findByUserId(user_id) {
    try {
      const postComments = await PostComment.query().where({ user_id });
      return postComments;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Create a new post comment
  static async create(post_id, user_id, content) {
    try {
      const postComment = await PostComment.query().insert({ post_id, user_id, content });
      return postComment;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Delete a post comment
  static async delete(id) {
    try {
      const postComment = await PostComment.query().findOne({ id });
      if (!postComment) {
        return null;
      }
      await PostComment.query().findOne({ id }).delete();
      return postComment;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Count post comments by post id
  static async countByPostId(post_id) {
    try {
      const result = await PostComment.query()
        .count("post_id as count") // Alias 'count'
        .where({ post_id });

      // Return the count
      return result[0].count;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Count post comments by post ids
  static async countByPostIds(post_ids) {
    try {
      const result = await PostComment.query().select("post_id").count("* as count").whereIn("post_id", post_ids).groupBy("post_id");
      return result;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Count post comments by user id
  static async countByUserId(user_id) {
    try {
      const postids = await PostComment.query().select("post_id").where({ user_id });
      const result = await PostComment.query().count("post_id").whereIn("post_id", postids);
      return result?.count || 0;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Get post comment ids from post id
  static async getPostCommentIdsByPostId(post_id) {
    try {
      const postComments = await PostComment.query().select("id").where({ post_id });
      return postComments;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Get post comment ids from post ids
  static async getPostCommentIdsByPostIds(post_ids) {
    try {
      const postComments = await PostComment.query().select("id").whereIn("post_id", post_ids);
      return postComments;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }
}

module.exports = PostCommentRepository;
