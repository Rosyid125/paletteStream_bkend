const NotificationRepository = require("../repositories/NotificationRepository");
const customError = require("../errors/customError");

const NOTIFICATION_TYPES = [
  "like",
  "comment",
  "reply",
  "follow",
  "achievement",
  "level_up",
  "challenge",
  "mention",
  "post_featured",
  "post_reported",
  "challenge_winner",
  "badge",
  "exp_gain",
  "exp_loss",
  "post_bookmarked",
  "post_unbookmarked",
  "post_deleted",
  "comment_deleted",
  "system",
];

class NotificationService {
  static async create({ user_id, type, data }) {
    if (!NOTIFICATION_TYPES.includes(type)) throw new customError("Invalid notification type", 400);
    return NotificationRepository.create({ user_id, type, data });
  }

  static async getByUser(user_id) {
    return NotificationRepository.getByUser(user_id);
  }

  static async markAsRead(notification_id) {
    return NotificationRepository.markAsRead(notification_id);
  }

  static async markAllAsRead(user_id) {
    return NotificationRepository.markAllAsRead(user_id);
  }
}

module.exports = NotificationService;
