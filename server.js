require("dotenv").config();
const express = require("express");
const cors = require("cors");
const apiRoutes = require("./routes/api");
const cookieParser = require("cookie-parser");

const app = express(); // Create an express app

// CORS configuration
const corsOptions = {
  origin: "http://localhost:5174", // Allow only this origin (your frontend)
  credentials: true, // Allow cookies/credentials (important for login)
};

app.use(express.json()); // Use the express.json() middleware
app.use(cors(corsOptions)); // Apply CORS with the configured options
app.use(cookieParser()); // Use the cookieParser middleware

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
