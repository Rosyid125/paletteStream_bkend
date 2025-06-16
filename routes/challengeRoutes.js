const express = require("express");
const router = express.Router();
const ChallengeController = require("../controllers/ChallengeController");
const { verifyAccessToken } = require("../middlewares/authMiddleware");
const { verifyAdminRole } = require("../middlewares/roleMiddleware");
const { uploadSingle } = require("../utils/multerCloudinaryUtil");

// Public routes
router.get("/challenges", ChallengeController.getAllChallenges);
router.get("/challenges/active", ChallengeController.getActiveChallenges);
router.get("/challenges/:id", ChallengeController.getChallengeById);
router.get("/challenges/:id/leaderboard", ChallengeController.getChallengeLeaderboard);
router.get("/challenges/:id/winners", ChallengeController.getChallengeWinners);

// User authenticated routes
router.post("/challenges/:id/submit-post", verifyAccessToken, ChallengeController.submitPostToChallenge);
router.get("/user/challenge-history", verifyAccessToken, ChallengeController.getUserChallengeHistory);
router.get("/user/wins", verifyAccessToken, ChallengeController.getUserWins);

// Admin routes (require authentication and admin role)
router.post("/challenges", verifyAccessToken, verifyAdminRole, uploadSingle("badge_img"), ChallengeController.createChallenge);
router.put("/challenges/:id", verifyAccessToken, verifyAdminRole, uploadSingle("badge_img"), ChallengeController.updateChallenge);
router.put("/challenges/:id/close", verifyAccessToken, verifyAdminRole, ChallengeController.closeChallenge);
router.delete("/challenges/:id", verifyAccessToken, verifyAdminRole, ChallengeController.deleteChallenge);
router.post("/challenges/:id/select-winners", verifyAccessToken, verifyAdminRole, ChallengeController.selectWinners);
router.post("/challenges/:id/auto-select-winners", verifyAccessToken, verifyAdminRole, ChallengeController.autoSelectWinners);

module.exports = router;
