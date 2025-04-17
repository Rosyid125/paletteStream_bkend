// Import all necessary repositories
const UserSocialLinkRepository = require("../repositories/UserSocialLinkRepository");

// Define the UserSocialLinkService class
class UserSocialLinkService {
  // Get all user social links by user id
  static async findAllByUserId(userId) {
    try {
      const userSocialLinks = await UserSocialLinkRepository.findAllByUserId(userId);

      // Map platforms to an array of strings
      const plcukedResult = userSocialLinks.map((link) => link.platform);

      return plcukedResult;
    } catch (error) {
      throw error;
    }
  }

  // Create a new user social links
  static async update(userId, platforms) {
    try {
      // Delete all user social links by user id
      await UserSocialLinkRepository.deleteAllByUserId(userId);
      // Create new user social links
      const userSocialLink = await UserSocialLinkRepository.create(userId, platforms);
      return userSocialLink;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserSocialLinkService;
