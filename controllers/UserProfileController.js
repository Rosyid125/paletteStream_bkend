const { parse } = require("dotenv");
const UserProfileService = require("../services/UserProfileService");
// logger
const logger = require("../utils/winstonLogger");

class UserProfileController {
  // get user mini infos by user id
  static async getUserMiniInfos(req, res) {
    try {
      const { userId } = req.params;

      // Convert userId to an integer
      const parsedUserId = parseInt(userId);

      const userProfile = await UserProfileService.findMiniInfosByUserId(parsedUserId);

      if (!userProfile) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      res.json({ success: true, data: userProfile });
    } catch (error) {
      // Tangkap error dan log ke file
      logger.error(`Error: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      res.status(500).json({ success: false, messege: "An unexpected error occurred." });
    }
  }

  // get user profile and other neccesaries data by user id
  static async getUserProfile(req, res) {
    try {
      const { userId } = req.params;

      // Get current user id from token
      const currentUserId = req.user.id;

      const userProfile = await UserProfileService.getUserProfile(currentUserId, userId);

      if (!userProfile) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      res.json({ success: true, data: userProfile });
    } catch (error) {
      // Tangkap error dan log ke file
      logger.error(`Error: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      res.status(500).json({ success: false, messege: "An unexpected error occurred." });
    }
  }

  // update user profile
  static async updateUserProfile(req, res) {
    try {
      let { userId } = req.params;
      const { name, avatar, bio, location, platforms } = req.body;

      // Convert userId to an integer
      userId = parseInt(userId);

      const userProfile = await UserProfileService.updateUserProfile(userId, name, avatar, bio, location, platforms);

      res.json({ success: true, data: userProfile });
    } catch (error) {
      // Tangkap error dan log ke file
      logger.error(`Error: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      res.status(500).json({ success: false, messege: "An unexpected error occurred." });
    }
  }
}

module.exports = UserProfileController;
