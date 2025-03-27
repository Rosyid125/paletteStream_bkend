const UserRepository = require("../repositories/UserRepository");
const UserProfileRepository = require("../repositories/UserProfileRepository");

// For error handling
const currentService = "UserService";

class UserService {
  static async getAllUsers() {
    try {
      return await UserRepository.findAll();
    } catch (error) {
      throw new Error(`${currentService} Error: ${error.message}`);
    }
  }

  static async getUserById(id) {
    try {
      return await UserRepository.findById(id);
    } catch (error) {
      throw new Error(`${currentService} Error: ${error.message}`);
    }
  }

  static async deleteUser(id) {
    try {
      return await UserRepository.delete(id);
    } catch (error) {
      throw new Error(`${currentService} Error: ${error.message}`);
    }
  }

  static async banUser(id) {
    try {
      return await UserRepository.ban(id);
    } catch (error) {
      throw new Error(`${currentService} Error: ${error.message}`);
    }
  }

  static async unBanUser(id) {
    try {
      return await UserRepository.unBan(id);
    } catch (error) {
      throw new Error(`${currentService} Error: ${error.message}`);
    }
  }
}

module.exports = UserService;
