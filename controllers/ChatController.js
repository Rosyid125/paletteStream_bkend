const ChatService = require("../services/ChatService");

class ChatController {
  static async getHistory(req, res) {
    try {
      const userId = parseInt(req.user.id);
      const otherUserId = parseInt(req.params.user_id);
      const history = await ChatService.getHistory(userId, otherUserId);
      res.json({ success: true, data: history });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = ChatController;
