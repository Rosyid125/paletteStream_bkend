// Frontend Real-time Notification Implementation
// File: frontend/src/services/notificationSocket.js

import io from "socket.io-client";

class NotificationSocket {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  // Connect to WebSocket server
  connect() {
    this.socket = io(process.env.REACT_APP_SOCKET_URL || "http://localhost:8000", {
      withCredentials: true, // Untuk mengirim cookies (accessToken)
      transports: ["websocket", "polling"],
    });

    this.socket.on("connect", () => {
      console.log("✅ Connected to notification server");
      this.isConnected = true;
    });

    this.socket.on("disconnect", () => {
      console.log("❌ Disconnected from notification server");
      this.isConnected = false;
    });

    // 🔔 LISTEN FOR REAL-TIME NOTIFICATIONS
    this.socket.on("receive_notification", (notification) => {
      console.log("📨 New notification received:", notification);

      // Handle notification in your app
      this.handleNewNotification(notification);
    });

    // Handle token refresh if needed
    this.socket.on("refresh_tokens", (tokens) => {
      console.log("🔄 Tokens refreshed");
      // Update your auth tokens
    });

    return this.socket;
  }

  // Handle incoming notifications
  handleNewNotification(notification) {
    // 1. Update notification badge count
    this.updateNotificationBadge();

    // 2. Show toast/popup notification
    this.showToastNotification(notification);

    // 3. Update notification list if user is viewing it
    this.updateNotificationList(notification);

    // 4. Play notification sound (optional)
    this.playNotificationSound();
  }

  // Update notification badge count
  updateNotificationBadge() {
    // Trigger your notification count update
    window.dispatchEvent(new CustomEvent("notificationReceived"));
  }

  // Show toast notification
  showToastNotification(notification) {
    // Example using react-hot-toast or similar
    const message = this.formatNotificationMessage(notification);

    // Show toast with click action
    toast(message, {
      onClick: () => {
        // Navigate to notification URL
        window.location.href = notification.data.redirect_url;
      },
      duration: 4000,
      icon: this.getNotificationIcon(notification.type),
    });
  }

  // Format notification message
  formatNotificationMessage(notification) {
    const { type, data } = notification;

    switch (type) {
      case "like":
        return `Someone liked your post: "${data.post_title}"`;
      case "comment":
        return `New comment on your post: "${data.post_title}"`;
      case "follow":
        return `${data.follower_username} started following you`;
      case "achievement":
        return `Achievement unlocked: ${data.achievement_title}`;
      case "level_up":
        return `Congratulations! You reached Level ${data.new_level}`;
      case "message":
        return `New message from ${data.sender_username}`;
      default:
        return data.message || "New notification";
    }
  }

  // Get notification icon
  getNotificationIcon(type) {
    const icons = {
      like: "❤️",
      comment: "💬",
      follow: "👥",
      achievement: "🏆",
      level_up: "⬆️",
      message: "📩",
      mention: "@",
      system: "🔔",
    };
    return icons[type] || "🔔";
  }

  // Update notification list
  updateNotificationList(notification) {
    // If user is viewing notification page, add new notification to top
    const event = new CustomEvent("newNotification", {
      detail: notification,
    });
    window.dispatchEvent(event);
  }

  // Play notification sound
  playNotificationSound() {
    // Only if user has enabled sounds
    if (this.getSoundPreference()) {
      const audio = new Audio("/sounds/notification.mp3");
      audio.volume = 0.3;
      audio.play().catch((e) => console.log("Could not play sound:", e));
    }
  }

  // Check user sound preference
  getSoundPreference() {
    return localStorage.getItem("notificationSound") !== "false";
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

// Export singleton instance
export default new NotificationSocket();
