const express = require("express");
const router = express.Router();
const ChatController = require("../controllers/ChatController");
const { verifyAccessToken } = require("../middlewares/authMiddleware");

router.get("/chat/history/:user_id", verifyAccessToken, ChatController.getHistory);

module.exports = router;
