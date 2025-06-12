const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/AdminController");
const { verifyAdminRole } = require("../middlewares/roleMiddleware");
const { verifyAccessToken } = require("../middlewares/authMiddleware");
const { validateReportStatusUpdate } = require("../middlewares/reportValidation");
const { validateCreateAdmin, validateEditUser, handleValidationErrors } = require("../middlewares/adminValidation");

// User Management Routes
router.get("/users", verifyAccessToken, verifyAdminRole, AdminController.getUsers);
router.get("/users/:id", verifyAccessToken, verifyAdminRole, AdminController.getUserById);
router.put("/users/:id/ban", verifyAccessToken, verifyAdminRole, AdminController.banUser);
router.put("/users/:id", verifyAccessToken, verifyAdminRole, validateEditUser, handleValidationErrors, AdminController.editUser);
router.delete("/users/:id", verifyAccessToken, verifyAdminRole, AdminController.deleteUser);

// Admin Management Routes
router.post("/admins", verifyAccessToken, verifyAdminRole, validateCreateAdmin, handleValidationErrors, AdminController.createAdmin);

// Post Management Routes
router.get("/posts", verifyAccessToken, verifyAdminRole, AdminController.getPosts);
router.delete("/posts/:id", verifyAccessToken, verifyAdminRole, AdminController.deletePost);

// Dashboard Routes
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
