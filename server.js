// This is a file for server setup and running the server
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const apiRoutes = require("./routes/api");

const app = express(); // Create an express app

app.use(express.json()); // Use the express.json() middleware
app.use(cors()); // Use the cors middleware

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
