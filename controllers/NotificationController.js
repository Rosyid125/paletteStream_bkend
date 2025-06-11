const NotificationService = require("../services/NotificationService");

class NotificationController {
  static async getNotifications(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 20, type = null, unread_only = false } = req.query;

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        type,
        unread_only: unread_only === "true",
      };

      const notifications = await NotificationService.getNotificationsWithFilter(userId, options);
      res.json({ success: true, data: notifications });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
  static async markAsRead(req, res) {
    try {
      const { notification_id, type } = req.body;

      if (notification_id) {
        await NotificationService.markAsRead(notification_id);
        res.json({ success: true, message: "Notification marked as read" });
      } else if (type) {
        const result = await NotificationService.markAsReadByType(req.user.id, type);
        res.json({
          success: true,
          message: `All ${type} notifications marked as read`,
          data: { updated_count: result },
        });
      } else {
        res.status(400).json({
          success: false,
          message: "notification_id or type is required",
        });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
  static async getUnreadCount(req, res) {
    try {
      const userId = req.user.id;
      const count = await NotificationService.getUnreadCount(userId);
      res.json({ success: true, data: { unread_count: count } });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async markAllAsRead(req, res) {
    try {
      const userId = req.user.id;
      const result = await NotificationService.markAllAsRead(userId);
      res.json({
        success: true,
        message: "All notifications marked as read",
        data: { updated_count: result },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getNotificationsByType(req, res) {
    try {
      const userId = req.user.id;
      const { type } = req.params;
      const notifications = await NotificationService.getNotificationsByType(userId, type);
      res.json({ success: true, data: notifications });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async deleteOldNotifications(req, res) {
    try {
      const { days = 30 } = req.query;
      const result = await NotificationService.deleteOldNotifications(parseInt(days));
      res.json({ success: true, message: `Deleted ${result} old notifications` });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = NotificationController;
