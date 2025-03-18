const UserProfileService = require("../services/UserProfileService");

class UserProfileController {
  static async getUserProfile(req, res) {
    try {
      const { userId } = req.params;

      const userProfile = await UserProfileService.getUserProfile(userId);

      if (!userProfile) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      res.json({ success: true, data: userProfile });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = UserProfileController;
