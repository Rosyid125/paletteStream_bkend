const UserPostService = require("../services/UserPostService");
const upload = require("../utils/multerUtil");
// import logger
const logger = require("../utils/winstonLogger");

class UserPostController {
  // Get all current user posts
  static async getUserPost(req, res) {
    try {
      // Get user id from request
      let { userId } = req.params;

      // Make user id integer
      userId = parseInt(userId);

      // Get page and limit from query
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      // Panggil service untuk mendapatkan post user
      const userPosts = await UserPostService.getUserPosts(userId, page, limit);

      // Jika tidak ada post
      if (!userPosts) {
        return res.status(404).json({ success: false, message: "Posts not found" });
      }

      res.json({ success: true, data: userPosts });
    } catch (error) {
      // Tangkap error dan log ke file
      logger.error(`Error: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      res.status(500).json({ success: false, messege: "An unexpected error occurred." });
    }
  }
  // Get all posts
  static async getAllPost(req, res) {
    try {
      // Get page and limit from query
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      // Panggil service untuk mendapatkan semua post
      const userPosts = await UserPostService.getAllPosts(page, limit);

      // Jika tidak ada post
      if (!userPosts) {
        return res.status(404).json({ success: false, message: "Posts not found" });
      }

      res.json({ success: true, data: userPosts });
    } catch (error) {
      // Tangkap error dan log ke file
      logger.error(`Error: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      res.status(500).json({ success: false, messege: "An unexpected error occurred." });
    }
  }

  // Get home posts
  static async getHomePosts(req, res) {
    try {
      const { userId } = req.params;

      // Get page and limit from query
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      // Panggil service untuk mendapatkan home posts
      const homePosts = await UserPostService.getHomePosts(userId, page, limit);

      // Jika tidak ada home posts
      if (!homePosts) {
        return res.status(404).json({ success: false, message: "Posts not found" });
      }

      // Kirim response ke client
      res.json({ success: true, data: homePosts });
    } catch (error) {
      // Tangkap error dan log ke file
      logger.error(`Error: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      res.status(500).json({ success: false, messege: "An unexpected error occurred." });
    }
  }

  // Get a post detail
  static async getPostDetails(req, res) {
    try {
      const { postId } = req.params;

      // Panggil service untuk ini
      const post = await UserPostService.getPostDetails(postId);

      // Jika post tidak di temukan
      if (!post) {
        return res.status(404).json({ success: false, message: "Post not found" });
      }

      // Kirim response ke client
      res.json({ success: true, data: post });
    } catch (error) {
      // Tangkap error dan log ke file
      logger.error(`Error: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      res.status(500).json({ success: false, messege: "An unexpected error occurred." });
    }
  }

  // Create a user post
  static async createPost(req, res) {
    try {
      // Gunakan multer untuk menangani upload sebelum memanggil service
      upload.array("images", 10)(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ error: "File upload failed", details: err.message });
        }

        // Karena multer menggunakan callback, kita perlu try-catch di dalam callback.
        try {
          // Ambil data dari request parameter
          let { userId } = req.params;
          userId = parseInt(userId); // Pastikan userId berupa integer

          // Destructure data dari request body
          const { title, description, tags, type } = req.body;

          // Pastikan title & description ada agar tidak error
          if (!title || !description) {
            return res.status(400).json({ error: "Title and description are required" });
          }

          // Ambil path dari file yang diupload
          const imagePaths = req.files ? req.files.map((file) => file.path) : [];

          // Panggil service dengan data yang sudah diproses
          const newPost = await UserPostService.createPost(userId, title, description, tags, imagePaths, type);

          // Kirim response ke client
          res.json({ success: true, data: newPost });
        } catch (error) {
          logger.error(`Error: ${error.message}`, {
            stack: error.stack,
            timestamp: new Date().toISOString(),
          });

          res.status(500).json({ success: false, messege: "An unexpected error occurred." });
        }
      });
    } catch (error) {
      logger.error(`Unexpected Error: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      res.status(500).json({ success: false, messege: "An unexpected error occurred." });
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
      // Tangkap error dan log ke file
      logger.error(`Error: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      res.status(500).json({ success: false, messege: "An unexpected error occurred." });
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
      // Tangkap error dan log ke file
      logger.error(`Error: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      res.status(500).json({ success: false, messege: "An unexpected error occurred." });
    }
  }
}

module.exports = UserPostController;
