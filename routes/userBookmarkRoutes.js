const express = require("express");
const router = express.Router();
const UserBookmarkController = require("../controllers/UserBookmarkController");
const { verifyAccessToken } = require("../middlewares/authMiddleware");

// Create and delete a user bookmark
router.post("/create-delete", verifyAccessToken, UserBookmarkController.createDelete);

module.exports = router;
