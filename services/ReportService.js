const ReportRepository = require("../repositories/ReportRepository");

// For error handling
const currentService = "ReportService";

class ReportService {
  // Get all reports
  static async getReports() {
    try {
      return await ReportRepository.findAll();
    } catch (error) {
      throw new Error(`${currentService} Error: ${error.message}`);
    }
  }

  // Get report by id
  static async getReport(id) {
    try {
      return await ReportRepository.findById(id);
    } catch (error) {
      throw new Error(`${currentService} Error: ${error.message}`);
    }
  }

  // Get report by reporter id
  static async getReportByReporterId(reporter_id) {
    try {
      return await ReportRepository.findByReporterId(reporter_id);
    } catch (error) {
      throw new Error(`${currentService} Error: ${error.message}`);
    }
  }

  // Create a new report
  static async createReport(reporter_id, report_picture, note) {
    try {
      // Create a new report
      const report = await ReportRepository.create(reporter_id, report_picture, note);
      if (!report) {
        throw new Error(`${currentService} Error: Report not found`);
      }

      // Return report
      return report;
    } catch (error) {
      throw new Error(`${currentService} Error: ${error.message}`);
    }
  }

  // Delete a report
  static async deleteReport(id) {
    try {
      // Delete a report
      const report = await ReportRepository.delete(id);
      if (!report) {
        throw new Error(`${currentService} Error: Report not found`);
      }

      // Return deleted report
      return report;
    } catch (error) {
      throw new Error(`${currentService} Error: ${error.message}`);
    }
  }
}

module.exports = ReportService;
