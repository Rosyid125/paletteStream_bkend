require("dotenv").config();
const express = require("express");
const cors = require("cors");
const apiRoutes = require("./routes/api");
const cookieParser = require("cookie-parser");
const path = require("path"); // Pastikan path diimpor di sini!
const bodyParser = require("body-parser");
require("./config/db");

const app = express(); // Create an express app

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN, // Allow only this origin (your frontend)
  credentials: true, // Allow cookies/credentials (important for login)
};

// Middleware untuk melayani file statis di folder 'uploads' dan 'avatar'
app.use("/api/storage/uploads", express.static(path.join(__dirname, "storage/uploads")));
app.use("/api/storage/avatars", express.static(path.join(__dirname, "storage/avatars")));

// Increase the limit for JSON and URL-encoded payloads
app.use(bodyParser.json({ limit: "10mb" })); // Increase the size limit as necessary
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.use(express.json()); // Use the express.json() middleware
app.use(cors(corsOptions)); // Apply CORS with the configured options
app.use(cookieParser()); // Use the cookieParser middleware

// Impor GamificationService HANYA untuk memastikan listener terdaftar
require("./services/GamificationService"); // Sesuaikan path jika perlu

app.get("/", (req, res) => {
  // Create a route for the home page
  res.send("Hello World");
});

app.use("/api", apiRoutes); // Use the apiRoutes for the /api route

const PORT = process.env.PORT || 5000; // Set the port to the PORT environment variable or 5000
app.listen(PORT, () => {
  // Listen on
  console.log(`Server is running on port ${PORT}`);
});
