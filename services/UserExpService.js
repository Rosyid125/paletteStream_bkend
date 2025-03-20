// Import repository
const UserExpRepository = require("../repositories/UserExpRepository");

class UserExpService {
  // Create a new user exp
  static async create(userId, exp, level) {
    try {
      // Create a new user exp
      const userExp = await UserExpRepository.create(userId, exp, level);
      if (!userExp) {
        throw new Error("User exp not found");
      }

      // Return user exp
      return userExp;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = UserExpService;
