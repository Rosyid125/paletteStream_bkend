// Import model
const PostTags = require("../models/PostTags");
const db = require("../config/db");

class PostTagsRepository {
  // Get all post tags
  static async findAll() {
    const postTags = await PostTags.query();
    return postTags;
  }

  // Get post tag by id
  static async findById(id) {
    const postTag = await PostTags.query().findOne({ id });
    return postTag;
  }

  // Get post tag by post id
  static async findByPostId(post_id) {
    const postTags = await PostTags.query().where({ post_id });
    return postTags;
  }

  // Create a new post tag
  static async create(post_id, tag_id) {
    const postTag = await PostTags.query().insert({ post_id, tag_id });
    return postTag;
  }

  // Delete a post tag
  static async delete(post_id, tag_id) {
    const postTag = await PostTags.query().findOne({ post_id, tag_id });
    if (!postTag) {
      return null;
    }
    await PostTags.query().findOne({ post_id, tag_id }).delete();
    return postTag;
  }
}

module.exports = PostTagsRepository;
