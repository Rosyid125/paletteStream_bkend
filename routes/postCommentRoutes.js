const express = require("express");
const router = express.Router();
const PostCommentController = require("../controllers/PostCommentController");
const { verifyAccessToken } = require("../middlewares/authMiddleware");

// Get all post comments by post id
router.get("/:postId", verifyAccessToken, PostCommentController.getComments);
// Create a new post comment
router.post("/create", verifyAccessToken, PostCommentController.create);
// Delete a post comment
router.delete("/delete/:id", verifyAccessToken, PostCommentController.delete);
// Get all comment replies by post comment id
router.get("/comment-replies/:postCommentId", verifyAccessToken, PostCommentController.getCommentReplies);
// Create a new comment reply
router.post("/comment-replies/create", verifyAccessToken, PostCommentController.createCommentReply);
// Delete a comment reply
router.delete("/comment-replies/delete/:id", verifyAccessToken, PostCommentController.deleteCommentReply);

module.exports = router;
