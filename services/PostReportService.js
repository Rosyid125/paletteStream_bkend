const PostReportRepository = require("../repositories/PostReportRepository");
const UserPostRepository = require("../repositories/UserPostRepository");
const NotificationService = require("./NotificationService");
const customError = require("../errors/customError");

class PostReportService {
  // Create a new post report
  static async reportPost(postId, userId, reason, additionalInfo = null) {
    try {
      // Check if post exists
      const post = await UserPostRepository.findByPostId(postId);
      if (!post) {
        throw new customError("Post not found", 404);
      }

      // Check if user is trying to report their own post
      if (post.user_id === userId) {
        throw new customError("You cannot report your own post", 400);
      }

      // Check if user already reported this post
      const existingReport = await PostReportRepository.findExistingReport(postId, userId);
      if (existingReport) {
        throw new customError("You have already reported this post", 400);
      } // Create the report
      const report = await PostReportRepository.create(postId, userId, reason, additionalInfo);

      // Send notification to post owner (optional - can be disabled if too spammy)
      try {
        await NotificationService.create({
          user_id: post.user_id,
          type: "post_reported",
          data: {
            post_id: postId,
            post_title: post.title,
            reason: reason,
            reporter_id: userId,
          },
        });
      } catch (notificationError) {
        // Don't fail the report creation if notification fails
        console.error("Failed to create notification for post report:", notificationError);
      }

      return report;
    } catch (error) {
      throw error;
    }
  }

  // Get all post reports (admin only)
  static async getAllReports() {
    try {
      return await PostReportRepository.findAll();
    } catch (error) {
      throw error;
    }
  }

  // Get reports for a specific post
  static async getPostReports(postId) {
    try {
      const reports = await PostReportRepository.findByPostId(postId);
      const reportCount = await PostReportRepository.getReportCountByPostId(postId);

      return {
        reports,
        totalReports: reportCount,
      };
    } catch (error) {
      throw error;
    }
  }

  // Get posts with reports (for admin dashboard)
  static async getReportedPosts(page = 1, limit = 20) {
    try {
      const posts = await PostReportRepository.findPostsWithReports(page, limit);

      // Get report counts for these posts
      const postIds = posts.map((post) => post.id);
      const reportCounts = await PostReportRepository.getReportCountsForPosts(postIds);

      // Create a map for quick lookup
      const reportCountMap = {};
      reportCounts.forEach((item) => {
        reportCountMap[item.post_id] = parseInt(item.report_count);
      });

      // Add report counts to posts
      const postsWithCounts = posts.map((post) => ({
        ...post,
        report_count: reportCountMap[post.id] || 0,
      }));

      return postsWithCounts;
    } catch (error) {
      throw error;
    }
  }

  // Update report status (admin only)
  static async updateReportStatus(reportId, status) {
    try {
      const validStatuses = ["pending", "reviewed", "resolved", "dismissed"];
      if (!validStatuses.includes(status)) {
        throw new customError("Invalid status", 400);
      }

      const report = await PostReportRepository.findById(reportId);
      if (!report) {
        throw new customError("Report not found", 404);
      }

      await PostReportRepository.updateStatus(reportId, status);
      return { success: true, message: `Report status updated to ${status}` };
    } catch (error) {
      throw error;
    }
  }

  // Delete a report (admin only)
  static async deleteReport(reportId) {
    try {
      const report = await PostReportRepository.delete(reportId);
      if (!report) {
        throw new customError("Report not found", 404);
      }
      return report;
    } catch (error) {
      throw error;
    }
  }

  // Get report statistics (admin dashboard)
  static async getReportStatistics() {
    try {
      const stats = await PostReportRepository.getReportStats();

      // Format the stats for better frontend consumption
      const statusCounts = {};
      const reasonCounts = {};

      stats.statusStats.forEach((item) => {
        statusCounts[item.status] = parseInt(item.count);
      });

      stats.reasonStats.forEach((item) => {
        reasonCounts[item.reason] = parseInt(item.count);
      });

      return {
        statusBreakdown: statusCounts,
        reasonBreakdown: reasonCounts,
        totalReports: Object.values(statusCounts).reduce((a, b) => a + b, 0),
      };
    } catch (error) {
      throw error;
    }
  }

  // Get report reasons (for frontend dropdown)
  static getReportReasons() {
    return [
      { value: "inappropriate_content", label: "Inappropriate Content" },
      { value: "spam", label: "Spam" },
      { value: "harassment", label: "Harassment" },
      { value: "copyright_violation", label: "Copyright Violation" },
      { value: "fake_content", label: "Fake Content" },
      { value: "violence", label: "Violence" },
      { value: "adult_content", label: "Adult Content" },
      { value: "hate_speech", label: "Hate Speech" },
      { value: "other", label: "Other" },
    ];
  }
}

module.exports = PostReportService;
