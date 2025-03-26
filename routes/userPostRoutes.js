const express = require("express");
const router = express.Router();
const userPostController = require("../controllers/UserPostController");
const { verifyAccessToken } = require("../middlewares/authMiddleware");

// Get all posts
router.get("/", verifyAccessToken, userPostController.getAllPost);
// Get all user posts
router.get("/:userId", verifyAccessToken, userPostController.getUserPost);
// Get all home/feed posts
router.get("/home/:userId", verifyAccessToken, userPostController.getHomePosts);
// Get a post detail
router.get("/detail/:postId", verifyAccessToken, userPostController.getPostDetails);
// Create a new post
router.post("/create/:userId", verifyAccessToken, userPostController.createPost);
// Update a post
router.put("/edit/:postId", verifyAccessToken, userPostController.updatePost);
// Delete a post
router.delete("/delete/:postId", verifyAccessToken, userPostController.deletePost);

module.exports = router;
