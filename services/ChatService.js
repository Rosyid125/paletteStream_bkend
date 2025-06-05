const MessageRepository = require("../repositories/MessageRepository");
const customError = require("../errors/customError");

class ChatService {
  async sendMessage({ sender_id, receiver_id, content }) {
    if (!content || !sender_id || !receiver_id) throw new customError("Invalid payload", 400);
    return MessageRepository.create({ sender_id, receiver_id, content });
  }

  async getHistory(userId, otherUserId) {
    return MessageRepository.getHistory(userId, otherUserId);
  }

  async markAsRead(messageId) {
    return MessageRepository.markAsRead(messageId);
  }

  async getUnread(userId) {
    return MessageRepository.getUnread(userId);
  }
}

module.exports = new ChatService();
