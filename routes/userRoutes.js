const express = require("express");
const router = express.Router();
const userProfileController = require("../controllers/UserProfileController");
const { verifyAccessToken } = require("../middlewares/authMiddleware");

// Get user profile
router.get("/profile/:userId", verifyAccessToken, userProfileController.getUserProfile);

module.exports = router;
