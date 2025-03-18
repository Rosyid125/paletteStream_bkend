const express = require("express");
const router = express.Router();
const userPostController = require("../controllers/UserPostController");
const { verifyAccessToken } = require("../middlewares/authMiddleware");

// Get user post
router.get("/", verifyAccessToken, userPostController.getAllPost);
router.get("/:userId", verifyAccessToken, userPostController.getUserPost);
router.post("/create/:userId", verifyAccessToken, userPostController.createPost);
router.put("/edit/:postId", verifyAccessToken, userPostController.updatePost);
router.delete("/delete/:postId", verifyAccessToken, userPostController.deletePost);

module.exports = router;
