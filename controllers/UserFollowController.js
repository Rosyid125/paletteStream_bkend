const UserFollowService = require("../services/UserFollowService");
// import logger
const logger = require("../utils/winstonLogger");

class UserFollowController {
  // Get all user follows by follower id
  static async findByFollowerId(req, res) {
    try {
      const { followerId } = req.params;

      const userFollows = await UserFollowService.findByFollowerId(followerId);

      res.json(userFollows);
    } catch (error) {
      // Log the error using logger
      logger.error(`Error: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      res.status(500).json({ success: false, messege: "An unexpected error occurred." });
    }
  }

  // Get all user follows by followed id
  static async findByFollowedId(req, res) {
    try {
      const { followedId } = req.params;

      const userFollows = await UserFollowService.findByFollowedId(followedId);

      res.json(userFollows);
    } catch (error) {
      // Log the error using logger
      logger.error(`Error: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      res.status(500).json({ success: false, messege: "An unexpected error occurred." });
    }
  }

  // Get user followers with pagination
  static async getFollowersWithPagination(req, res) {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 10 } = req.query;

      const result = await UserFollowService.getFollowersWithPagination(userId, page, limit);

      res.json({
        success: true,
        message: "Followers retrieved successfully",
        ...result,
      });
    } catch (error) {
      // Log the error using logger
      logger.error(`Error: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      res.status(500).json({ success: false, message: "An unexpected error occurred." });
    }
  }

  // Get user following with pagination
  static async getFollowingWithPagination(req, res) {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 10 } = req.query;

      const result = await UserFollowService.getFollowingsWithPagination(userId, page, limit);

      res.json({
        success: true,
        message: "Following retrieved successfully",
        ...result,
      });
    } catch (error) {
      // Log the error using logger
      logger.error(`Error: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      res.status(500).json({ success: false, message: "An unexpected error occurred." });
    }
  }

  // Create and delete a user follow
  static async createDelete(req, res) {
    try {
      // Get followerId from token and followedId from params
      const followerId = req.user.id;
      let { followedId } = req.params;

      // Turn params into integer
      followedId = parseInt(followedId);

      const userFollow = await UserFollowService.createDelete(followerId, followedId);

      res.json(userFollow);
    } catch (error) {
      // Log the error using logger
      logger.error(`Error: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      res.status(500).json({ success: false, messege: "An unexpected error occurred." });
    }
  }

  // // Delete a user follow
  // static async delete(req, res) {
  //   try {
  //     const { followerId, followedId } = req.body;

  //     const userFollow = await UserFollowService.delete(followerId, followedId);

  //     res.json(userFollow);
  //   } catch (error) {
  //     res.status(500).json({ success: false, messege: "An unexpected error occurred." });
  //   }
  // }
}

module.exports = UserFollowController;
