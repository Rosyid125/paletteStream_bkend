// Import model
const Report = require("../models/Report");
const db = require("../config/db");

class ReportRepository {
  // Get all reports
  static async findAll() {
    const reports = await db("reports").select("*");
    return reports;
  }

  // Get report by id
  static async findById(id) {
    const report = await db("reports").where({ id }).first();
    return report;
  }

  // Get report by reporter id
  static async findByReporterId(reporter_id) {
    const reports = await db("reports").where({ reporter_id });
    return reports;
  }

  // Create a new report
  static async create(reporter_id, report_picture, note) {
    const [report] = await db("reports").insert({ reporter_id, report_picture, note }).returning("*");
    return report;
  }

  // Delete a report
  static async delete(id) {
    const report = await db("reports").where({ id }).first();
    if (!report) {
      return null;
    }
    await db("reports").where({ id }).del();
    return report;
  }
}

module.exports = ReportRepository;
