const UserRepository = require("../repositories/UserRepository");
const UserPostRepository = require("../repositories/UserPostRepository");
const UserProfileService = require("./UserProfileService");
const UserExpService = require("./UserExpService");
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

  // Create new admin
  static async createAdmin({ email, password, first_name, last_name }) {
    // Validasi sederhana
    if (!email || !password || !first_name || !last_name) throw new Error("All fields are required");
    await UserProfileService.createDefaultUserProfile(user.id);
    await UserExpService.create(user.id, 0, 1);
    return UserRepository.createAdmin({ email, password, first_name, last_name });
  }

  // Dashboard trend
  static async getDashboardTrends() {
    // Trend user & post per hari/minggu/bulan
    const userTrendDay = await UserRepository.countNewUsersByDay(7);
    const userTrendMonth = await UserRepository.countNewUsersByMonth(6);
    const postTrendDay = await UserPostRepository.countNewPostsByDay(7);
    const postTrendMonth = await UserPostRepository.countNewPostsByMonth(6);
    return { userTrendDay, userTrendMonth, postTrendDay, postTrendMonth };
  }

  // Toggle ban/unban user
  static async toggleBanUser(id) {
    const user = await UserRepository.findById(id);
    if (!user) throw new Error("User not found");
    if (user.status === "banned") {
      // Unban
      await UserRepository.updateStatus(id, "active");
      return { id, status: "active" };
    } else {
      // Ban
      await UserRepository.updateStatus(id, "banned");
      return { id, status: "banned" };
    }
  }
}

module.exports = AdminService;
