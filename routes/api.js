const express = require("express");
const router = express.Router();
const userRoutes = require("./userRoutes"); // Import the userRoutes

router.use("/users", userRoutes); // Use the userRoutes for the /users route

module.exports = router; // Export the router
