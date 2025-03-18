const express = require("express");
const router = express.Router();
const userRoutes = require("./userRoutes"); // Import the userRoutes
const authRoutes = require("./authRoutes"); // Import the authRoutes
const userPostRoutes = require("./userPostRoutes"); // Import the userPostRoutes
const postCommentRoutes = require("./postCommentRoutes"); // Import the postCommentRoutes

router.use("/users", userRoutes); // Use the userRoutes for the /users route
router.use("/auth", authRoutes); // Use the authRoutes for the /auth route
router.use("/posts", userPostRoutes); // Use the userPostRoutes for the /posts route
router.use("/comments", postCommentRoutes); // Use the postCommentRoutes for the /comments route

module.exports = router; // Export the router
