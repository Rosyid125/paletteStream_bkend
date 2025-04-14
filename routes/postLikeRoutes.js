const express = require("express");
const router = express.Router();
const postLikeController = require("../controllers/PostLikeController");
const { verifyAccessToken } = require("../middlewares/authMiddleware");

// Get all post likes by post id
router.get("/:postId", verifyAccessToken, postLikeController.getAll);
// Create and Delete post like
router.post("/create-delete", verifyAccessToken, postLikeController.createDelete);
// // Delete a post like
// router.delete("/delete", verifyAccessToken, postLikeController.delete);

module.exports = router;
