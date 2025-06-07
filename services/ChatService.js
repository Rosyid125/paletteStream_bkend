const MessageRepository = require("../repositories/MessageRepository");
const customError = require("../errors/customError");
const dayjs = require("dayjs");

class ChatService {
  async sendMessage({ sender_id, receiver_id, content }) {
    if (!content || !sender_id || !receiver_id) throw new customError("Invalid payload", 400);
    return MessageRepository.create({ sender_id, receiver_id, content });
  }

  async getHistory(userId, otherUserId) {
    const messages = await MessageRepository.getHistory(userId, otherUserId);
    // Format tanggal sesuai database (YYYY-MM-DD HH:mm:ss)
    return messages.map((msg) => ({
      ...msg,
      created_at: dayjs(msg.created_at).format("YYYY-MM-DD HH:mm:ss"),
      updated_at: dayjs(msg.updated_at).format("YYYY-MM-DD HH:mm:ss"),
    }));
  }

  async markAsRead(messageId) {
    return MessageRepository.markAsRead(messageId);
  }

  async getUnread(userId) {
    return MessageRepository.getUnread(userId);
  }

  async getUnreadCount(userId, senderId) {
    const count = await MessageRepository.getUnreadCount(userId, senderId);
    return Number(count || 0);
  }

  async getChats(userId) {
    // Ambil semua user yang pernah chat (distinct sender/receiver selain userId)
    return MessageRepository.getChats(userId);
  }
}

module.exports = new ChatService();
