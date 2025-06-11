const PostReportService = require("../services/PostReportService");

class PostReportController {
  // Report a post (User endpoint)
  static async reportPost(req, res) {
    try {
      const { postId } = req.params;
      const { reason, additional_info } = req.body;
      const userId = req.user.id;

      // Validation is already done by middleware
      const report = await PostReportService.reportPost(parseInt(postId), userId, reason, additional_info);

      res.status(201).json({
        success: true,
        message: "Post reported successfully",
        data: report,
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get report reasons (for frontend dropdown)
  static async getReportReasons(req, res) {
    try {
      const reasons = PostReportService.getReportReasons();
      res.json({
        success: true,
        data: reasons,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get all reports (Admin only)
  static async getAllReports(req, res) {
    try {
      const reports = await PostReportService.getAllReports();
      res.json({
        success: true,
        data: reports,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get reported posts (Admin only)
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
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get reports for a specific post (Admin only)
  static async getPostReports(req, res) {
    try {
      const { postId } = req.params;
      const result = await PostReportService.getPostReports(parseInt(postId));

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Update report status (Admin only)
  static async updateReportStatus(req, res) {
    try {
      const { reportId } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: "Status is required",
        });
      }

      const result = await PostReportService.updateReportStatus(parseInt(reportId), status);

      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Delete a report (Admin only)
  static async deleteReport(req, res) {
    try {
      const { reportId } = req.params;
      await PostReportService.deleteReport(parseInt(reportId));

      res.json({
        success: true,
        message: "Report deleted successfully",
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get report statistics (Admin dashboard)
  static async getReportStatistics(req, res) {
    try {
      const stats = await PostReportService.getReportStatistics();
      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = PostReportController;
