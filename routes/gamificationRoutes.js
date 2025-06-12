const express = require("express");
const router = express.Router();
const GamificationController = require("../controllers/GamificationController");

// GET: Complete gamification hub data for current user
router.get("/hub", GamificationController.getGamificationHub);

// GET: Level info for specific user
router.get("/level/:userId", GamificationController.getUserLevel);

// GET: Achievements for specific user (with optional status filter)
router.get("/achievements/:userId", GamificationController.getUserAchievements);

// GET: Badges for specific user
router.get("/badges/:userId", GamificationController.getUserBadges);

// GET: Profile badges for specific user (detailed for profile page)
router.get("/profile/badges/:userId", GamificationController.getProfileBadges);

// GET: Profile challenges for specific user (detailed for profile page)
router.get("/profile/challenges/:userId", GamificationController.getProfileChallenges);

// GET: Leaderboard data
router.get("/leaderboard", GamificationController.getLeaderboard);

module.exports = router;
