# PaletteStream - Notification System API Documentation

## 📋 Overview

Sistem notifikasi PaletteStream menyediakan notifikasi real-time menggunakan WebSocket dan REST API untuk berbagai aktivitas pengguna seperti interaksi sosial, gamifikasi, challenge, dan moderasi konten.

## 🔧 Setup & Authentication

### WebSocket Connection

```javascript
// Frontend - Connect to WebSocket
import io from "socket.io-client";

const socket = io(process.env.VITE_SOCKET_URL, {
  withCredentials: true, // Untuk authentication via cookies
  transports: ["websocket", "polling"],
});

// Listen for connection
socket.on("connect", () => {
  console.log("Connected to notification server");
});

// Handle authentication errors
socket.on("connect_error", (error) => {
  console.error("WebSocket connection failed:", error);
});
```

### Authentication Requirements

- **REST API**: Bearer token di header `Authorization`
- **WebSocket**: Authentication via HTTP-only cookies (otomatis)

## 🚀 REST API Endpoints

### 1. Get User Notifications

```http
GET /api/notifications
```

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**

- `page` (optional): Halaman pagination (default: 1)
- `limit` (optional): Jumlah per halaman (default: 20)
- `type` (optional): Filter by notification type
- `unread_only` (optional): Hanya notifikasi belum dibaca (true/false)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 123,
      "user_id": 456,
      "type": "like",
      "title": "Post Liked",
      "message": "john_doe liked your post 'Amazing Anime Art'",
      "data": {
        "post_id": 789,
        "from_user_id": 101,
        "from_username": "john_doe",
        "post_title": "Amazing Anime Art"
      },
      "redirect_url": "/home?post=789",
      "is_read": false,
      "created_at": "2025-06-12T10:30:00.000Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_count": 100,
    "has_next": true,
    "has_prev": false
  }
}
```

### 2. Get Unread Count

```http
GET /api/notifications/unread-count
```

**Response:**

```json
{
  "success": true,
  "data": {
    "unread_count": 5
  }
}
```

### 3. Mark Notification as Read

```http
POST /api/notifications/read
```

**Body Options:**

**Option 1 - Mark specific notification:**

```json
{
  "notification_id": 123
}
```

**Option 2 - Mark all notifications by type:**

```json
{
  "type": "like"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

### 4. Mark All Notifications as Read

```http
POST /api/notifications/mark-all-read
```

**Response:**

```json
{
  "success": true,
  "message": "All notifications marked as read"
}
```

### 5. Get Notifications by Type

```http
GET /api/notifications/type/:type
```

**Parameters:**

- `type`: Jenis notifikasi (like, comment, follow, etc.)

**Response:** Same as Get User Notifications

### 6. Get Available Notification Types

```http
GET /api/notifications/types
```

**Response:**

```json
{
  "success": true,
  "data": [
    "like",
    "comment",
    "reply",
    "follow",
    "message",
    "achievement_unlocked",
    "level_up",
    "exp_gain",
    "challenge_winner",
    "challenge_badge",
    "challenge_deadline",
    "post_leaderboard",
    "post_reported",
    "post_featured",
    "post_deleted",
    "comment_deleted",
    "mention",
    "system"
  ]
}
```

## 📡 WebSocket Events

### Incoming Events (Server → Client)

#### 1. receive_notification

Menerima notifikasi real-time baru.

```javascript
socket.on("receive_notification", (notification) => {
  console.log("New notification:", notification);

  // notification object sama dengan format REST API
  // {
  //   id: 123,
  //   type: "like",
  //   title: "Post Liked",
  //   message: "john_doe liked your post",
  //   data: { ... },
  //   redirect_url: "/home?post=789",
  //   is_read: false,
  //   created_at: "2025-06-12T10:30:00.000Z"
  // }

  // Update UI
  updateNotificationUI(notification);
  updateUnreadCount();
});
```

#### 2. refresh_tokens

Mendapat token JWT yang diperbarui.

```javascript
socket.on("refresh_tokens", (tokens) => {
  // Update stored tokens
  localStorage.setItem("accessToken", tokens.accessToken);
  localStorage.setItem("refreshToken", tokens.refreshToken);
});
```

### Outgoing Events (Client → Server)

Tidak ada outgoing events yang diperlukan. Semua notifikasi dikirim otomatis berdasarkan aktivitas di sistem.

## 📝 Notification Types & Data Structure

### 1. Social Interaction Notifications

#### Like Notification

```json
{
  "type": "like",
  "title": "Post Liked",
  "message": "john_doe liked your post 'Amazing Art'",
  "data": {
    "post_id": 789,
    "from_user_id": 101,
    "from_username": "john_doe",
    "post_title": "Amazing Art"
  },
  "redirect_url": "/home?post=789"
}
```

#### Comment Notification

```json
{
  "type": "comment",
  "title": "New Comment",
  "message": "jane_doe commented on your post 'Cool Drawing'",
  "data": {
    "post_id": 456,
    "comment_id": 123,
    "from_user_id": 202,
    "from_username": "jane_doe",
    "post_title": "Cool Drawing",
    "comment_content": "This is amazing!"
  },
  "redirect_url": "/home?post=456&comment=123"
}
```

#### Reply Notification

```json
{
  "type": "reply",
  "title": "Comment Reply",
  "message": "alex_art replied to your comment",
  "data": {
    "post_id": 789,
    "comment_id": 456,
    "reply_id": 123,
    "from_user_id": 303,
    "from_username": "alex_art",
    "post_title": "Beautiful Manga",
    "reply_content": "I agree with you!"
  },
  "redirect_url": "/home?post=789&comment=456"
}
```

#### Follow Notification

```json
{
  "type": "follow",
  "title": "New Follower",
  "message": "mikasa_fan started following you",
  "data": {
    "from_user_id": 404,
    "from_username": "mikasa_fan"
  },
  "redirect_url": "/profile/404"
}
```

#### Bookmark Notification

```json
{
  "type": "post_bookmarked",
  "title": "Post Bookmarked",
  "message": "eren_artist bookmarked your post 'Titan Art'",
  "data": {
    "post_id": 567,
    "from_user_id": 505,
    "from_username": "eren_artist",
    "post_title": "Titan Art"
  },
  "redirect_url": "/home?post=567"
}
```

### 2. Message System

#### Direct Message

```json
{
  "type": "message",
  "title": "New Message",
  "message": "You have a new message from levi_captain",
  "data": {
    "from_user_id": 606,
    "from_username": "levi_captain",
    "message_preview": "Hey, nice artwork!"
  },
  "redirect_url": "/chat?user=606"
}
```

### 3. Gamification System

#### Achievement Unlocked

```json
{
  "type": "achievement_unlocked",
  "title": "Achievement Unlocked!",
  "message": "You unlocked 'First Post' achievement!",
  "data": {
    "achievement_id": 1,
    "achievement_name": "First Post",
    "achievement_description": "Create your first post",
    "achievement_icon": "🎯"
  },
  "redirect_url": "/profile/456?tab=achievements"
}
```

#### Level Up

```json
{
  "type": "level_up",
  "title": "Level Up!",
  "message": "Congratulations! You reached level 5",
  "data": {
    "new_level": 5,
    "previous_level": 4,
    "exp_required": 1000,
    "current_exp": 1050
  },
  "redirect_url": "/profile/456?tab=stats"
}
```

#### EXP Gain

```json
{
  "type": "exp_gain",
  "title": "EXP Gained",
  "message": "You gained 50 EXP from post interactions!",
  "data": {
    "exp_amount": 50,
    "total_exp": 850,
    "source": "post_interactions"
  },
  "redirect_url": "/profile/456?tab=stats"
}
```

### 4. Challenge System

#### Challenge Winner

```json
{
  "type": "challenge_winner",
  "title": "Challenge Winner!",
  "message": "You won 1st place in 'Weekly Anime Art' challenge!",
  "data": {
    "challenge_id": 123,
    "challenge_title": "Weekly Anime Art",
    "rank": 1,
    "prize": "500 EXP + Gold Badge"
  },
  "redirect_url": "/challenges/123"
}
```

#### Challenge Badge

```json
{
  "type": "challenge_badge",
  "title": "Badge Earned!",
  "message": "You earned 'Anime Master' badge from challenge!",
  "data": {
    "challenge_id": 123,
    "badge_name": "Anime Master",
    "badge_icon": "🏆"
  },
  "redirect_url": "/challenges/123"
}
```

#### Challenge Deadline

```json
{
  "type": "challenge_deadline",
  "title": "Challenge Deadline Reminder",
  "message": "'Weekly Manga Art' challenge ends in 6 hours!",
  "data": {
    "challenge_id": 456,
    "challenge_title": "Weekly Manga Art",
    "hours_remaining": 6,
    "deadline": "2025-06-12T18:00:00.000Z"
  },
  "redirect_url": "/challenges/456"
}
```

### 5. Leaderboard System

#### Post Leaderboard

```json
{
  "type": "post_leaderboard",
  "title": "Trending Post!",
  "message": "Your post 'Dragon Ball Art' is trending in Top 10!",
  "data": {
    "post_id": 789,
    "post_title": "Dragon Ball Art",
    "rank": 7,
    "leaderboard_type": "daily"
  },
  "redirect_url": "/home?post=789"
}
```

### 6. Content Moderation

#### Post Reported

```json
{
  "type": "post_reported",
  "title": "Post Under Review",
  "message": "Your post has been reported and is under review",
  "data": {
    "post_id": 456,
    "post_title": "My Artwork",
    "report_reason": "inappropriate_content"
  },
  "redirect_url": "/home?post=456"
}
```

#### Post Featured

```json
{
  "type": "post_featured",
  "title": "Post Featured!",
  "message": "Your post 'Amazing Illustration' has been featured!",
  "data": {
    "post_id": 123,
    "post_title": "Amazing Illustration"
  },
  "redirect_url": "/home?post=123"
}
```

#### Content Deleted

```json
{
  "type": "post_deleted",
  "title": "Content Removed",
  "message": "Your post has been removed by moderators",
  "data": {
    "post_id": 789,
    "post_title": "Deleted Post",
    "reason": "Terms of service violation"
  },
  "redirect_url": "/home"
}
```

### 7. Mention System

#### Mention Notification

```json
{
  "type": "mention",
  "title": "You were mentioned",
  "message": "naruto_fan mentioned you in a comment",
  "data": {
    "post_id": 456,
    "comment_id": 123,
    "from_user_id": 707,
    "from_username": "naruto_fan",
    "post_title": "Hokage Art",
    "comment_content": "Hey @your_username, check this out!"
  },
  "redirect_url": "/home?post=456&comment=123"
}
```

### 8. System Notifications

#### System Message

```json
{
  "type": "system",
  "title": "System Announcement",
  "message": "Welcome to PaletteStream! Start sharing your art today.",
  "data": {
    "announcement_type": "welcome",
    "priority": "normal"
  },
  "redirect_url": "/home"
}
```

## 🎯 Frontend Implementation Guide

### 1. Complete Notification Component

```javascript
// NotificationComponent.jsx
import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const NotificationComponent = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize WebSocket connection
    const socketConnection = io(process.env.VITE_SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    // Listen for new notifications
    socketConnection.on("receive_notification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);

      // Show toast notification
      showToastNotification(notification);
    });

    // Handle token refresh
    socketConnection.on("refresh_tokens", (tokens) => {
      localStorage.setItem("accessToken", tokens.accessToken);
      localStorage.setItem("refreshToken", tokens.refreshToken);
    });

    setSocket(socketConnection);

    // Load initial notifications
    loadNotifications();
    loadUnreadCount();

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await fetch("/api/notifications", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setNotifications(data.data);
      }
    } catch (error) {
      console.error("Failed to load notifications:", error);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const response = await fetch("/api/notifications/unread-count", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setUnreadCount(data.data.unread_count);
      }
    } catch (error) {
      console.error("Failed to load unread count:", error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await fetch("/api/notifications/read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ notification_id: notificationId }),
      });

      // Update local state
      setNotifications((prev) => prev.map((notif) => (notif.id === notificationId ? { ...notif, is_read: true } : notif)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications/mark-all-read", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      setNotifications((prev) => prev.map((notif) => ({ ...notif, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const handleNotificationClick = (notification) => {
    // Mark as read
    if (!notification.is_read) {
      markAsRead(notification.id);
    }

    // Navigate to redirect URL
    window.location.href = notification.redirect_url;
  };

  const showToastNotification = (notification) => {
    // Implement toast notification here
    console.log("New notification:", notification.message);
  };

  return (
    <div className="notification-container">
      <div className="notification-header">
        <h3>Notifications</h3>
        {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
        <button onClick={markAllAsRead}>Mark All Read</button>
      </div>

      <div className="notification-list">
        {notifications.map((notification) => (
          <div key={notification.id} className={`notification-item ${!notification.is_read ? "unread" : ""}`} onClick={() => handleNotificationClick(notification)}>
            <div className="notification-content">
              <h4>{notification.title}</h4>
              <p>{notification.message}</p>
              <small>{new Date(notification.created_at).toLocaleString()}</small>
            </div>
            {!notification.is_read && <div className="unread-indicator"></div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationComponent;
```

### 2. URL Handling for Notifications

```javascript
// Router setup untuk menangani notification redirects
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const useNotificationHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    // Handle post highlighting
    const postId = params.get("post");
    const commentId = params.get("comment");

    if (postId) {
      // Scroll to and highlight post
      setTimeout(() => {
        const postElement = document.getElementById(`post-${postId}`);
        if (postElement) {
          postElement.scrollIntoView({ behavior: "smooth" });
          postElement.classList.add("highlighted");

          // Handle comment highlighting
          if (commentId) {
            const commentElement = document.getElementById(`comment-${commentId}`);
            if (commentElement) {
              commentElement.scrollIntoView({ behavior: "smooth" });
              commentElement.classList.add("highlighted");
            }
          }
        }
      }, 100);
    }

    // Handle profile tabs
    const tab = params.get("tab");
    if (tab && location.pathname.includes("/profile/")) {
      // Switch to specific tab
      const tabElement = document.querySelector(`[data-tab="${tab}"]`);
      if (tabElement) {
        tabElement.click();
      }
    }

    // Handle chat user selection
    const userId = params.get("user");
    if (userId && location.pathname === "/chat") {
      // Select chat user
      selectChatUser(userId);
    }
  }, [location]);
};
```

### 3. Toast Notification System

```javascript
// ToastNotification.jsx
import React, { useState, useEffect } from "react";

const ToastNotification = ({ notification, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // Wait for animation
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleClick = () => {
    window.location.href = notification.redirect_url;
    onClose();
  };

  return (
    <div className={`toast-notification ${visible ? "visible" : "hidden"}`}>
      <div className="toast-content" onClick={handleClick}>
        <div className="toast-icon">{getNotificationIcon(notification.type)}</div>
        <div className="toast-text">
          <h4>{notification.title}</h4>
          <p>{notification.message}</p>
        </div>
        <button
          className="toast-close"
          onClick={(e) => {
            e.stopPropagation();
            setVisible(false);
            setTimeout(onClose, 300);
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
};

const getNotificationIcon = (type) => {
  const icons = {
    like: "❤️",
    comment: "💬",
    reply: "↩️",
    follow: "👥",
    message: "📩",
    achievement_unlocked: "🏆",
    level_up: "⬆️",
    exp_gain: "⭐",
    challenge_winner: "🥇",
    challenge_badge: "🏅",
    challenge_deadline: "⏰",
    post_leaderboard: "📈",
    post_featured: "✨",
    mention: "@",
    system: "🔔",
  };
  return icons[type] || "🔔";
};
```

## 🔐 Security & Best Practices

### Authentication

- WebSocket menggunakan cookie-based authentication
- REST API menggunakan Bearer token
- Automatic token refresh via WebSocket

### Error Handling

```javascript
// Handle connection errors
socket.on("connect_error", (error) => {
  console.error("WebSocket connection failed:", error);
  // Fallback to polling REST API
  fallbackToPolling();
});

// Handle notification errors
socket.on("error", (error) => {
  console.error("Notification error:", error);
});
```

### Rate Limiting

- API endpoints memiliki rate limiting
- WebSocket connections dibatasi per user

## 🎛️ Testing

### Manual Testing

```bash
# Test REST API
curl -H "Authorization: Bearer <token>" http://localhost:3000/api/notifications

# Test WebSocket dengan Postman atau WebSocket client
```

### Frontend Testing

```javascript
// Test notification component
import { render, screen } from "@testing-library/react";
import NotificationComponent from "./NotificationComponent";

test("should display notifications", () => {
  render(<NotificationComponent />);
  expect(screen.getByText("Notifications")).toBeInTheDocument();
});
```

## 📚 Conclusion

Dokumentasi ini memberikan panduan lengkap untuk mengintegrasikan sistem notifikasi PaletteStream di frontend. Sistem ini menyediakan:

- **Real-time notifications** via WebSocket
- **RESTful API** untuk operasi CRUD
- **Comprehensive notification types** untuk semua fitur platform
- **URL routing** yang konsisten untuk navigation
- **Error handling** dan fallback mechanisms

Implementasikan sesuai dengan contoh kode yang diberikan untuk mendapatkan sistem notifikasi yang responsive dan user-friendly.
