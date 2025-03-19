const express = require("express");
const router = express.Router();
const postLikeController = require("../controllers/PostLikeController");
const { verifyAccessToken } = require("../middlewares/authMiddleware");

// Get all post likes by post id
router.get("/:postId", verifyAccessToken, postLikeController.getAll);
// Create a new post like
router.post("/create", verifyAccessToken, postLikeController.create);
// Delete a post like
router.delete("/delete", verifyAccessToken, postLikeController.delete);

module.exports = router;
