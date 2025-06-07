const express = require("express");
const router = express.Router();
const ChatController = require("../controllers/ChatController");
const { verifyAccessToken } = require("../middlewares/authMiddleware");

router.get("/history/:user_id", verifyAccessToken, ChatController.getHistory);
router.get("/", verifyAccessToken, ChatController.getChats);
router.get("/unread", verifyAccessToken, ChatController.getUnread);
router.patch("/:messageId/read", verifyAccessToken, ChatController.markAsRead);

module.exports = router;
