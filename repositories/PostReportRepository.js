const PostReport = require("../models/PostReport");
const db = require("../config/db");

class PostReportRepository {
  // Get all post reports with relations
  static async findAll() {
    try {
      return await PostReport.query().withGraphFetched("[reporter(selectBasicInfo), post(selectBasicInfo)]").orderBy("created_at", "desc");
    } catch (error) {
      throw error;
    }
  }

  // Get post report by ID
  static async findById(id) {
    try {
      return await PostReport.query().findById(id).withGraphFetched("[reporter(selectBasicInfo), post(selectBasicInfo)]");
    } catch (error) {
      throw error;
    }
  }

  // Get all reports for a specific post
  static async findByPostId(postId) {
    try {
      return await PostReport.query().where("post_id", postId).withGraphFetched("[reporter(selectBasicInfo)]").orderBy("created_at", "desc");
    } catch (error) {
      throw error;
    }
  }

  // Get reports count by post ID
  static async getReportCountByPostId(postId) {
    try {
      const result = await PostReport.query().where("post_id", postId).count("id as count").first();
      return parseInt(result.count) || 0;
    } catch (error) {
      throw error;
    }
  }

  // Get reports count for multiple posts
  static async getReportCountsForPosts(postIds) {
    try {
      return await PostReport.query().whereIn("post_id", postIds).groupBy("post_id").select("post_id").count("id as report_count");
    } catch (error) {
      throw error;
    }
  }
  // Get all posts that have reports
  static async findPostsWithReports(page = 1, limit = 20) {
    try {
      const offset = (page - 1) * limit;

      return await db("user_posts")
        .select(["user_posts.*", "users.email", "user_profiles.username", db.raw("COUNT(post_reports.id) as report_count")])
        .join("users", "user_posts.user_id", "users.id")
        .join("user_profiles", "users.id", "user_profiles.user_id")
        .join("post_reports", "user_posts.id", "post_reports.post_id")
        .groupBy("user_posts.id", "users.email", "user_profiles.username")
        .having("report_count", ">", 0)
        .orderBy("report_count", "desc")
        .orderBy("user_posts.created_at", "desc")
        .limit(limit)
        .offset(offset);
    } catch (error) {
      throw error;
    }
  }

  // Create a new post report
  static async create(postId, userId, reason, additionalInfo = null) {
    try {
      return await PostReport.query().insert({
        post_id: postId,
        user_id: userId,
        reason: reason,
        additional_info: additionalInfo,
        status: "pending",
      });
    } catch (error) {
      throw error;
    }
  }

  // Check if user already reported this post
  static async findExistingReport(postId, userId) {
    try {
      return await PostReport.query().where("post_id", postId).where("user_id", userId).first();
    } catch (error) {
      throw error;
    }
  }

  // Update report status
  static async updateStatus(id, status) {
    try {
      return await PostReport.query().findById(id).patch({ status });
    } catch (error) {
      throw error;
    }
  }

  // Delete a report
  static async delete(id) {
    try {
      const report = await PostReport.query().findById(id);
      if (!report) {
        return null;
      }
      await PostReport.query().deleteById(id);
      return report;
    } catch (error) {
      throw error;
    }
  }

  // Get report statistics
  static async getReportStats() {
    try {
      const stats = await PostReport.query().select("status").count("id as count").groupBy("status");

      const reasonStats = await PostReport.query().select("reason").count("id as count").groupBy("reason").orderBy("count", "desc");

      return {
        statusStats: stats,
        reasonStats: reasonStats,
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = PostReportRepository;
