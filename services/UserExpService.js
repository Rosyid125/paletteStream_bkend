// Import repository
const UserExpRepository = require("../repositories/UserExpRepository");
const customError = require("../errors/customError");

class UserExpService {
  // Create a new user exp
  static async create(userId, exp, level) {
    try {
      // Create a new user exp
      const userExp = await UserExpRepository.create(userId, exp, level);
      if (!userExp) {
        throw new customError("User exp not found");
      }

      // Return user exp
      return userExp;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserExpService;
