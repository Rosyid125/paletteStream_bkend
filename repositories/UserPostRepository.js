// Import model
const UserPost = require("../models/UserPost");
const db = require("../config/db");

class UserPostRepository {
  // Get all user posts
  static async findAll() {
    const userPosts = await UserPost.query();
    return userPosts;
  }

  // Get user post by id
  static async findById(id) {
    const userPost = await UserPost.query().findOne({ id });
    return userPost;
  }

  // Get user post by user id
  static async findByUserId(user_id) {
    const userPosts = await UserPost.query().where({ user_id });
    return userPosts;
  }

  // Create a new user post
  static async create(user_id, content) {
    const userPost = await UserPost.query().insert({ user_id, content });
    return userPost;
  }

  // Update user post
  static async update(id, content) {
    const userPost = await UserPost.query().findOne({ id });
    if (!userPost) {
      return null;
    }
    await UserPost.query().findOne({ id }).patch({ content });
    return userPost;
  }

  // Delete a user post
  static async delete(id) {
    const userPost = await UserPost.query().findOne({ id });
    if (!userPost) {
      return null;
    }
    await UserPost.query().findOne({ id }).delete();
    return userPost;
  }
}

module.exports = UserPostRepository;
