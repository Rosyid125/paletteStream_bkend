// Import repository
const UserExpRepository = require("../repositories/UserExpRepository");
const customError = require("../errors/customError");

class UserExpService {
  // Get user exp by user id
  static async getUserExpByUserId(userId) {
    try {
      // Get user exp by user id
      const userExp = await UserExpRepository.findByUserId(userId);
      if (!userExp) {
        throw new customError("User exp not found");
      }

      // Return user exp
      return userExp;
    } catch (error) {
      throw error;
    }
  }

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

  // Update user exp by user id
  static async updateUserExpByUserId(userId, exp, level, currentTreshold, nextTreshold) {
    try {
      // Update user exp by user id
      const userExp = await UserExpRepository.update(userId, exp, level, currentTreshold, nextTreshold);
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
