const customError = require("../errors/customError");

// Simple in-memory rate limiter for reports
const reportAttempts = new Map();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_REPORTS_PER_HOUR = 5; // Max 5 reports per hour per user

const reportRateLimit = (req, res, next) => {
  try {
    const userId = req.user.id;
    const now = Date.now();
    const userKey = `report_${userId}`;

    // Get user's report attempts
    let userAttempts = reportAttempts.get(userKey) || [];

    // Remove attempts older than the rate limit window
    userAttempts = userAttempts.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW);

    // Check if user has exceeded the rate limit
    if (userAttempts.length >= MAX_REPORTS_PER_HOUR) {
      const oldestAttempt = Math.min(...userAttempts);
      const resetTime = new Date(oldestAttempt + RATE_LIMIT_WINDOW);

      return res.status(429).json({
        success: false,
        message: `Rate limit exceeded. You can submit ${MAX_REPORTS_PER_HOUR} reports per hour. Try again after ${resetTime.toLocaleTimeString()}.`,
        resetTime: resetTime.toISOString(),
      });
    }

    // Add current attempt
    userAttempts.push(now);
    reportAttempts.set(userKey, userAttempts);

    // Clean up old entries periodically (simple cleanup)
    if (Math.random() < 0.01) {
      // 1% chance to clean up
      cleanupOldEntries();
    }

    next();
  } catch (error) {
    console.error("Error in report rate limit middleware:", error);
    next(); // Continue without rate limiting if there's an error
  }
};

// Cleanup function to remove old entries
const cleanupOldEntries = () => {
  const now = Date.now();
  for (const [key, attempts] of reportAttempts.entries()) {
    const validAttempts = attempts.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW);
    if (validAttempts.length === 0) {
      reportAttempts.delete(key);
    } else {
      reportAttempts.set(key, validAttempts);
    }
  }
};

module.exports = { reportRateLimit };
