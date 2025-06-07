const jwt = require("jsonwebtoken");
const ChatService = require("./services/ChatService");
const AuthService = require("./services/AuthService");
const logger = require("./utils/winstonLogger");

const connectedUsers = new Map(); // userId -> socket

async function verifySocketAccessToken(socket, next) {
  try {
    const cookie = socket.request.headers.cookie;
    let accessToken = null;
    let refreshToken = null;
    if (cookie) {
      const accessMatch = cookie.match(/accessToken=([^;]+)/);
      const refreshMatch = cookie.match(/refreshToken=([^;]+)/);
      if (accessMatch) accessToken = accessMatch[1];
      if (refreshMatch) refreshToken = refreshMatch[1];
    }
    if (!accessToken) {
      return next(new Error("Unauthorized: No access token"));
    }
    try {
      const user = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
      socket.user = user;
      logger.info(`[SOCKET] User ${user.id} authenticated`);
      return next();
    } catch (err) {
      if (!refreshToken) {
        logger.error(`[SOCKET] Authentication error: ${err.message}`);
        return next(new Error("Unauthorized: Invalid access token and no refresh token"));
      }
      try {
        const user = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await AuthService.refreshToken(refreshToken);
        socket.user = user;
        socket.newTokens = { accessToken: newAccessToken, refreshToken: newRefreshToken };
        logger.info(`[SOCKET] User ${user.id} authenticated via refresh token`);
        return next();
      } catch (refreshError) {
        logger.error(`[SOCKET] Refresh token error: ${refreshError.message}`);
        return next(new Error("Invalid or expired token"));
      }
    }
  } catch (e) {
    logger.error(`[SOCKET] Auth error: ${e.message}`);
    return next(new Error("Authentication error"));
  }
}

function registerHandlers(io, socket) {
  const userId = socket.user.id;
  connectedUsers.set(userId, socket);
  socket.join(`user_${userId}`); // join ke room user id
  logger.info(`[SOCKET] User ${userId} connected`);

  // Kirim token baru jika ada (hasil refresh)
  if (socket.newTokens) {
    // Kirim via event
    socket.emit("refresh_tokens", socket.newTokens);
    // Set cookie httpOnly di handshake response jika memungkinkan (Socket.IO v4+)
    if (socket.handshake && socket.handshake.res) {
      const res = socket.handshake.res;
      res.cookie("accessToken", socket.newTokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      });
      res.cookie("refreshToken", socket.newTokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      });
    }
  }

  // socketHandler.js (Backend)
  socket.on("send_message", async (payload, ackCallback) => {
    // Tambahkan ackCallback
    try {
      logger.info(`[SOCKET] User ${userId} send_message:`, payload);
      const { receiver_id, content } = payload;
      const message = await ChatService.sendMessage({ sender_id: userId, receiver_id, content });
      message.created_at = new Date().toISOString(); // Tetap pastikan ini konsisten

      const messageData = {
        id: message.id,
        sender_id: userId, // Pastikan sender_id dari user yang terautentikasi (socket.user.id)
        receiver_id,
        content: message.content,
        created_at: message.created_at,
      };

      // Emit ke sender via room (untuk update UI real-time di semua tab/device sender)
      io.to(`user_${userId}`).emit("message_sent", messageData);

      // Emit ke receiver via room
      io.to(`user_${receiver_id}`).emit("receive_message", messageData);

      const receiverUnreadCount = await ChatService.getUnreadCount(userId, receiver_id);
      const senderUnreadCount = await ChatService.getUnreadCount(receiver_id, userId);

      io.to(`user_${receiver_id}`).emit("chat_list_update", {
        user_id: userId,
        last_message: message.content,
        last_message_time: message.created_at,
        unread_count: senderUnreadCount,
      });

      io.to(`user_${userId}`).emit("chat_list_update", {
        user_id: receiver_id,
        last_message: message.content,
        last_message_time: message.created_at,
        unread_count: receiverUnreadCount,
      });

      console.log("[DEBUG] unreadCount:", senderUnreadCount, receiverUnreadCount);

      logger.info(`[SOCKET] Message id ${message.id} from ${userId} to ${receiver_id} processed.`);

      // Panggil acknowledgement untuk client yang mengirim
      if (typeof ackCallback === "function") {
        ackCallback({ success: true, message: "Message sent successfully", data: messageData });
      }
    } catch (err) {
      logger.error(`[SOCKET] send_message error: ${err.message}`, { payload });
      // Panggil acknowledgement dengan error
      if (typeof ackCallback === "function") {
        ackCallback({ error: "Failed to send message: " + err.message });
      }
    }
  });

  socket.on("mark_as_read", async (payload) => {
    try {
      logger.info(`[SOCKET] User ${userId} mark_as_read:`, payload);
      console.log("[DEBUG] mark_as_read payload:", payload);
      await ChatService.markAsRead(payload.message_id);
      // Emit ke sender untuk update UI
      console.log("[DEBUG] emit message_read to sender:", payload.sender_id, payload.message_id, userId);
      // Get sernder_id from payload from database
      io.to(`user_${payload.sender_id}`).emit("message_read", {
        message_id: payload.message_id,
        reader_id: userId,
      });

      const receiverUnreadCount = await ChatService.getUnreadCount(payload.sender_id, userId);
      const senderUnreadCount = await ChatService.getUnreadCount(userId, payload.sender_id);

      const message = await ChatService.getHistory(userId, payload.sender_id).then((messages) => messages.find((m) => m.id === payload.message_id));
      if (!message) {
        logger.error(`[SOCKET] mark_as_read: Message not found for id ${payload.message_id}`);
        return;
      }

      io.to(`user_${userId}`).emit("chat_list_update", {
        user_id: payload.sender_id,
        last_message: message.content,
        last_message_time: message.created_at,
        unread_count: senderUnreadCount,
      });

      io.to(`user_${payload.sender_id}`).emit("chat_list_update", {
        user_id: userId,
        last_message: message.content,
        last_message_time: message.created_at,
        unread_count: receiverUnreadCount,
      });

      logger.info(`[SOCKET] Message id ${payload.message_id} marked as read by ${userId}`);
    } catch (err) {
      logger.error(`[SOCKET] mark_as_read error: ${err.message}`);
      console.log("[DEBUG] mark_as_read error:", err);
    }
  });

  socket.on("disconnect", () => {
    connectedUsers.delete(userId);
    logger.info(`[SOCKET] User ${userId} disconnected`);
  });
}

function sendNotification(userId, notification) {
  const receiverSocket = connectedUsers.get(userId);
  if (receiverSocket) {
    receiverSocket.emit("receive_notification", notification);
    logger.info(`[SOCKET] Notification sent to user ${userId}`);
  }
}

module.exports = { authenticateSocket: verifySocketAccessToken, registerHandlers, sendNotification };
