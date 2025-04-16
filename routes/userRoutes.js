const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");
const { verifyAccessToken } = require("../middlewares/authMiddleware");

// Get all users
router.get("/", verifyAccessToken, userController.getAllUsers);
// Get recommended users
router.get("/recommended", verifyAccessToken, userController.getRecommendedUsers);

module.exports = router;
