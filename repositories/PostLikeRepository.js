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
    const count = await PostLike.query().count("post_id").where({ post_id });
    return count;
  }
}

module.exports = PostLikeRepository;
