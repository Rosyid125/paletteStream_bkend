// Import model
const CommentReply = require("../models/CommentReply");
const PostComment = require("../models/PostComment");
// For error handling
const currentRepo = "PostCommentRepository";

class PostCommentRepository {
  // Get all post comments
  static async findAll() {
    try {
      const postComments = await PostComment.query();
      return postComments;
    } catch (error) {
      throw error;
    }
  }

  // Get post comment by id
  static async findById(id) {
    try {
      const postComment = await PostComment.query().findOne({ id });
      return postComment;
    } catch (error) {
      throw error;
    }
  }

  // Get post comments by post id with pagination
  static async findByPostId(post_id, offset, limit) {
    try {
      const postComments = await PostComment.query().withGraphFetched("user.[profile,experience]").where({ post_id }).offset(offset).limit(limit);
      return postComments;
    } catch (error) {
      throw error;
    }
  }

  // Get post comment by user id
  static async findByUserId(user_id) {
    try {
      const postComments = await PostComment.query().where({ user_id });
      return postComments;
    } catch (error) {
      throw error;
    }
  }

  // Create a new post comment
  static async create(post_id, user_id, content) {
    try {
      const postComment = await PostComment.query().insert({ post_id, user_id, content });
      return postComment;
    } catch (error) {
      throw error;
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
      throw error;
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
      throw error;
    }
  }

  // Count post comments by post ids
  static async countByPostIds(post_ids) {
    try {
      const result = await PostComment.query().select("post_id").count("* as count").whereIn("post_id", post_ids).groupBy("post_id");
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Count post comments by user id
  static async countByUserId(user_id) {
    try {
      const postids = await PostComment.query().select("post_id").where({ user_id });

      // map postids to array
      const postidsArray = postids.map((post) => post.post_id);

      const result = await PostComment.query().count("post_id as total").whereIn("post_id", postidsArray);

      // for comment replies
      const result2 = await CommentReply.query().count("post_id as total").whereIn("post_id", postidsArray);

      // sum the total of post comments and comment replies
      const total = Number(result[0]?.total || 0) + Number(result2[0]?.total || 0);

      return total;
    } catch (error) {
      throw error;
    }
  }

  // Count comments received by user (from posts created by the user)
  static async countCommentsReceivedByUserId(user_id) {
    try {
      // Join dengan user_posts untuk mendapatkan comments dari post-post yang dibuat user
      const result = await PostComment.query().join("user_posts", "post_comments.post_id", "user_posts.id").where("user_posts.user_id", user_id).count("* as total");

      // For comment replies on posts created by the user
      const result2 = await CommentReply.query().join("user_posts", "comment_replies.post_id", "user_posts.id").where("user_posts.user_id", user_id).count("* as total");

      // Sum the total of post comments and comment replies received
      const total = Number(result[0]?.total || 0) + Number(result2[0]?.total || 0);
      return total;
    } catch (error) {
      throw error;
    }
  }

  // Get post comment ids from post id
  static async getPostCommentIdsByPostId(post_id) {
    try {
      const postComments = await PostComment.query().select("id").where({ post_id });
      return postComments;
    } catch (error) {
      throw error;
    }
  }

  // Get post comment ids from post ids
  static async getPostCommentIdsByPostIds(post_ids) {
    try {
      const postComments = await PostComment.query().select("id").whereIn("post_id", post_ids);
      return postComments;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = PostCommentRepository;
