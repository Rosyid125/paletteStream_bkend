const ReportRepository = require("../repositories/ReportRepository");

class ReportService {
  // Get all reports
  static async getReports() {
    return ReportRepository.findAll();
  }

  // Get report by id
  static async getReport(id) {
    return ReportRepository.findById(id);
  }

  // Get report by reporter id
  static async getReportByReporterId(reporter_id) {
    return ReportRepository.findByReporterId(reporter_id);
  }

  // Create a new report
  static async createReport(reporter_id, report_picture, note) {
    // Create a new report
    const report = await ReportRepository.create(reporter_id, report_picture, note);
    if (!report) {
      throw new Error("Report not found");
    }

    // Return report
    return report;
  }

  // Delete a report
  static async deleteReport(id) {
    // Delete a report
    const report = await ReportRepository.delete(id);
    if (!report) {
      throw new Error("Report not found");
    }

    // Return deleted report
    return report;
  }
}

module.exports = ReportService;
