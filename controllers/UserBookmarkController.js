const UserBookmarkService = require("../services/UserBookmarkService.js");
const logger = require("../utils/winstonLogger");

class UserBookmarkController {
  // Create and delete a user bookmark
  static async createDelete(req, res) {
    try {
      const { postId, userId } = req.body;

      const userBookmark = await UserBookmarkService.createDelete(postId, userId);

      res.json({ success: true, data: userBookmark });
    } catch (error) {
      // Log the error
      logger.error(`Error: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      res.status(500).json({ success: false, message: "An unexpected error occurred." });
    }
  }
}

module.exports = UserBookmarkController;
