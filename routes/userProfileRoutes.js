const express = require("express");
const router = express.Router();
const userProfileController = require("../controllers/UserProfileController");
const { verifyAccessToken } = require("../middlewares/authMiddleware");

// Get user mini infos by user id
router.get("/mini-profile/:userId", verifyAccessToken, userProfileController.getUserMiniInfos);
// Get user profile by userid with other informations
router.get("/profile/:userId", verifyAccessToken, userProfileController.getUserProfile);
// Update user profile
router.put("/update/:userId", verifyAccessToken, userProfileController.updateUserProfile);

module.exports = router;
