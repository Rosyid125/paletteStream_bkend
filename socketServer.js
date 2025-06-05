const http = require("http");
const { Server } = require("socket.io");
const app = require("./server");
const { authenticateSocket, registerHandlers } = require("./socketHandler");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  },
});

io.use(authenticateSocket);
io.on("connection", (socket) => {
  registerHandlers(io, socket);
});

module.exports = server;
