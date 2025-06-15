const fs = require("fs");
const path = require("path");

class AntiSpamLogger {
  static logFile = path.join(__dirname, "../logs/anti-spam.log");

  static ensureLogDirectory() {
    const logDir = path.dirname(this.logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  static formatMessage(level, userId, action, details = {}) {
    const timestamp = new Date().toISOString();
    const message = {
      timestamp,
      level,
      userId,
      action,
      details,
    };
    return JSON.stringify(message) + "\n";
  }

  static writeLog(message) {
    this.ensureLogDirectory();
    fs.appendFileSync(this.logFile, message, "utf8");
  }

  static logSpamDetected(userId, spamType, details) {
    const message = this.formatMessage("WARN", userId, "SPAM_DETECTED", {
      spam_type: spamType,
      ...details,
    });

    this.writeLog(message);
    console.warn(`🚨 [ANTI-SPAM] User ${userId} - ${spamType} detected:`, details);
  }

  static logUserLocked(userId, spamType, unlockAt) {
    const message = this.formatMessage("ERROR", userId, "USER_LOCKED", {
      spam_type: spamType,
      unlock_at: unlockAt,
    });

    this.writeLog(message);
    console.error(`🔒 [ANTI-SPAM] User ${userId} locked for ${spamType} until ${unlockAt}`);
  }

  static logUserUnlocked(userId, spamType, unlockedBy = "system") {
    const message = this.formatMessage("INFO", userId, "USER_UNLOCKED", {
      spam_type: spamType,
      unlocked_by: unlockedBy,
    });

    this.writeLog(message);
    console.log(`🔓 [ANTI-SPAM] User ${userId} unlocked from ${spamType} by ${unlockedBy}`);
  }

  static logExpBlocked(userId, eventType, expAmount) {
    const message = this.formatMessage("WARN", userId, "EXP_BLOCKED", {
      event_type: eventType,
      exp_amount: expAmount,
    });

    this.writeLog(message);
    console.warn(`⛔ [ANTI-SPAM] EXP blocked for User ${userId} - ${eventType} (${expAmount} EXP)`);
  }

  static logCleanup(expiredLocks, cleanedTracking) {
    const message = this.formatMessage("INFO", null, "CLEANUP", {
      expired_locks: expiredLocks,
      cleaned_tracking: cleanedTracking,
    });

    this.writeLog(message);
    console.log(`🧹 [ANTI-SPAM] Cleanup completed - ${expiredLocks} locks, ${cleanedTracking} tracking records`);
  }

  static logError(error, context = {}) {
    const message = this.formatMessage("ERROR", null, "SYSTEM_ERROR", {
      error: error.message,
      stack: error.stack,
      context,
    });

    this.writeLog(message);
    console.error(`❌ [ANTI-SPAM] System error:`, error.message, context);
  }

  static getRecentLogs(lines = 100) {
    try {
      if (!fs.existsSync(this.logFile)) {
        return [];
      }

      const data = fs.readFileSync(this.logFile, "utf8");
      const allLines = data.trim().split("\n");
      const recentLines = allLines.slice(-lines);

      return recentLines.map((line) => {
        try {
          return JSON.parse(line);
        } catch (e) {
          return { raw: line };
        }
      });
    } catch (error) {
      console.error("Error reading anti-spam logs:", error);
      return [];
    }
  }

  static getSpamStats(hours = 24) {
    try {
      const logs = this.getRecentLogs(1000);
      const cutoffTime = new Date();
      cutoffTime.setHours(cutoffTime.getHours() - hours);

      const recentLogs = logs.filter((log) => log.timestamp && new Date(log.timestamp) > cutoffTime);

      const stats = {
        total_events: recentLogs.length,
        spam_detected: recentLogs.filter((log) => log.action === "SPAM_DETECTED").length,
        users_locked: recentLogs.filter((log) => log.action === "USER_LOCKED").length,
        exp_blocked: recentLogs.filter((log) => log.action === "EXP_BLOCKED").length,
        users_unlocked: recentLogs.filter((log) => log.action === "USER_UNLOCKED").length,
        system_errors: recentLogs.filter((log) => log.action === "SYSTEM_ERROR").length,
        by_hour: {},
      };

      // Group by hour
      recentLogs.forEach((log) => {
        if (log.timestamp) {
          const hour = new Date(log.timestamp).getHours();
          stats.by_hour[hour] = (stats.by_hour[hour] || 0) + 1;
        }
      });

      return stats;
    } catch (error) {
      console.error("Error calculating spam stats:", error);
      return { error: error.message };
    }
  }
}

module.exports = AntiSpamLogger;
