// Import model
const PostImage = require("../models/PostImage");
// For error handling
const currentRepo = "PostImageRepository";

class PostImageRepository {
  // Get all post images
  static async findAll() {
    try {
      const postImages = await PostImage.query();
      return postImages;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Get post image by id
  static async findById(id) {
    try {
      const postImage = await PostImage.query().findOne({ id });
      return postImage;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Get post image by post id
  static async findByPostId(post_id) {
    try {
      const postImages = await PostImage.query().where({ post_id });
      return postImages;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Get post images by post ids
  static async findByPostIds(post_ids) {
    try {
      const results = await PostImage.query().select("post_id", "image_url").whereIn("post_id", post_ids);
      return results;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Create a new post image
  static async create(post_id, image_url) {
    try {
      const postImage = await PostImage.query().insert({ post_id, image_url });
      return postImage;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Delete a post image
  static async deleteByPostId(post_id) {
    try {
      const postImages = await PostImage.query().where({ post_id });
      if (!postImages.length) {
        return null;
      }
      await PostImage.query().where({ post_id }).delete();
      return postImages;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }
}

module.exports = PostImageRepository;
