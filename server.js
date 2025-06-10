require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const bodyParser = require("body-parser");
require("./config/db");

const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
};

// ⛳️ HARUS di paling atas
app.use(cors(corsOptions));

// ⚠️ Jika kamu pakai express.json(), tidak perlu body-parser.json()
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

app.use("/api/storage/uploads", express.static(path.join(__dirname, "storage/uploads")));
app.use("/api/storage/avatars", express.static(path.join(__dirname, "storage/avatars")));
app.use("/api/storage/badges", express.static(path.join(__dirname, "storage/badges")));

require("./services/GamificationService");

// Initialize Challenge Scheduler
const ChallengeScheduler = require("./utils/ChallengeScheduler");
ChallengeScheduler.start();

app.get("/", (req, res) => {
  res.send("Hello World");
});

const apiRoutes = require("./routes/api");
app.use("/api", apiRoutes);

const http = require("http");
const { Server } = require("socket.io");
const { authenticateSocket, registerHandlers } = require("./socketHandler");

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Attach socket.io ke server HTTP
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

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
