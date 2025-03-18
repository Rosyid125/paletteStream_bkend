const express = require("express");
const router = express.Router();
const userRoutes = require("./userRoutes"); // Import the userRoutes
const authRoutes = require("./authRoutes"); // Import the authRoutes

router.use("/users", userRoutes); // Use the userRoutes for the /users route
router.use("/auth", authRoutes); // Use the authRoutes for the /auth route

module.exports = router; // Export the router
