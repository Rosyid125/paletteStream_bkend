const Notification = require("../models/Notification");

class NotificationRepository {
  async create({ user_id, type, data }) {
    return Notification.query().insert({ user_id, type, data, is_read: false });
  }

  async getByUser(user_id) {
    return Notification.query().where({ user_id }).orderBy("created_at", "desc");
  }

  async getByUserWithFilter(user_id, options = {}) {
    const { page = 1, limit = 20, type = null, unread_only = false } = options;
    const offset = (page - 1) * limit;

    let query = Notification.query().where({ user_id });

    if (type) {
      query = query.where({ type });
    }

    if (unread_only) {
      query = query.where({ is_read: false });
    }

    return query.orderBy("created_at", "desc").offset(offset).limit(limit);
  }

  async getUnreadCount(user_id) {
    const result = await Notification.query().where({ user_id, is_read: false }).count("id as count").first();
    return result?.count || 0;
  }

  async markAsRead(notification_id) {
    return Notification.query().patchAndFetchById(notification_id, { is_read: true });
  }

  async markAllAsRead(user_id) {
    return Notification.query().where({ user_id, is_read: false }).patch({ is_read: true });
  }

  async markAsReadByType(user_id, type) {
    return Notification.query().where({ user_id, type, is_read: false }).patch({ is_read: true });
  }

  async deleteOldNotifications(daysOld = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    return Notification.query().where("created_at", "<", cutoffDate.toISOString()).delete();
  }

  async getNotificationsByType(user_id, type) {
    return Notification.query().where({ user_id, type }).orderBy("created_at", "desc");
  }
}

module.exports = new NotificationRepository();
