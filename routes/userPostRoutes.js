const express = require("express");
const router = express.Router();
const userPostController = require("../controllers/UserPostController");
const { verifyAccessToken } = require("../middlewares/authMiddleware");

// Get all posts
router.get("/", verifyAccessToken, userPostController.getAllPost);
// Get all randomized posts
router.get("/randomized", verifyAccessToken, userPostController.getRandomPosts);
// Get all home/feed posts
router.get("/home/:userId", verifyAccessToken, userPostController.getHomePosts);
// Get all liked posts
router.get("/liked/:userId", verifyAccessToken, userPostController.getLikedPosts);
// Get all bookmarked posts
router.get("/bookmarked/:userId", verifyAccessToken, userPostController.getBookmarkedPosts);
// Create a new post
router.post("/create/:userId", verifyAccessToken, userPostController.createPost);
// Get leaderboard posts
router.get("/leaderboard", verifyAccessToken, userPostController.getPostLeaderboards);
// Get all posts by type
router.get("/type", verifyAccessToken, userPostController.getPostByType);
// Get all posts by tags
router.get("/tags", verifyAccessToken, userPostController.getPostByTags);
// Get all posts by title and description
router.get("/title-desc", verifyAccessToken, userPostController.getPostByTitleAndDescription);
// Get all user posts
router.get("/:userId", verifyAccessToken, userPostController.getUserPost);
// Update a post
// router.put("/edit/:postId", verifyAccessToken, userPostController.updatePost);
// Delete a post
router.delete("/delete/:postId", verifyAccessToken, userPostController.deletePost);

module.exports = router;
