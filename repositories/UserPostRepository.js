// Import model
const UserPost = require("../models/UserPost");
// For error handling
const currentRepo = "UserPostRepository";

class UserPostRepository {
  // Get all user posts
  static async findAll(offset, limit) {
    try {
      const userPosts = await UserPost.query()
        .withGraphJoined("user.[profile,experience]") // Ambil profile dan exp dari relasi user
        .orderBy("created_at", "desc")
        .offset(offset)
        .limit(limit);

      return userPosts;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Get user post by id
  static async findById(id) {
    try {
      const userPost = await UserPost.query().findOne({ id });
      return userPost;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Get user post by user id
  static async findByUserId(user_id, offset, limit) {
    try {
      const userPosts = await UserPost.query().where({ user_id }).orderBy("created_at", "desc").offset(offset).limit(limit);
      return userPosts;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Get user posts by users ids (with pagination, order by created_at desc)
  static async findByUsersIds(user_ids, offset, limit) {
    try {
      const userPosts = await UserPost.query()
        .withGraphFetched("user.[profile,experience]") // Ambil profile dan exp dari relasi user
        .whereIn("user_id", user_ids)
        .orderBy("created_at", "desc")
        .offset(offset)
        .limit(limit);

      return userPosts;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Create a new user post
  static async create(user_id, title, description, type) {
    try {
      const userPost = await UserPost.query().insert({
        user_id,
        title,
        description,
        type,
      });
      return userPost;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Count user posts by user id
  static async countByUserId(user_id) {
    try {
      const result = await UserPost.query().where({ user_id }).count("user_id as count").first();
      return result?.count || 0;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Update user post
  static async update(id, title, description, type) {
    try {
      const userPost = await UserPost.query().findOne({ id }).patch({ title, description, type });
      return userPost;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Delete a user post
  static async delete(id) {
    try {
      const userPost = await UserPost.query().findOne({ id });
      if (!userPost) {
        return null;
      }
      await UserPost.query().findOne({ id }).delete();
      return userPost;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }
}

module.exports = UserPostRepository;
