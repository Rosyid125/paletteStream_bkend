const AdminService = require("../services/AdminService");

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
}

module.exports = AdminController;
