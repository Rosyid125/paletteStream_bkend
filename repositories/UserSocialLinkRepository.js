// Import model
const UserSocialLink = require("../models/UserSocialLink");
const customError = require("../errors/customError");
// for error handling
const currentRepo = "UserSocialLinkRepository";

// Define the UserSocialLinkRepository class
class UserSocialLinkRepository {
  // Get all user social links by user id
  static async findAllByUserId(userId) {
    try {
      const userSocialLinks = await UserSocialLink.query().select("platform").where("user_id", userId);

      return userSocialLinks;
    } catch (error) {
      throw new customError(`UserSocialLinkRepository Error: ${error.message}`);
    }
  }

  // Get user social link by user id and platform
  static async create(userId, platforms) {
    try {
      const userSocialLinks = platforms.map((platform) => ({
        user_id: userId,
        platform,
      }));

      const createdUserSocialLinks = [];
      for (const link of userSocialLinks) {
        const result = await UserSocialLink.query().insert(link);
        createdUserSocialLinks.push(result);
      }

      return createdUserSocialLinks;
    } catch (error) {
      throw new customError(`UserSocialLinkRepository Error: ${error.message}`);
    }
  }

  // Delete all user social links by user id
  static async deleteAllByUserId(userId) {
    try {
      await UserSocialLink.query().delete().where("user_id", userId);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserSocialLinkRepository;
