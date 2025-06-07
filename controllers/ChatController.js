const ChatService = require("../services/ChatService");
const logger = require("../utils/winstonLogger");

class ChatController {
  static async getHistory(req, res) {
    try {
      const userId = parseInt(req.user.id);
      const otherUserId = parseInt(req.params.user_id);
      const history = await ChatService.getHistory(userId, otherUserId);
      res.json({ success: true, data: history });
    } catch (error) {
      logger.error(`Error: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getChats(req, res) {
    try {
      const userId = req.user.id;
      const chats = await ChatService.getChats(userId);
      res.json({ success: true, data: chats });
    } catch (error) {
      logger.error(`Error: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getUnread(req, res) {
    try {
      const userId = req.user.id;
      const unread = await ChatService.getUnread(userId);
      res.json({ success: true, data: unread });
    } catch (error) {
      logger.error(`Error: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getUnreadCount(req, res) {
    try {
      const userId = req.user.id;
      const senderId = parseInt(req.params.sender_id);
      const unreadCount = await ChatService.getUnreadCount(userId, senderId);
      res.json({ success: true, data: unreadCount });
    } catch (error) {
      logger.error(`Error: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async markAsRead(req, res) {
    try {
      const messageId = req.params.messageId;
      await ChatService.markAsRead(messageId);
      res.json({ success: true });
    } catch (error) {
      logger.error(`Error: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = ChatController;
