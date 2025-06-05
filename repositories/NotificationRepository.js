const Notification = require("../models/Notification");

class NotificationRepository {
  async create({ user_id, type, data }) {
    return Notification.query().insert({ user_id, type, data, is_read: false });
  }

  async getByUser(user_id) {
    return Notification.query().where({ user_id }).orderBy("created_at", "desc");
  }

  async markAsRead(notification_id) {
    return Notification.query().patchAndFetchById(notification_id, { is_read: true });
  }

  async markAllAsRead(user_id) {
    return Notification.query().where({ user_id, is_read: false }).patch({ is_read: true });
  }
}

module.exports = new NotificationRepository();
