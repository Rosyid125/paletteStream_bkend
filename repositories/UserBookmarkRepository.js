// Import model
const UserBookmark = require("../models/UserBookmark");
// For error handling
const currentRepo = "UserBookmarkRepository";

// Create a class for UserBookmarkRepository
class UserBookmarkRepository {
  // Get all id posts that are bookmarked by user id
  static async findPostIdsByUserId(user_id, offset, limit) {
    try {
      const postids = await UserBookmark.query().select("post_id").where({ user_id }).offset(offset).limit(limit);
      return postids;
    } catch (error) {
      throw error;
    }
  }

  // Get by user id and post id
  static async findByUserIdAndPostId(post_id, user_id) {
    try {
      const userBookmark = await UserBookmark.query().findOne({ post_id, user_id });
      return userBookmark;
    } catch (error) {
      throw error;
    }
  }

  // Get all user bookmark status by post ids and user id
  static async getStatuses(post_ids, user_id) {
    try {
      const result = await UserBookmark.query().select("post_id").whereIn("post_id", post_ids).where({ user_id });
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Create a new post bookmark
  static async create(user_id, post_id) {
    try {
      const userBookmark = await UserBookmark.query().insert({ user_id, post_id });
      return userBookmark;
    } catch (error) {
      throw error;
    }
  }

  // Delete a post bookmark
  static async delete(user_id, post_id) {
    try {
      const userBookmark = await UserBookmark.query().delete().where({ user_id, post_id });
      return userBookmark;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserBookmarkRepository;
