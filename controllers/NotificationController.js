const NotificationService = require("../services/NotificationService");

class NotificationController {
  static async getNotifications(req, res) {
    try {
      const userId = req.user.id;
      const notifications = await NotificationService.getByUser(userId);
      res.json({ success: true, data: notifications });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async markAsRead(req, res) {
    try {
      const { notification_id } = req.body;
      if (notification_id) {
        await NotificationService.markAsRead(notification_id);
      } else {
        await NotificationService.markAllAsRead(req.user.id);
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = NotificationController;
