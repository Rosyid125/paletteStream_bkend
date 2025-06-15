const express = require("express");
const router = express.Router();
const userFollowController = require("../controllers/UserFollowController");
const { verifyAccessToken } = require("../middlewares/authMiddleware");

// Get all user follows by follower id (legacy - returns only IDs)
router.get("/follower/:followerId", verifyAccessToken, userFollowController.findByFollowerId);
// Get all user follows by followed id (legacy - returns only IDs)
router.get("/followed/:followedId", verifyAccessToken, userFollowController.findByFollowedId);

// Get user followers with pagination and user details
router.get("/:userId/followers", verifyAccessToken, userFollowController.getFollowersWithPagination);
// Get user following with pagination and user details
router.get("/:userId/following", verifyAccessToken, userFollowController.getFollowingWithPagination);

// Create a new user follow
router.post("/create-delete/:followedId", verifyAccessToken, userFollowController.createDelete);
// // Delete a user follow
// router.delete("/delete", verifyAccessToken, userFollowController.delete);

module.exports = router;
