const express = require("express");
const router = express.Router();
const userFollowController = require("../controllers/UserFollowController");
const { verifyAccessToken } = require("../middlewares/authMiddleware");

// Get all user follows by follower id
router.get("/follower/:followerId", verifyAccessToken, userFollowController.findByFollowerId);
// Get all user follows by followed id
router.get("/followed/:followedId", verifyAccessToken, userFollowController.findByFollowedId);
// Create a new user follow
router.post("/create-delete/:followedId", verifyAccessToken, userFollowController.createDelete);
// // Delete a user follow
// router.delete("/delete", verifyAccessToken, userFollowController.delete);

module.exports = router;
