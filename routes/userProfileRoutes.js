const express = require("express");
const router = express.Router();
const userProfileController = require("../controllers/UserProfileController");
const { verifyAccessToken } = require("../middlewares/authMiddleware");

// // Get user profile by userid with other informations
// router.get("/profile/:userId", verifyAccessToken, userProfileController.getUserProfile);
// // Update user profile
// router.put("/update/:userid", verifyAccessToken, userProfileController.updateUserProfile);

// No middleware
router.get("/profile/:userId", userProfileController.getUserProfile);
router.put("/update/:userId", userProfileController.updateUserProfile);

module.exports = router;
