// Import model
const PostTag = require("../models/PostTag");
const db = require("../config/db");

class PostTagRepository {
  // Get all post tags
  static async findAll() {
    const PostTag = await PostTag.query();
    return postTags;
  }

  // Get post tag by id
  static async findById(id) {
    const postTag = await PostTag.query().findOne({ id });
    return postTag;
  }

  // Get post tag by post id
  static async findByPostId(post_id) {
    const postTags = await PostTag.query().where({ post_id });
    return postTags;
  }

  // Create a new post tag
  static async create(post_id, tag_id) {
    const postTag = await PostTag.query().insert({ post_id, tag_id });
    return postTag;
  }

  // Delete post tags by post id
  static async deleteByPostId(post_id) {
    const postTags = await PostTag.query().where({ post_id });
    if (postTags.length === 0) {
      return null;
    }
    await PostTag.query().where({ post_id }).delete();
    return postTags;
  }
}

module.exports = PostTagRepository;
