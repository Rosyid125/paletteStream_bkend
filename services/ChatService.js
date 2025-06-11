const MessageRepository = require("../repositories/MessageRepository");
const customError = require("../errors/customError");
const dayjs = require("dayjs");
const NotificationService = require("./NotificationService.js");
const UserRepository = require("../repositories/UserRepository.js");

class ChatService {
  async sendMessage({ sender_id, receiver_id, content }) {
    if (!content || !sender_id || !receiver_id) throw new customError("Invalid payload", 400);

    const message = await MessageRepository.create({ sender_id, receiver_id, content });

    // Send notification to receiver
    try {
      // Get sender information for notification
      const sender = await UserRepository.findById(sender_id);
      const senderProfile = await sender.$relatedQuery("profile");

      await NotificationService.notifyNewMessage(receiver_id, sender_id, senderProfile?.username || `User ${sender_id}`, content, message.id);
    } catch (notificationError) {
      // Log error but don't break the main flow
      console.error("Failed to send message notification:", notificationError);
    }

    return message;
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
