const express = require("express");
const router = express.Router();
const ChallengeController = require("../controllers/ChallengeController");
const { verifyAccessToken } = require("../middlewares/authMiddleware");
const { verifyAdminRole } = require("../middlewares/roleMiddleware");
const multer = require("multer");
const path = require("path");

// Configure multer for badge image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "storage/badges/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "badge-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed (JPEG, JPG, PNG, GIF)"));
    }
  },
});

// Public routes
router.get("/challenges", ChallengeController.getAllChallenges);
router.get("/challenges/active", ChallengeController.getActiveChallenges);
router.get("/challenges/:id", ChallengeController.getChallengeById);
router.get("/challenges/:id/leaderboard", ChallengeController.getChallengeLeaderboard);
router.get("/challenges/:id/winners", ChallengeController.getChallengeWinners);

// User authenticated routes
router.post("/challenges/:id/submit-post", verifyAccessToken, ChallengeController.submitPostToChallenge);
router.get("/user/challenge-history", verifyAccessToken, ChallengeController.getUserChallengeHistory);

// Admin routes (require authentication and admin role)
router.post("/challenges", verifyAccessToken, verifyAdminRole, upload.single("badge_img"), ChallengeController.createChallenge);
router.put("/challenges/:id", verifyAccessToken, verifyAdminRole, upload.single("badge_img"), ChallengeController.updateChallenge);
router.put("/challenges/:id/close", verifyAccessToken, verifyAdminRole, ChallengeController.closeChallenge);
router.delete("/challenges/:id", verifyAccessToken, verifyAdminRole, ChallengeController.deleteChallenge);
router.post("/challenges/:id/select-winners", verifyAccessToken, verifyAdminRole, ChallengeController.selectWinners);

module.exports = router;
