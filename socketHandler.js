const jwt = require("jsonwebtoken");
const ChatService = require("./services/ChatService");

const connectedUsers = new Map(); // userId -> socket

function authenticateSocket(socket, next) {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("Authentication error"));
  try {
    const user = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    socket.user = user;
    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
}

function registerHandlers(io, socket) {
  const userId = socket.user.id;
  connectedUsers.set(userId, socket);

  socket.on("send_message", async (payload) => {
    // payload: { receiver_id, content }
    const { receiver_id, content } = payload;
    const message = await ChatService.sendMessage({ sender_id: userId, receiver_id, content });
    // Emit ke receiver jika online
    const receiverSocket = connectedUsers.get(receiver_id);
    if (receiverSocket) {
      receiverSocket.emit("receive_message", {
        id: message.id,
        sender_id: userId,
        receiver_id,
        content: message.content,
        created_at: message.created_at,
      });
    }
    // Emit ke pengirim (konfirmasi)
    socket.emit("message_sent", {
      id: message.id,
      receiver_id,
      content: message.content,
      created_at: message.created_at,
    });
  });

  socket.on("mark_as_read", async (payload) => {
    // payload: { message_id }
    await ChatService.markAsRead(payload.message_id);
  });

  socket.on("disconnect", () => {
    connectedUsers.delete(userId);
  });
}

function sendNotification(userId, notification) {
  const receiverSocket = connectedUsers.get(userId);
  if (receiverSocket) {
    receiverSocket.emit("receive_notification", notification);
  }
}

module.exports = { authenticateSocket, registerHandlers, sendNotification };
