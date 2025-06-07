const Message = require("../models/Message");
const User = require("../models/User");

class MessageRepository {
  async create({ sender_id, receiver_id, content }) {
    return Message.query().insert({ sender_id, receiver_id, content, is_read: false });
  }

  async getHistory(userId, otherUserId) {
    return Message.query()
      .where(function () {
        this.where("sender_id", userId).andWhere("receiver_id", otherUserId);
      })
      .orWhere(function () {
        this.where("sender_id", otherUserId).andWhere("receiver_id", userId);
      })
      .orderBy("created_at", "asc");
  }

  async markAsRead(messageId) {
    return Message.query().patchAndFetchById(messageId, { is_read: true });
  }

  async getUnread(userId) {
    return Message.query().where("receiver_id", userId).andWhere("is_read", false);
  }

  async getUnreadCount(userId, senderId) {
    const count = await Message.query().where("receiver_id", userId).andWhere("sender_id", senderId).andWhere("is_read", false).count().first();

    return Number(count["count(*)"] || 0);
  }

  async getChats(userId) {
    // Ambil semua user yang pernah chat (distinct sender/receiver selain userId)
    const sent = await Message.query().where("sender_id", userId).distinct("receiver_id as user_id");
    const received = await Message.query().where("receiver_id", userId).distinct("sender_id as user_id");
    const userIds = [...sent, ...received].map((u) => u.user_id);
    const uniqueUserIds = [...new Set(userIds)].filter((id) => id !== userId);
    // Ambil data user dan last_message untuk setiap user_id
    const users = await User.query().whereIn("id", uniqueUserIds);
    // Ambil last_message dan unread count untuk setiap user
    const chats = await Promise.all(
      users.map(async (user) => {
        const lastMsg = await Message.query()
          .where(function () {
            this.where("sender_id", userId).andWhere("receiver_id", user.id);
          })
          .orWhere(function () {
            this.where("sender_id", user.id).andWhere("receiver_id", userId);
          })
          .orderBy("created_at", "desc")
          .first();
        const unreadCount = await Message.query().where({ sender_id: user.id, receiver_id: userId, is_read: false }).count().first();

        console.log("[DEBUG] unreadCount:", unreadCount, "for user_id:", user.id, "userId:", userId);
        return {
          user_id: user.id,
          username: user.username,
          avatar: user.avatar,
          last_message: lastMsg ? lastMsg.content : null,
          last_message_time: lastMsg ? lastMsg.created_at : null,
          unread_count: Number(unreadCount["count(*)"] || 0),
        };
      })
    );
    // Urutkan berdasarkan waktu pesan terakhir
    chats.sort((a, b) => new Date(b.last_message_time) - new Date(a.last_message_time));
    return chats;
  }
}

module.exports = new MessageRepository();
