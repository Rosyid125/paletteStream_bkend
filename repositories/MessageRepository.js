const Message = require("../models/Message");

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
}

module.exports = new MessageRepository();
