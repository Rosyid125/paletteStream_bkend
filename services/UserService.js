const UserRepository = require("../repositories/UserRepository");
const UserProfileRepository = require("../repositories/UserProfileRepository");

class UserService {
  static async getAllUsers() {
    return await UserRepository.findAll();
  }

  static async getUserById(id) {
    return await UserRepository.findById(id);
  }

  static async deleteUser(id) {
    return await UserRepository.delete(id);
  }

  static async banUser(id) {
    return await UserRepository.ban(id);
  }

  static async unBanUser(id) {
    return await UserRepository.unBan(id);
  }
}

module.exports = UserService;
