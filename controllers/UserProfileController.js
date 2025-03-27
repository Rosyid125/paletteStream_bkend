const UserProfileService = require("../services/UserProfileService");

class UserProfileController {
  // get user profile and other neccesaries data by user id
  static async getUserProfile(req, res) {
    try {
      const { userId } = req.params;

      const userProfile = await UserProfileService.getUserProfile(userId);

      if (!userProfile) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      res.json({ success: true, data: userProfile });
    } catch (error) {
      res.status(500).json({ success: false, messege: "An unexpected error occurred." });
    }
  }

  // update user profile
  static async updateUserProfile(req, res) {
    try {
      let { userId } = req.params;
      const { name, bio, avatar, location } = req.body;

      // Convert userId to an integer
      userId = parseInt(userId);

      const userProfile = await UserProfileService.updateUserProfile(userId, name, bio, avatar, location);

      res.json({ success: true, data: userProfile });
    } catch (error) {
      res.status(500).json({ success: false, messege: "An unexpected error occurred." });
    }
  }
}

module.exports = UserProfileController;
