const UserPostService = require("../services/UserPostService");

class UserPostController {
  // Get all current user posts
  static async getUserPost(req, res) {
    try {
      const { userId } = req.params;

      const userPosts = await UserPostService.getUserPosts(userId);

      if (!userPosts) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      res.json({ success: true, data: userPosts });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
  // Get all posts
  static async getAllPost(req, res) {
    try {
      const userPosts = await UserPostService.getAllPosts();

      res.json({ success: true, data: userPosts });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
  // Create a user post
  static async createPost(req, res) {
    try {
      let { userId } = req.params;
      const { title, description, tags, images, type } = req.body;

      // Convert userId to an integer
      userId = parseInt(userId); // Reassign userId to integer after destructuring

      const userPost = await UserPostService.createPost(userId, title, description, tags, images, type);

      res.json({ success: true, data: userPost });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
  // Edit a user post
  static async updatePost(req, res) {
    try {
      let { postId } = req.params;
      const { title, description, tags, images, type } = req.body;

      // Convert postId to an integer
      postId = parseInt(postId);

      const userPost = await UserPostService.updatePost(postId, title, description, tags, images, type);

      if (!userPost) {
        return res.status(404).json({ success: false, message: "Post not found" });
      }

      res.json({ success: true, data: userPost });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
  // Delete a user post
  static async deletePost(req, res) {
    try {
      const { postId } = req.params;

      const userPost = await UserPostService.deletePost(postId);

      if (!userPost) {
        return res.status(404).json({ success: false, message: "Post not found" });
      }

      res.json({ success: true, message: "Post deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = UserPostController;
