const UserRepository = require("../repositories/UserRepository");
const UserPostRepository = require("../repositories/UserPostRepository");
const PostReportRepository = require("../repositories/PostReportRepository");
const UserProfileService = require("./UserProfileService");
const UserExpService = require("./UserExpService");
const bcrypt = require("bcryptjs");
const customError = require("../errors/customError");

class AdminService {  // User Management
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
    try {
      // Validate user exists
      const userExists = await UserRepository.existsById(id);
      if (!userExists) {
        throw new Error("User not found");
      }

      // Prepare update data
      const updateData = { ...data };

      // Hash password if provided
      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
      }

      // Update user
      const updatedUser = await UserRepository.updateComplete(id, updateData);

      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser;

      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  }

  static async getUserById(id) {
    try {
      const user = await UserRepository.getDetailedById(id);
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  static async deleteUser(id) {
    return UserRepository.delete(id);
  }
  // Post Management
  static async getPosts({ search, page = 1, limit = 20 }) {
    const offset = (page - 1) * limit;
    let posts;

    if (search) {
      posts = await UserPostRepository.searchByTitleOrDesc(search, offset, limit);
    } else {
      posts = await UserPostRepository.findAll(offset, limit);
    }

    // Add report counts to posts
    if (posts && posts.length > 0) {
      const postIds = posts.map((post) => post.id);
      const reportCounts = await PostReportRepository.getReportCountsForPosts(postIds);

      // Create a map for quick lookup
      const reportCountMap = {};
      reportCounts.forEach((item) => {
        reportCountMap[item.post_id] = parseInt(item.report_count) || 0;
      });

      // Add report counts to posts
      posts = posts.map((post) => ({
        ...post,
        report_count: reportCountMap[post.id] || 0,
      }));
    }

    return posts;
  }

  static async deletePost(id) {
    return UserPostRepository.delete(id);
  }
  // Dashboard
  static async getDashboardStats() {
    const totalUsers = await UserRepository.countAll();
    const totalPosts = await UserPostRepository.countAll();
    const bannedUsers = await UserRepository.countBanned();
    const reportStats = await PostReportRepository.getReportStats();

    const totalReports = reportStats.statusStats.reduce((sum, stat) => sum + parseInt(stat.count), 0);
    const pendingReports = reportStats.statusStats.find((stat) => stat.status === "pending")?.count || 0;

    return {
      totalUsers,
      totalPosts,
      bannedUsers,
      totalReports,
      pendingReports,
    };
  }
  // Create new admin
  static async createAdmin({ email, password, first_name, last_name, role = "admin" }) {
    try {
      // Validasi input
      if (!email || !password || !first_name || !last_name) {
        throw new Error("All fields are required");
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user with admin role
      const user = await UserRepository.createAdmin({
        email,
        password: hashedPassword,
        first_name,
        last_name,
      });

      // Create default profile and experience for new admin
      await UserProfileService.createDefaultUserProfile(user.id);
      await UserExpService.create(user.id, 0, 1);

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
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
