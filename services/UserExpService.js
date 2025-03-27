// Import repository
const UserExpRepository = require("../repositories/UserExpRepository");

// For error handling
const currentService = "UserExpService";

class UserExpService {
  // Create a new user exp
  static async create(userId, exp, level) {
    try {
      // Create a new user exp
      const userExp = await UserExpRepository.create(userId, exp, level);
      if (!userExp) {
        throw new Error(`${currentService} Error: User exp not found`);
      }

      // Return user exp
      return userExp;
    } catch (error) {
      throw new Error(`${currentService} Error: ${error.message}`);
    }
  }
}

module.exports = UserExpService;
