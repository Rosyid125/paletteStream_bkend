const UserService = require("../services/UserService");
const customError = require("../errors/customError");

//logger
const logger = require("../utils/winstonLogger");

class UserController {
  // Get all users
  static async getAllUsers(req, res) {
    try {
      const currentUserId = req.user.id;

      // get page and limit for pagination
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const users = await UserService.getAllUsers(currentUserId, page, limit);
      return res.status(200).json(users);
    } catch (error) {
      // Log the error message
      logger.error(`Error: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      return res.status(500).json({ success: false, message: "An unexpected error occurred." });
    }
  }

  // Get recommended users
  static async getRecommendedUsers(req, res) {
    try {
      const currentUserId = req.user.id;
      const users = await UserService.getRecommendedUsers(currentUserId);
      return res.status(200).json(users);
    } catch (error) {
      // Log the error message
      logger.error(`Error: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      return res.status(500).json({ success: false, message: "An unexpected error occurred." });
    }
  }

  // Get top leaderboard users with pagination
  static async getTopLeaderboardUsers(req, res) {
    try {
      const { page, limit } = req.query;

      // Convert page and limit to integers
      const parsedPage = parseInt(page) || 1;
      const parsedLimit = parseInt(limit) || 10;

      const users = await UserService.getLeaderboardUsers(parsedPage, parsedLimit);

      res.json({ success: true, data: users });
    } catch (error) {
      // Tangkap error dan log ke file
      logger.error(`Error: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      res.status(500).json({ success: false, messege: "An unexpected error occurred." });
    }
  }

  // Search users by username, name, or email
  static async searchUsers(req, res) {
    try {
      const { query, page, limit } = req.query;

      // Convert page and limit to integers
      const parsedPage = parseInt(page) || 1;
      const parsedLimit = parseInt(limit) || 10;

      const users = await UserService.searchByUsernameOrNameOrEmail(query, parsedPage, parsedLimit);

      res.json({ success: true, data: users });
    } catch (error) {
      // Log the error message
      logger.error(`Error: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      res.status(500).json({ success: false, message: "An unexpected error occurred." });
    }
  }
}

module.exports = UserController;
