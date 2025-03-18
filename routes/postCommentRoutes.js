const express = require("express");
const router = express.Router();
const postCommentController = require("../controllers/PostCommentController");
const { verifyAccessToken } = require("../middlewares/authMiddleware");

// // Get all post comments by post id
// router.get("/:post_id", verifyAccessToken, postCommentController.getAll);
// // Create a new post comment
// router.post("/create", verifyAccessToken, postCommentController.create);
// // Delete a post comment
// router.delete("/delete/:id", verifyAccessToken, postCommentController.delete);
// // Get all comment replies by post comment id
// router.get("/comment-replies/:post_comment_id", verifyAccessToken, postCommentController.getCommentReplies);
// // Create a new comment reply
// router.post("/comment-replies/create", verifyAccessToken, postCommentController.createCommentReply);
// // Delete a comment reply
// router.delete("/comment-replies/delete/:id", verifyAccessToken, postCommentController.deleteCommentReply);

// Versi tanpa middleware
router.get("/:post_id", postCommentController.getAll);
router.post("/create", postCommentController.create);
router.delete("/delete/:id", postCommentController.delete);
router.get("/comment-replies/:post_comment_id", postCommentController.getCommentReplies);
router.post("/comment-replies/create", postCommentController.createCommentReply);
router.delete("/comment-replies/delete/:id", postCommentController.deleteCommentReply);

module.exports = router;
