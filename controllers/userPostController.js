const UserPostService = require("../services/UserPostService");

class userPostController {
  // Get all current user posts
  static async getUserPost(req, res) {
    try {
      const { userId } = req.params;

      const userPost = await UserPostService.getUserPost(userId);

      if (!userPost) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      res.json({ success: true, data: userPost });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = userPostController;
