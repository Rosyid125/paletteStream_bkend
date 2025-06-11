// Debug Routes for WebSocket Monitoring
// File: routes/debugRoutes.js

const express = require("express");
const router = express.Router();
const DebugController = require("../controllers/DebugController");
const { verifyAccessToken } = require("../middlewares/authMiddleware");
const { verifyAdminRole } = require("../middlewares/roleMiddleware");

// Middleware untuk admin only
const adminOnly = [verifyAccessToken, verifyAdminRole];

// Get WebSocket connection status
router.get("/connections", adminOnly, DebugController.getConnectionStatus);

// Get recent disconnect events
router.get("/disconnects", adminOnly, DebugController.getRecentDisconnects);

// Test notification delivery
router.post("/test-notification", adminOnly, DebugController.testNotification);

// Generate debug report
router.get("/report", adminOnly, DebugController.generateDebugReport);

// Get notification delivery statistics
router.get("/notification-stats", adminOnly, DebugController.getNotificationStats);

// Get WebSocket health status
router.get("/health", adminOnly, DebugController.getHealthStatus);

module.exports = router;
