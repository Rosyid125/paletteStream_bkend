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
  "message",
  "post_leaderboard",
  "challenge_joined",
  "challenge_deadline",
  "system",
];

class NotificationService {
  static async create({ user_id, type, data }) {
    if (!NOTIFICATION_TYPES.includes(type)) throw new customError("Invalid notification type", 400);

    console.log(`[NOTIFICATION-SERVICE] 💾 Creating notification for user ${user_id}`, {
      user_id,
      type,
      message: data.message,
      timestamp: new Date().toISOString(),
    });

    const notification = await NotificationRepository.create({ user_id, type, data });

    console.log(`[NOTIFICATION-SERVICE] ✅ Notification created successfully`, {
      notificationId: notification.id,
      user_id,
      type,
      timestamp: new Date().toISOString(),
    });

    return notification;
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

  // =================== FEATURE-BASED NOTIFICATION TRIGGERS ===================

  /**
   * Post Interaction Notifications
   */
  static async notifyPostLiked(postOwnerId, likerId, postId, postTitle) {
    if (postOwnerId === likerId) return; // Don't notify self

    const notification = await this.create({
      user_id: postOwnerId,
      type: "like",
      data: {
        post_id: postId,
        post_title: postTitle,
        from_user_id: likerId,
        message: "liked your post",
        redirect_url: `/home?post=${postId}`,
        timestamp: new Date().toISOString(),
      },
    });

    // Send real-time notification
    this._sendRealTimeNotification(postOwnerId, notification);
    return notification;
  }

  static async notifyPostCommented(postOwnerId, commenterId, postId, postTitle, commentId, commentContent) {
    if (postOwnerId === commenterId) return; // Don't notify self

    const notification = await this.create({
      user_id: postOwnerId,
      type: "comment",
      data: {
        post_id: postId,
        post_title: postTitle,
        comment_id: commentId,
        comment_content: commentContent.substring(0, 100), // Truncate for preview
        from_user_id: commenterId,
        message: "commented on your post",
        redirect_url: `/home?post=${postId}&comment=${commentId}`,
        timestamp: new Date().toISOString(),
      },
    });

    this._sendRealTimeNotification(postOwnerId, notification);
    return notification;
  }

  static async notifyCommentReplied(commentOwnerId, replierId, postId, commentId, replyId, replyContent) {
    if (commentOwnerId === replierId) return; // Don't notify self

    const notification = await this.create({
      user_id: commentOwnerId,
      type: "reply",
      data: {
        post_id: postId,
        comment_id: commentId,
        reply_id: replyId,
        reply_content: replyContent.substring(0, 100),
        from_user_id: replierId,
        message: "replied to your comment",
        redirect_url: `/home?post=${postId}&comment=${commentId}`,
        timestamp: new Date().toISOString(),
      },
    });

    this._sendRealTimeNotification(commentOwnerId, notification);
    return notification;
  }

  static async notifyPostBookmarked(postOwnerId, bookmarkerId, postId, postTitle) {
    if (postOwnerId === bookmarkerId) return; // Don't notify self

    const notification = await this.create({
      user_id: postOwnerId,
      type: "post_bookmarked",
      data: {
        post_id: postId,
        post_title: postTitle,
        from_user_id: bookmarkerId,
        message: "bookmarked your post",
        redirect_url: `/home?post=${postId}`,
        timestamp: new Date().toISOString(),
      },
    });

    this._sendRealTimeNotification(postOwnerId, notification);
    return notification;
  }

  /**
   * Social Interaction Notifications
   */
  static async notifyUserFollowed(followedUserId, followerId, followerUsername) {
    const notification = await this.create({
      user_id: followedUserId,
      type: "follow",
      data: {
        from_user_id: followerId,
        follower_username: followerUsername,
        message: "started following you",
        redirect_url: `/profile/${followerId}`,
        timestamp: new Date().toISOString(),
      },
    });

    this._sendRealTimeNotification(followedUserId, notification);
    return notification;
  }

  /**
   * Message Notifications
   */
  static async notifyNewMessage(recipientId, senderId, senderUsername, messageContent, messageId) {
    const notification = await this.create({
      user_id: recipientId,
      type: "message",
      data: {
        from_user_id: senderId,
        sender_username: senderUsername,
        message_content: messageContent.substring(0, 100),
        message_id: messageId,
        message: "sent you a message",
        redirect_url: `/chat?user=${senderId}`,
        timestamp: new Date().toISOString(),
      },
    });

    this._sendRealTimeNotification(recipientId, notification);
    return notification;
  }

  /**
   * Gamification Notifications
   */
  static async notifyAchievementUnlocked(userId, achievementId, achievementTitle, achievementIcon) {
    const notification = await this.create({
      user_id: userId,
      type: "achievement",
      data: {
        achievement_id: achievementId,
        achievement_title: achievementTitle,
        achievement_icon: achievementIcon,
        message: `Achievement unlocked: ${achievementTitle}`,
        redirect_url: `/profile/${userId}?tab=achievements`,
        timestamp: new Date().toISOString(),
      },
    });

    this._sendRealTimeNotification(userId, notification);
    return notification;
  }

  static async notifyLevelUp(userId, newLevel, expGained) {
    const notification = await this.create({
      user_id: userId,
      type: "level_up",
      data: {
        new_level: newLevel,
        exp_gained: expGained,
        message: `Congratulations! You reached Level ${newLevel}`,
        redirect_url: `/profile/${userId}?tab=stats`,
        timestamp: new Date().toISOString(),
      },
    });

    this._sendRealTimeNotification(userId, notification);
    return notification;
  }

  static async notifyExpGained(userId, expAmount, reason) {
    const notification = await this.create({
      user_id: userId,
      type: "exp_gain",
      data: {
        exp_amount: expAmount,
        reason: reason,
        message: `+${expAmount} EXP gained`,
        redirect_url: `/profile/${userId}?tab=stats`,
        timestamp: new Date().toISOString(),
      },
    });

    this._sendRealTimeNotification(userId, notification);
    return notification;
  }

  static async notifyBadgeAwarded(userId, challengeId, challengeTitle, badgeImg, rank) {
    const notification = await this.create({
      user_id: userId,
      type: "badge",
      data: {
        challenge_id: challengeId,
        challenge_title: challengeTitle,
        badge_img: badgeImg,
        rank: rank,
        message: `You won ${rank ? `${rank} place` : "a badge"} in "${challengeTitle}"!`,
        redirect_url: `/challenges/${challengeId}`,
        timestamp: new Date().toISOString(),
      },
    });

    this._sendRealTimeNotification(userId, notification);
    return notification;
  }

  /**
   * Challenge Notifications
   */
  static async notifyChallengeCreated(challengeId, challengeTitle, challengeDescription) {
    // Notify all active users about new challenge
    // This would typically be sent to followers or based on user preferences
    const notification = {
      type: "challenge",
      data: {
        challenge_id: challengeId,
        challenge_title: challengeTitle,
        challenge_description: challengeDescription.substring(0, 200),
        message: `New challenge: "${challengeTitle}"`,
        redirect_url: `/challenges/${challengeId}`,
        timestamp: new Date().toISOString(),
      },
    };

    // This would be implemented based on your user targeting logic
    return notification;
  }

  static async notifyChallengeJoined(userId, challengeId, challengeTitle) {
    const notification = await this.create({
      user_id: userId,
      type: "challenge_joined",
      data: {
        challenge_id: challengeId,
        challenge_title: challengeTitle,
        message: `You joined the challenge: "${challengeTitle}"`,
        redirect_url: `/challenges/${challengeId}`,
        timestamp: new Date().toISOString(),
      },
    });

    this._sendRealTimeNotification(userId, notification);
    return notification;
  }

  static async notifyChallengeWinner(userId, challengeId, challengeTitle, rank, prize) {
    const notification = await this.create({
      user_id: userId,
      type: "challenge_winner",
      data: {
        challenge_id: challengeId,
        challenge_title: challengeTitle,
        rank: rank,
        prize: prize,
        message: `Congratulations! You won ${rank} place in "${challengeTitle}"`,
        redirect_url: `/challenges/${challengeId}`,
        timestamp: new Date().toISOString(),
      },
    });

    this._sendRealTimeNotification(userId, notification);
    return notification;
  }

  static async notifyChallengeDeadline(userId, challengeId, challengeTitle, hoursLeft) {
    const notification = await this.create({
      user_id: userId,
      type: "challenge_deadline",
      data: {
        challenge_id: challengeId,
        challenge_title: challengeTitle,
        hours_left: hoursLeft,
        message: `Challenge "${challengeTitle}" ends in ${hoursLeft} hours!`,
        redirect_url: `/challenges/${challengeId}`,
        timestamp: new Date().toISOString(),
      },
    });

    this._sendRealTimeNotification(userId, notification);
    return notification;
  }

  /**
   * Leaderboard Notifications
   */
  static async notifyPostInLeaderboard(userId, postId, postTitle, rank, leaderboardType) {
    const notification = await this.create({
      user_id: userId,
      type: "post_leaderboard",
      data: {
        post_id: postId,
        post_title: postTitle,
        rank: rank,
        leaderboard_type: leaderboardType, // 'daily' or 'weekly'        message: `Your post "${postTitle}" is #${rank} on the ${leaderboardType} leaderboard!`,
        redirect_url: `/home?post=${postId}`,
        timestamp: new Date().toISOString(),
      },
    });

    this._sendRealTimeNotification(userId, notification);
    return notification;
  }

  /**
   * Mention Notifications
   */
  static async notifyMention(mentionedUserId, mentionerId, postId, commentId, context) {
    const notification = await this.create({
      user_id: mentionedUserId,
      type: "mention",
      data: {
        post_id: postId,
        comment_id: commentId,
        from_user_id: mentionerId,
        context: context,
        message: "mentioned you in a comment",
        redirect_url: commentId ? `/home?post=${postId}&comment=${commentId}` : `/home?post=${postId}`,
        timestamp: new Date().toISOString(),
      },
    });

    this._sendRealTimeNotification(mentionedUserId, notification);
    return notification;
  }

  /**
   * System Notifications
   */
  static async notifySystemMessage(userId, title, message, redirectUrl = null) {
    const notification = await this.create({
      user_id: userId,
      type: "system",
      data: { title: title, message: message, redirect_url: redirectUrl || "/home", timestamp: new Date().toISOString() },
    });

    this._sendRealTimeNotification(userId, notification);
    return notification;
  }

  /**
   * Content Moderation Notifications
   */
  static async notifyPostReported(userId, postId, postTitle, reason) {
    const notification = await this.create({
      user_id: userId,
      type: "post_reported",
      data: {
        post_id: postId,
        post_title: postTitle,
        reason: reason,
        message: "Your post has been reported and is under review",
        redirect_url: `/home?post=${postId}`,
        timestamp: new Date().toISOString(),
      },
    });

    this._sendRealTimeNotification(userId, notification);
    return notification;
  }

  static async notifyPostFeatured(userId, postId, postTitle) {
    const notification = await this.create({
      user_id: userId,
      type: "post_featured",
      data: {
        post_id: postId,
        post_title: postTitle,
        message: `Your post "${postTitle}" has been featured!`,
        redirect_url: `/home?post=${postId}`,
        timestamp: new Date().toISOString(),
      },
    });

    this._sendRealTimeNotification(userId, notification);
    return notification;
  }

  static async notifyContentDeleted(userId, contentType, contentId, reason) {
    const notification = await this.create({
      user_id: userId,
      type: contentType === "post" ? "post_deleted" : "comment_deleted",
      data: {
        content_type: contentType,
        content_id: contentId,
        reason: reason,
        message: `Your ${contentType} has been removed: ${reason}`,
        redirect_url: "/home",
        timestamp: new Date().toISOString(),
      },
    });

    this._sendRealTimeNotification(userId, notification);
    return notification;
  }

  // =================== HELPER METHODS ===================
  /**
   * Send real-time notification via WebSocket
   */
  static _sendRealTimeNotification(userId, notification) {
    console.log(`[NOTIFICATION-SERVICE] 📨 Triggering real-time notification for user ${userId}`, {
      userId,
      notificationType: notification.type,
      notificationId: notification.id,
      timestamp: new Date().toISOString(),
    });

    try {
      // Import socket handler to avoid circular dependency
      const { sendNotification } = require("../socketHandler");
      sendNotification(userId, notification);

      console.log(`[NOTIFICATION-SERVICE] ✅ Real-time notification triggered successfully for user ${userId}`, {
        userId,
        notificationType: notification.type,
        notificationId: notification.id,
      });
    } catch (error) {
      console.error(`[NOTIFICATION-SERVICE] ❌ Failed to send real-time notification for user ${userId}:`, {
        userId,
        notificationType: notification.type,
        notificationId: notification.id,
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Get notifications with pagination and filtering
   */
  static async getNotificationsWithFilter(userId, options = {}) {
    const { page = 1, limit = 20, type = null, unread_only = false } = options;

    return NotificationRepository.getByUserWithFilter(userId, {
      page,
      limit,
      type,
      unread_only,
    });
  }

  /**
   * Get unread notification count
   */
  static async getUnreadCount(userId) {
    return NotificationRepository.getUnreadCount(userId);
  }

  /**
   * Mark notifications as read by type
   */
  static async markAsReadByType(userId, type) {
    return NotificationRepository.markAsReadByType(userId, type);
  }

  /**
   * Delete old notifications (cleanup job)
   */
  static async deleteOldNotifications(daysOld = 30) {
    return NotificationRepository.deleteOldNotifications(daysOld);
  }
}

module.exports = NotificationService;
