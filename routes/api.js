const express = require("express");
const router = express.Router();
const userProfileRoutes = require("./userProfileRoutes"); // Import the userProfileRoutes
const authRoutes = require("./authRoutes"); // Import the authRoutes
const userPostRoutes = require("./userPostRoutes"); // Import the userPostRoutes
// const postCommentRoutes = require("./postCommentRoutes"); // Import the postCommentRoutes
const postLikeRoutes = require("./postLikeRoutes"); // Import the postLikeRoutes
const userFollowRoutes = require("./userFollowRoutes"); // Import the userFollowRoutes

router.use("/profiles", userProfileRoutes); // Use the userProfileRoutes for the /users route
router.use("/auth", authRoutes); // Use the authRoutes for the /auth route
router.use("/posts", userPostRoutes); // Use the userPostRoutes for the /posts route
// router.use("/comments", postCommentRoutes); // Use the postCommentRoutes for the /comments route
router.use("/likes", postLikeRoutes); // Use the postLikeRoutes for the /likes route
router.use("/follows", userFollowRoutes); // Use the userFollowRoutes for the /follows route

module.exports = router; // Export the router
