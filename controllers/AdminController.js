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
      await AdminService.banUser(id);
      res.json({ success: true });
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
}

module.exports = AdminController;
