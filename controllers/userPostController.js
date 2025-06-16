const UserPostService = require("../services/UserPostService");
const { uploadArray } = require("../utils/multerCloudinaryUtil");
const { uploadPostImage, deleteImage, extractPublicId, isCloudinaryUrl } = require("../utils/cloudinaryUtil");
// import logger
const logger = require("../utils/winstonLogger");
const customError = require("../errors/customError");
const jwt = require("jsonwebtoken");

// Import path module
const path = require("path");

class UserPostController {
  // Get all current user posts
  static async getUserPost(req, res) {
    try {
      // Get user id from request
      let { userId } = req.params;

      // Make user id integer and validate
      userId = parseInt(userId);

      // Check if userId is valid
      if (isNaN(userId) || userId <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID provided",
        });
      }

      // Get current userId from token
      const currentUserId = req.user.id;

      // Get page and limit from query
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      // Panggil service untuk mendapatkan post user
      const userPosts = await UserPostService.getUserPosts(userId, currentUserId, page, limit);

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

  // Get random posts
  static async getRandomPosts(req, res) {
    try {
      // Get userId form token
      const token = req.cookies.accessToken; // Access the token from the cookies
      if (!token) {
        throw new customError("Unauthorized", 401);
      }

      // Verifikasi token akses
      const user = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      const userId = user.id; // Ambil userId dari token

      // Get page and limit from query
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      // Panggil service untuk mendapatkan random post
      const userPosts = await UserPostService.getRandomPosts(userId, page, limit);

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

      console.log("userId", userId);

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

  // Get all liked posts
  static async getLikedPosts(req, res) {
    try {
      const { userId } = req.params;
      // Get page and limit from query
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      // Panggil service untuk mendapatkan liked posts
      const likedPosts = await UserPostService.getLikedPosts(userId, page, limit);
      // Jika tidak ada liked posts
      if (!likedPosts) {
        return res.status(404).json({ success: false, message: "Posts not found" });
      }
      // Kirim response ke client
      res.json({ success: true, data: likedPosts });
    } catch (error) {
      // Tangkap error dan log ke file
      logger.error(`Error: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      res.status(500).json({ success: false, messege: "An unexpected error occurred." });
    }
  }

  // Get all bookmarked posts
  static async getBookmarkedPosts(req, res) {
    try {
      const { userId } = req.params;
      // Get page and limit from query
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      // Panggil service untuk mendapatkan bookmarked posts
      const bookmarkedPosts = await UserPostService.getBookmarkedPosts(userId, page, limit);
      // Jika tidak ada bookmarked posts
      if (!bookmarkedPosts) {
        return res.status(404).json({ success: false, message: "Posts not found" });
      }
      // Kirim response ke client
      res.json({ success: true, data: bookmarkedPosts });
    } catch (error) {
      // Tangkap error dan log ke file
      logger.error(`Error: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      res.status(500).json({ success: false, messege: "An unexpected error occurred." });
    }
  }

  // Get post Leaderboards
  static async getPostLeaderboards(req, res) {
    try {
      // Get page and limit from query
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      // Get userId form token
      const token = req.cookies.accessToken; // Access the token from the cookies
      if (!token) {
        throw new customError("Unauthorized", 401);
      }

      // Verifikasi token akses
      const user = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      const userId = user.id; // Ambil userId dari token

      // Panggil service untuk mendapatkan post leaderboards
      const postLeaderboards = await UserPostService.getPostLeaderboards(userId, page, limit);
      // Jika tidak ada post leaderboards
      if (!postLeaderboards) {
        throw new customError("Post leaderboards not found", 404);
      }

      // Kirim response ke client
      res.json({ success: true, data: postLeaderboards });
    } catch (error) {
      // Tangkap error dan log ke file
      logger.error(`Error: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      if (error instanceof customError) {
        return res.status(404).json({ success: false, message: error.message });
      } else {
        return res.status(500).json({ success: false, messege: "An unexpected error occurred." });
      }
    }
  }

  // searchPostsByTags
  static async getPostByTags(req, res) {
    try {
      let { query } = req.query;
      // Making sure query is an array
      if (!Array.isArray(query)) {
        query = [query]; // ubah jadi array kalau dia masih string
      }

      // Get userId form token
      const token = req.cookies.accessToken; // Access the token from the cookies
      if (!token) {
        throw new customError("Unauthorized", 401);
      }

      // Verifikasi token akses
      const user = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      const userId = user.id; // Ambil userId dari token

      // Get page and limit from query
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      // Panggil service untuk mendapatkan post by tags
      const postByTags = await UserPostService.searchPostsByTags(userId, query, page, limit);
      // Jika tidak ada post by tags
      if (!postByTags) {
        return res.status(404).json({ success: false, message: "Posts not found" });
      }
      // Kirim response ke client
      res.json({ success: true, data: postByTags });
    } catch (error) {
      // Tangkap error dan log ke file
      logger.error(`Error: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });
      if (error instanceof customError) {
        return res.status(404).json({ success: false, message: error.message });
      } else {
        return res.status(500).json({ success: false, messege: "An unexpected error occurred." });
      }
    }
  }

  // Search post by a type
  static async getPostByType(req, res) {
    try {
      const { query } = req.query;

      // Get userId form token
      const token = req.cookies.accessToken; // Access the token from the cookies
      if (!token) {
        throw new customError("Unauthorized", 401);
      }

      // Verifikasi token akses
      const user = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      const userId = user.id; // Ambil userId dari token

      // Get page and limit from query
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      // Panggil service untuk mendapatkan post by type
      const postByType = await UserPostService.searchPostsByType(userId, query, page, limit);
      // Jika tidak ada post by type
      if (!postByType) {
        return res.status(404).json({ success: false, message: "Posts not found" });
      }
      // Kirim response ke client
      res.json({ success: true, data: postByType });
    } catch (error) {
      // Tangkap error dan log ke file
      logger.error(`Error: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });
      if (error instanceof customError) {
        return res.status(404).json({ success: false, message: error.message });
      } else {
        return res.status(500).json({ success: false, messege: "An unexpected error occurred." });
      }
    }
  }

  // Search post by a title and description
  static async getPostByTitleAndDescription(req, res) {
    try {
      const { query } = req.query;

      // Get userId form token
      const token = req.cookies.accessToken; // Access the token from the cookies
      if (!token) {
        throw new customError("Unauthorized", 401);
      }

      // Verifikasi token akses
      const user = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      const userId = user.id; // Ambil userId dari token

      // Get page and limit from query
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      // Panggil service untuk mendapatkan post by title and description
      const postByTitleAndDescription = await UserPostService.searchPostsByTitleAndDescription(userId, query, page, limit);
      // Jika tidak ada post by title and description
      if (!postByTitleAndDescription) {
        return res.status(404).json({ success: false, message: "Posts not found" });
      }
      // Kirim response ke client
      res.json({ success: true, data: postByTitleAndDescription });
    } catch (error) {
      // Tangkap error dan log ke file
      logger.error(`Error: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });
      if (error instanceof customError) {
        return res.status(404).json({ success: false, message: error.message });
      } else {
        return res.status(500).json({ success: false, messege: "An unexpected error occurred." });
      }
    }
  }
  // Create a user post
  static async createPost(req, res) {
    try {
      // Gunakan multer untuk menangani upload sebelum memanggil service
      uploadArray("images", 10)(req, res, async (err) => {
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

          // Upload images to Cloudinary
          const imageUrls = [];
          if (req.files && req.files.length > 0) {
            for (const file of req.files) {
              try {
                const result = await uploadPostImage(file.buffer);
                imageUrls.push(result.secure_url);
              } catch (uploadError) {
                logger.error(`Error uploading image to Cloudinary: ${uploadError.message}`);
                // Continue with other images, don't fail the entire request
              }
            }
          }

          // Panggil service dengan data yang sudah diproses
          const newPost = await UserPostService.createPost(userId, title, description, tags, imageUrls, type);

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
  } // Edit a user post
  static async updatePost(req, res) {
    try {
      // Gunakan multer untuk menangani upload sebelum memanggil service
      uploadArray("images", 10)(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ error: "File upload failed", details: err.message });
        }

        // Karena multer menggunakan callback, kita perlu try-catch di dalam callback
        try {
          // Ambil postId dari request params
          let { postId } = req.params;
          postId = parseInt(postId);

          // Destructure data dari request body
          const { title, description, tags, type } = req.body;

          // Validasi data yang diperlukan
          if (!title || !description) {
            return res.status(400).json({ error: "Title and description are required" });
          }

          // Validasi postId
          if (isNaN(postId)) {
            return res.status(400).json({ error: "Invalid post ID" });
          }

          // Get current userId from token untuk validasi kepemilikan
          const currentUserId = req.user.id;

          // Validasi kepemilikan post
          const existingPost = await UserPostService.getPostById(postId);
          if (!existingPost) {
            return res.status(404).json({ success: false, message: "Post not found" });
          }

          if (existingPost.user_id !== currentUserId) {
            return res.status(403).json({ success: false, message: "You are not authorized to edit this post" });
          }

          // Upload new images to Cloudinary (if any)
          const newImageUrls = [];
          if (req.files && req.files.length > 0) {
            for (const file of req.files) {
              try {
                const result = await uploadPostImage(file.buffer);
                newImageUrls.push(result.secure_url);
              } catch (uploadError) {
                logger.error(`Error uploading image to Cloudinary: ${uploadError.message}`);
                // Continue with other images, don't fail the entire request
              }
            }
          }

          // Panggil service dengan data yang sudah diproses
          const updatedPost = await UserPostService.updatePost(postId, title, description, tags, newImageUrls, type);

          // Kirim response ke client
          res.json({ success: true, data: updatedPost, message: "Post updated successfully" });
        } catch (error) {
          logger.error(`Error: ${error.message}`, {
            stack: error.stack,
            timestamp: new Date().toISOString(),
          });

          res.status(500).json({ success: false, message: "An unexpected error occurred." });
        }
      });
    } catch (error) {
      logger.error(`Unexpected Error: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      res.status(500).json({ success: false, message: "An unexpected error occurred." });
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

  // Get single post by ID
  static async getSinglePost(req, res) {
    try {
      let { postId } = req.params;
      postId = parseInt(postId);

      // Get current userId from token
      const currentUserId = req.user.id;

      // Validasi postId
      if (isNaN(postId)) {
        return res.status(400).json({ error: "Invalid post ID" });
      }

      // Panggil service untuk mendapatkan single post
      const post = await UserPostService.getSinglePost(postId, currentUserId);

      // Jika tidak ada post
      if (!post) {
        return res.status(404).json({ success: false, message: "Post not found" });
      }

      res.json({ success: true, data: post });
    } catch (error) {
      // Tangkap error dan log ke file
      logger.error(`Error: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      res.status(500).json({ success: false, message: "An unexpected error occurred." });
    }
  }
}

module.exports = UserPostController;
