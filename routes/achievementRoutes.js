const express = require("express");
const router = express.Router();
const AchievementController = require("../controllers/AchievementController");

// GET: Semua achievement aktif
router.get("/", AchievementController.getAll);
// GET: Progress & status seluruh achievement milik user tertentu
router.get("/user/:userId", AchievementController.getProgressByUserId);

module.exports = router;
