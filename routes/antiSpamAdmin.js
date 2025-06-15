const express = require("express");
const router = express.Router();
const AntiSpamAdminController = require("../controllers/AntiSpamAdminController");
const { verifyAccessToken } = require("../middlewares/authMiddleware");
const { verifyAdminRole } = require("../middlewares/roleMiddleware");

// Semua route memerlukan admin authentication
router.use(verifyAccessToken);
router.use(verifyAdminRole);

/**
 * @route   GET /api/admin/spam/statistics
 * @desc    Get spam statistics for admin dashboard
 * @access  Admin
 */
router.get("/statistics", AntiSpamAdminController.getSpamStatistics);

/**
 * @route   GET /api/admin/spam/locks
 * @desc    Get active spam locks
 * @access  Admin
 * @query   spam_type - Filter by spam type (optional)
 */
router.get("/locks", AntiSpamAdminController.getActiveLocks);

/**
 * @route   GET /api/admin/spam/user/:userId/history
 * @desc    Get spam history for specific user
 * @access  Admin
 * @param   userId - User ID
 * @query   limit - Number of records to return (default: 20)
 */
router.get("/user/:userId/history", AntiSpamAdminController.getUserSpamHistory);

/**
 * @route   GET /api/admin/spam/user/:userId/status
 * @desc    Get lock status for specific user
 * @access  Admin
 * @param   userId - User ID
 */
router.get("/user/:userId/status", AntiSpamAdminController.getUserLockStatus);

/**
 * @route   POST /api/admin/spam/user/:userId/unlock
 * @desc    Manually unlock user from spam lock
 * @access  Admin
 * @param   userId - User ID
 * @body    spam_type - Type of spam lock to unlock
 */
router.post("/user/:userId/unlock", AntiSpamAdminController.unlockUser);

/**
 * @route   POST /api/admin/spam/cleanup
 * @desc    Manually run spam cleanup
 * @access  Admin
 */
router.post("/cleanup", AntiSpamAdminController.runCleanup);

/**
 * @route   GET /api/admin/spam/logs
 * @desc    Get recent anti-spam logs
 * @access  Admin
 * @query   lines - Number of log lines to return (default: 50)
 */
router.get("/logs", AntiSpamAdminController.getAntiSpamLogs);

/**
 * @route   GET /api/admin/spam/logs/stats
 * @desc    Get statistics from anti-spam logs
 * @access  Admin
 * @query   hours - Hours to look back (default: 24)
 */
router.get("/logs/stats", AntiSpamAdminController.getLogStatistics);

module.exports = router;
