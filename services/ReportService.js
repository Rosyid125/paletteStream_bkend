const ReportRepository = require("../repositories/ReportRepository");
const customError = require("../errors/customError");

class ReportService {
  // Get all reports
  static async getReports() {
    try {
      return await ReportRepository.findAll();
    } catch (error) {
      throw error;
    }
  }

  // Get report by id
  static async getReport(id) {
    try {
      return await ReportRepository.findById(id);
    } catch (error) {
      throw error;
    }
  }

  // Get report by reporter id
  static async getReportByReporterId(reporter_id) {
    try {
      return await ReportRepository.findByReporterId(reporter_id);
    } catch (error) {
      throw error;
    }
  }

  // Create a new report
  static async createReport(reporter_id, report_picture, note) {
    try {
      // Create a new report
      const report = await ReportRepository.create(reporter_id, report_picture, note);
      if (!report) {
        throw new customError("Report not found");
      }

      // Return report
      return report;
    } catch (error) {
      throw error;
    }
  }

  // Delete a report
  static async deleteReport(id) {
    try {
      // Delete a report
      const report = await ReportRepository.delete(id);
      if (!report) {
        throw new customError("Report not found");
      }

      // Return deleted report
      return report;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ReportService;
