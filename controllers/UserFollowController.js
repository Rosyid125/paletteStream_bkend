const UserFollowService = require("../services/UserFollowService");

class UserFollowController {
  // Get all user follows by follower id
  static async findByFollowerId(req, res) {
    try {
      const { followerId } = req.params;

      const userFollows = await UserFollowService.findByFollowerId(followerId);

      res.json(userFollows);
    } catch (error) {
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
      res.status(500).json({ success: false, messege: "An unexpected error occurred." });
    }
  }

  // Create a new user follow
  static async create(req, res) {
    try {
      const { followerId, followedId } = req.body;

      const userFollow = await UserFollowService.create(followerId, followedId);

      res.json(userFollow);
    } catch (error) {
      res.status(500).json({ success: false, messege: "An unexpected error occurred." });
    }
  }

  // Delete a user follow
  static async delete(req, res) {
    try {
      const { followerId, followedId } = req.body;

      const userFollow = await UserFollowService.delete(followerId, followedId);

      res.json(userFollow);
    } catch (error) {
      res.status(500).json({ success: false, messege: "An unexpected error occurred." });
    }
  }
}

module.exports = UserFollowController;
