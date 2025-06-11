const express = require("express");
const router = express.Router();
const NotificationController = require("../controllers/NotificationController");
const { verifyAccessToken } = require("../middlewares/authMiddleware");
const { verifyAdminRole } = require("../middlewares/roleMiddleware");

// Get notifications with filtering and pagination
router.get("/", verifyAccessToken, NotificationController.getNotifications);

// Get unread notification count
router.get("/unread-count", verifyAccessToken, NotificationController.getUnreadCount);

// Get notifications by type
router.get("/type/:type", verifyAccessToken, NotificationController.getNotificationsByType);

// Mark notifications as read
router.post("/read", verifyAccessToken, NotificationController.markAsRead);

// Mark all notifications as read
router.post("/mark-all-read", verifyAccessToken, NotificationController.markAllAsRead);

// Delete old notifications (admin only)
router.delete("/cleanup", verifyAccessToken, verifyAdminRole, NotificationController.deleteOldNotifications);

module.exports = router;
