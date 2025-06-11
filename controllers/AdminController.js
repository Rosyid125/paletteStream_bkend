const AdminService = require("../services/AdminService");
const PostReportService = require("../services/PostReportService");

class AdminController {
  static async getUsers(req, res) {
    try {
      const { search, page = 1, limit = 20 } = req.query;
      const users = await AdminService.getUsers({ search, page, limit });
      res.json({ success: true, data: users });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async banUser(req, res) {
    try {
      const { id } = req.params;
      const result = await AdminService.toggleBanUser(id);
      res.json({ success: true, status: result.status });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async editUser(req, res) {
    try {
      const { id } = req.params;
      await AdminService.editUser(id, req.body);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async deleteUser(req, res) {
    try {
      const { id } = req.params;
      await AdminService.deleteUser(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getPosts(req, res) {
    try {
      const { search, page = 1, limit = 20 } = req.query;
      const posts = await AdminService.getPosts({ search, page, limit });
      res.json({ success: true, data: posts });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async deletePost(req, res) {
    try {
      const { id } = req.params;
      await AdminService.deletePost(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getDashboard(req, res) {
    try {
      const stats = await AdminService.getDashboardStats();
      res.json({ success: true, data: stats });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async createAdmin(req, res) {
    try {
      const { email, password, first_name, last_name } = req.body;
      const admin = await AdminService.createAdmin({ email, password, first_name, last_name });
      res.status(201).json({ success: true, data: admin });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
  static async getDashboardTrends(req, res) {
    try {
      const trends = await AdminService.getDashboardTrends();
      res.json({ success: true, data: trends });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Post Report Management Methods
  static async getReportedPosts(req, res) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const posts = await PostReportService.getReportedPosts(parseInt(page), parseInt(limit));
      res.json({
        success: true,
        data: posts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getPostReports(req, res) {
    try {
      const { postId } = req.params;
      const result = await PostReportService.getPostReports(parseInt(postId));
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getAllReports(req, res) {
    try {
      const reports = await PostReportService.getAllReports();
      res.json({ success: true, data: reports });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
  static async updateReportStatus(req, res) {
    try {
      const { reportId } = req.params;
      const { status } = req.body;

      // Validation is already done by middleware
      const result = await PostReportService.updateReportStatus(parseInt(reportId), status);
      res.json({ success: true, message: result.message });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ success: false, message: error.message });
    }
  }

  static async deleteReport(req, res) {
    try {
      const { reportId } = req.params;
      await PostReportService.deleteReport(parseInt(reportId));
      res.json({ success: true, message: "Report deleted successfully" });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ success: false, message: error.message });
    }
  }

  static async getReportStatistics(req, res) {
    try {
      const stats = await PostReportService.getReportStatistics();
      res.json({ success: true, data: stats });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = AdminController;
