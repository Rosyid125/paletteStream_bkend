// Import model
const PostImage = require("../models/PostImage");
const db = require("../config/db");

class PostImageRepository {
  // Get all post images
  static async findAll() {
    const postImages = await PostImage.query();
    return postImages;
  }

  // Get post image by id
  static async findById(id) {
    const postImage = await PostImage.query().findOne({ id });
    return postImage;
  }

  // Get post image by post id
  static async findByPostId(post_id) {
    const postImages = await PostImage.query().where({ post_id });
    return postImages;
  }

  // Create a new post image
  static async create(post_id, image_url) {
    const postImage = await PostImage.query().insert({ post_id, image_url });
    return postImage;
  }

  // Delete a post image
  static async deleteByPostId(post_id) {
    const postImages = await PostImage.query().where({ post_id });
    if (!postImages.length) {
      return null;
    }
    await PostImage.query().where({ post_id }).delete();
    return postImages;
  }
}

module.exports = PostImageRepository;
