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

require("./services/GamificationService");

app.get("/", (req, res) => {
  res.send("Hello World");
});

const apiRoutes = require("./routes/api");
app.use("/api", apiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
