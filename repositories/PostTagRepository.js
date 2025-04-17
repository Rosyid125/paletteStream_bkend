// Import model
const PostTag = require("../models/PostTag");
const currentRepo = "PostTagRepository";

class PostTagRepository {
  // Get all post tags
  static async findAll() {
    try {
      const PostTags = await PostTag.query();
      return PostTags;
    } catch (error) {
      throw error;
    }
  }

  // Get post tag by id
  static async findById(id) {
    try {
      const postTag = await PostTag.query().findOne({ id });
      return postTag;
    } catch (error) {
      throw error;
    }
  }

  // Get post tag by post id
  static async findByPostId(post_id) {
    try {
      const postTags = await PostTag.query().where({ post_id });
      return postTags;
    } catch (error) {
      throw error;
    }
  }

  // Get post tags by post ids
  static async findByPostIds(post_ids) {
    try {
      const results = await PostTag.query().join("tags", "tags.id", "post_tags.tag_id").select("post_tags.post_id", "tags.name").whereIn("post_tags.post_id", post_ids);
      return results;
    } catch (error) {
      throw error;
    }
  }

  // Create a new post tag
  static async create(post_id, tag_id) {
    try {
      const postTag = await PostTag.query().insert({ post_id, tag_id });
      return postTag;
    } catch (error) {
      throw error;
    }
  }

  // Delete post tags by post id
  static async deleteByPostId(post_id) {
    try {
      const postTags = await PostTag.query().where({ post_id });
      if (postTags.length === 0) {
        return null;
      }
      await PostTag.query().where({ post_id }).delete();
      return postTags;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = PostTagRepository;
