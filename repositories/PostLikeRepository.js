// Import model
const PostLike = require("../models/PostLike");
// For error handling
const currentRepo = "PostLikeRepository";

class PostLikeRepository {
  // Get all postids that are liked by user id
  static async findPostIdsByUserId(user_id, offset, limit) {
    try {
      const postids = await PostLike.query().select("post_id").where({ user_id }).orderBy("created_at", "desc").offset(offset).limit(limit);
      return postids;
    } catch (error) {
      throw error;
    }
  }

  // Get all post likes
  static async findAll() {
    try {
      const postLikes = await PostLike.query();
      return postLikes;
    } catch (error) {
      throw error;
    }
  }

  // Get post like by id
  static async findById(id) {
    try {
      const postLike = await PostLike.query().findOne({ id });
      return postLike;
    } catch (error) {
      throw error;
    }
  }

  // Get post like by post id
  static async findByPostId(post_id, offset, limit) {
    try {
      const postLikes = await PostLike.query().withGraphFetched("user.[profile,experience]").where({ post_id }).offset(offset).limit(limit);
      return postLikes;
    } catch (error) {
      throw error;
    }
  }

  // Get post like by post id (without pagination for achievement system)
  static async findByPostIdAll(post_id) {
    try {
      const postLikes = await PostLike.query().where({ post_id });
      return postLikes;
    } catch (error) {
      throw error;
    }
  }

  // Get post like by user id
  static async findByUserId(user_id) {
    try {
      const postLikes = await PostLike.query().where({ user_id });
      return postLikes;
    } catch (error) {
      throw error;
    }
  }

  // Get post like by user id and post id
  static async findByUserIdAndPostId(post_id, user_id) {
    try {
      const postLike = await PostLike.query().findOne({ post_id, user_id });

      return postLike;
    } catch (error) {
      throw error;
    }
  }

  // Get post like status by post id and user id
  static async getStatus(post_id, user_id) {
    try {
      const result = await PostLike.query().findOne({ post_id, user_id });
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Get post like status by post ids and user id
  static async getStatuses(user_id, post_ids) {
    try {
      const results = await PostLike.query().select("post_id").where("user_id", user_id).whereIn("post_id", post_ids);
      return results;
    } catch (error) {
      throw error;
    }
  }

  // Create a new post like
  static async create(post_id, user_id) {
    try {
      const postLike = await PostLike.query().insert({ post_id, user_id });
      return postLike;
    } catch (error) {
      throw error;
    }
  }

  // Delete a post like
  static async delete(post_id, user_id) {
    try {
      const postLike = await PostLike.query().findOne({ post_id, user_id });
      if (!postLike) {
        return null;
      }
      await PostLike.query().findOne({ post_id, user_id }).delete();
      return postLike;
    } catch (error) {
      throw error;
    }
  }

  // Count post likes by post id
  static async countByPostId(post_id) {
    try {
      const result = await PostLike.query().count("post_id").where({ post_id });
      return result?.count || 0;
    } catch (error) {
      throw error;
    }
  }

  // Count post likes by post ids
  static async countByPostIds(post_ids) {
    try {
      const results = await PostLike.query().select("post_id").count("* as count").whereIn("post_id", post_ids).groupBy("post_id");
      return results;
    } catch (error) {
      throw error;
    }
  }

  // Count post likes by user id
  static async countByUserId(user_id) {
    try {
      // Get all postids by user id
      const postids = await PostLike.query().select("post_id").where({ user_id });
      // Pluuk with map
      const pluckedPostIds = postids.map((post) => post.post_id);
      // Count total post likes across all post_ids
      const result = await PostLike.query().whereIn("post_id", pluckedPostIds).count("post_id as total");

      return Number(result[0]?.total || 0);
    } catch (error) {
      throw error;
    }
  }

  // Count post likes received by user (from posts created by the user)
  static async countLikesReceivedByUserId(user_id) {
    try {
      // Join dengan user_posts untuk mendapatkan likes dari post-post yang dibuat user
      const result = await PostLike.query().join("user_posts", "post_likes.post_id", "user_posts.id").where("user_posts.user_id", user_id).count("* as total");

      return Number(result[0]?.total || 0);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = PostLikeRepository;
