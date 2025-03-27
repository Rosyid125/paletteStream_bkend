// Import model
const Report = require("../models/Report");
const currentRepo = "ReportRepository";

class ReportRepository {
  // Get all reports
  static async findAll() {
    try {
      const reports = await db("reports").select("*");
      return reports;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Get report by id
  static async findById(id) {
    try {
      const report = await db("reports").where({ id }).first();
      return report;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Get report by reporter id
  static async findByReporterId(reporter_id) {
    try {
      const reports = await db("reports").where({ reporter_id });
      return reports;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Create a new report
  static async create(reporter_id, report_picture, note) {
    try {
      const [report] = await db("reports").insert({ reporter_id, report_picture, note }).returning("*");
      return report;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Delete a report
  static async delete(id) {
    try {
      const report = await db("reports").where({ id }).first();
      if (!report) {
        return null;
      }
      await db("reports").where({ id }).del();
      return report;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }
}

module.exports = ReportRepository;
