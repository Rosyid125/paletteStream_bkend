const UserRepository = require("../repositories/UserRepository");
const UserPostRepository = require("../repositories/UserPostRepository");
const customError = require("../errors/customError");

class AdminService {
  // User Management
  static async getUsers({ search, page = 1, limit = 20 }) {
    const offset = (page - 1) * limit;
    if (search) {
      return UserRepository.searchByUsernameOrNameOrEmail(search, offset, limit);
    }
    return UserRepository.findAll(offset, limit);
  }

  static async banUser(id) {
    return UserRepository.updateStatus(id, "banned");
  }

  static async editUser(id, data) {
    return UserRepository.update(id, data);
  }

  static async deleteUser(id) {
    return UserRepository.delete(id);
  }

  // Post Management
  static async getPosts({ search, page = 1, limit = 20 }) {
    const offset = (page - 1) * limit;
    if (search) {
      return UserPostRepository.searchByTitleOrDesc(search, offset, limit);
    }
    return UserPostRepository.findAll(offset, limit);
  }

  static async deletePost(id) {
    return UserPostRepository.delete(id);
  }

  // Dashboard
  static async getDashboardStats() {
    const totalUsers = await UserRepository.countAll();
    const totalPosts = await UserPostRepository.countAll();
    const bannedUsers = await UserRepository.countBanned();
    return { totalUsers, totalPosts, bannedUsers };
  }
}

module.exports = AdminService;
