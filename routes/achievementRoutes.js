const express = require("express");
const router = express.Router();
const AchievementController = require("../controllers/AchievementController");

router.get("/achievements", AchievementController.getAll);
router.post("/achievements/progress", AchievementController.updateProgress);
router.get("/achievements/unlocked", AchievementController.getUnlocked);

module.exports = router;
