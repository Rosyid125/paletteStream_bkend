const express = require("express");
const router = express.Router();
const PostReportController = require("../controllers/PostReportController");
const { verifyAccessToken } = require("../middlewares/authMiddleware");
const { reportRateLimit } = require("../middlewares/reportRateLimit");
const { validateReportData } = require("../middlewares/reportValidation");

// Get report reasons (for frontend dropdown)
router.get("/reasons", verifyAccessToken, PostReportController.getReportReasons);

// Report a specific post (with rate limiting and validation)
router.post("/posts/:postId", verifyAccessToken, validateReportData, reportRateLimit, PostReportController.reportPost);

module.exports = router;
