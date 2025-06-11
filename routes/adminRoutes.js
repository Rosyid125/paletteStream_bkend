const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/AdminController");
const { verifyAdminRole } = require("../middlewares/roleMiddleware");
const { verifyAccessToken } = require("../middlewares/authMiddleware");
const { validateReportStatusUpdate } = require("../middlewares/reportValidation");

router.get("/users", verifyAccessToken, verifyAdminRole, AdminController.getUsers);
router.put("/users/:id/ban", verifyAccessToken, verifyAdminRole, AdminController.banUser);
router.put("/users/:id", verifyAccessToken, verifyAdminRole, AdminController.editUser);
router.delete("/users/:id", verifyAccessToken, verifyAdminRole, AdminController.deleteUser);
router.get("/posts", verifyAccessToken, verifyAdminRole, AdminController.getPosts);
router.delete("/posts/:id", verifyAccessToken, verifyAdminRole, AdminController.deletePost);
router.get("/dashboard", verifyAccessToken, verifyAdminRole, AdminController.getDashboard);
router.get("/dashboard/trends", verifyAccessToken, verifyAdminRole, AdminController.getDashboardTrends);

// Post Report Management Routes
router.get("/posts/reported", verifyAccessToken, verifyAdminRole, AdminController.getReportedPosts);
router.get("/posts/:postId/reports", verifyAccessToken, verifyAdminRole, AdminController.getPostReports);
router.get("/reports", verifyAccessToken, verifyAdminRole, AdminController.getAllReports);
router.get("/reports/statistics", verifyAccessToken, verifyAdminRole, AdminController.getReportStatistics);
router.put("/reports/:reportId/status", verifyAccessToken, verifyAdminRole, validateReportStatusUpdate, AdminController.updateReportStatus);
router.delete("/reports/:reportId", verifyAccessToken, verifyAdminRole, AdminController.deleteReport);

module.exports = router;
