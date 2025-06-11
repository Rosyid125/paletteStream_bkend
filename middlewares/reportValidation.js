const customError = require("../errors/customError");

const validateReportData = (req, res, next) => {
  try {
    const { reason, additional_info } = req.body;
    const { postId } = req.params;

    // Validate postId
    if (!postId || isNaN(parseInt(postId))) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
      });
    }

    // Validate reason
    const validReasons = ["inappropriate_content", "spam", "harassment", "copyright_violation", "fake_content", "violence", "adult_content", "hate_speech", "other"];

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Reason is required",
      });
    }

    if (!validReasons.includes(reason)) {
      return res.status(400).json({
        success: false,
        message: "Invalid reason. Must be one of: " + validReasons.join(", "),
      });
    }

    // Validate additional_info if provided
    if (additional_info && typeof additional_info !== "string") {
      return res.status(400).json({
        success: false,
        message: "Additional info must be a string",
      });
    }

    if (additional_info && additional_info.length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Additional info must be less than 1000 characters",
      });
    }

    // Sanitize additional_info
    if (additional_info) {
      req.body.additional_info = additional_info.trim();
    }

    next();
  } catch (error) {
    console.error("Error in report validation middleware:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during validation",
    });
  }
};

const validateReportStatusUpdate = (req, res, next) => {
  try {
    const { status } = req.body;
    const { reportId } = req.params;

    // Validate reportId
    if (!reportId || isNaN(parseInt(reportId))) {
      return res.status(400).json({
        success: false,
        message: "Invalid report ID",
      });
    }

    // Validate status
    const validStatuses = ["pending", "reviewed", "resolved", "dismissed"];

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be one of: " + validStatuses.join(", "),
      });
    }

    next();
  } catch (error) {
    console.error("Error in report status validation middleware:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during validation",
    });
  }
};

module.exports = {
  validateReportData,
  validateReportStatusUpdate,
};
