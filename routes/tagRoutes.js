const express = require("express");
const router = express.Router();
const TagController = require("../controllers/TagController");

// GET /tags/popular?limit=10
router.get("/popular", TagController.getPopularTags);

module.exports = router;
