// Import model
const PostLike = require("../models/PostLike");

class PostLikeRepository {
  // Get all post likes
  static async findAll() {
    const postLikes = await PostLike.query();
    return postLikes;
  }

  // Get post like by id
  static async findById(id) {
    const postLike = await PostLike.query().findOne({ id });
    return postLike;
  }

  // Get post like by post id
  static async findByPostId(post_id) {
    const postLikes = await PostLike.query().where({ post_id });
    return postLikes;
  }

  // Get post like by user id
  static async findByUserId(user_id) {
    const postLikes = await PostLike.query().where({ user_id });
    return postLikes;
  }

  // Get post like status by post id and user id
  static async getStatuses(user_id, post_ids) {
    const results = await PostLike.query().select("post_id").where("user_id", user_id).whereIn("post_id", post_ids);
    return results;
  }

  // Create a new post like
  static async create(post_id, user_id) {
    const postLike = await PostLike.query().insert({ post_id, user_id });
    return postLike;
  }

  // Delete a post like
  static async delete(post_id, user_id) {
    const postLike = await PostLike.query().findOne({ post_id, user_id });
    if (!postLike) {
      return null;
    }
    await PostLike.query().findOne({ post_id, user_id }).delete();
    return postLike;
  }

  // Count post likes by post id
  static async countByPostId(post_id) {
    const result = await PostLike.query().count("post_id").where({ post_id });
    return result?.count || 0;
  }

  // Count post likes by post ids
  static async countByPostIds(post_ids) {
    const results = await PostLike.query().select("post_id").count("* as count").whereIn("post_id", post_ids).groupBy("post_id");
    return results;
  }

  // Count post likes by user id
  static async countByUserId(user_id) {
    // Get all postids by user id
    const postids = await PostLike.query().select("post_id").where({ user_id });
    // Count all post likes from all postids
    const result = await PostLike.query().count("post_id").whereIn("post_id", postids);
    return result?.count || 0;
  }
}

module.exports = PostLikeRepository;
