const express = require("express");
const router = express.Router();
const NotificationController = require("../controllers/NotificationController");
const { verifyAccessToken } = require("../middlewares/authMiddleware");

router.get("/notifications", verifyAccessToken, NotificationController.getNotifications);
router.post("/notifications/read", verifyAccessToken, NotificationController.markAsRead);

module.exports = router;
