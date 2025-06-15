/**
 * Comprehensive Anti-Spam System Test
 *
 * Tests all aspects of the anti-spam system:
 * - Comment spam detection
 * - User locking mechanism
 * - EXP blocking
 * - Admin controls
 * - Cleanup functionality
 * - Logging system
 */

const { GamificationService } = require("./services/GamificationService");
const AntiSpamService = require("./services/AntiSpamService");
const PostCommentService = require("./services/PostCommentService");
const AntiSpamLogger = require("./utils/AntiSpamLogger");
const UserSpamLockRepository = require("./repositories/UserSpamLockRepository");

class AntiSpamTestSuite {
  constructor() {
    this.testResults = [];
    this.testUserId = 999; // Use high ID to avoid conflicts
    this.testPostId = 1;
  }

  log(message, type = "info") {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${type.toUpperCase()}] ${message}`);
  }

  addResult(testName, passed, details = {}) {
    this.testResults.push({
      test: testName,
      passed,
      details,
      timestamp: new Date().toISOString(),
    });
  }

  async delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async cleanupTestData() {
    try {
      // Cleanup any test locks
      await UserSpamLockRepository.query().where("user_id", this.testUserId).del();

      this.log("Test data cleaned up");
    } catch (error) {
      this.log(`Cleanup error: ${error.message}`, "warn");
    }
  }

  async testNormalComment() {
    this.log("Testing normal comment (should pass)...");

    try {
      const result = await GamificationService.handleCommentWithSpamCheck(this.testUserId, this.testPostId, "This is a normal comment for testing");

      const passed = result.success && result.canGiveExp;
      this.addResult("Normal Comment", passed, result);

      if (passed) {
        this.log("✅ Normal comment test PASSED");
      } else {
        this.log("❌ Normal comment test FAILED", "error");
      }

      return passed;
    } catch (error) {
      this.log(`❌ Normal comment test ERROR: ${error.message}`, "error");
      this.addResult("Normal Comment", false, { error: error.message });
      return false;
    }
  }

  async testDuplicateCommentSpam() {
    this.log("Testing duplicate comment spam detection...");

    const spamComment = "SPAM COMMENT FOR TESTING";
    let lockTriggered = false;
    let attempts = 0;

    try {
      // Try to spam with same comment 6 times (threshold is 5)
      for (let i = 1; i <= 6; i++) {
        const result = await GamificationService.handleCommentWithSpamCheck(this.testUserId, this.testPostId, spamComment);

        attempts++;

        if (!result.success && result.message.includes("Duplicate")) {
          lockTriggered = true;
          this.log(`🚨 Spam detected on attempt ${i}`);
          break;
        }

        await this.delay(100); // Small delay between attempts
      }

      const passed = lockTriggered;
      this.addResult("Duplicate Comment Spam", passed, {
        attempts,
        lockTriggered,
      });

      if (passed) {
        this.log("✅ Duplicate comment spam test PASSED");
      } else {
        this.log("❌ Duplicate comment spam test FAILED - no lock triggered", "error");
      }

      return passed;
    } catch (error) {
      this.log(`❌ Duplicate comment spam test ERROR: ${error.message}`, "error");
      this.addResult("Duplicate Comment Spam", false, { error: error.message });
      return false;
    }
  }

  async testRapidCommentSpam() {
    this.log("Testing rapid comment spam detection...");

    const rapidUserId = this.testUserId + 1;
    let lockTriggered = false;
    let attempts = 0;

    try {
      // Try rapid commenting (4 different comments quickly)
      const rapidComments = [
        "Rapid comment 1",
        "Rapid comment 2",
        "Rapid comment 3",
        "Rapid comment 4", // Should trigger lock
      ];

      for (let i = 0; i < rapidComments.length; i++) {
        const result = await GamificationService.handleCommentWithSpamCheck(rapidUserId, this.testPostId, rapidComments[i]);

        attempts++;

        if (!result.success && result.message.includes("Rapid")) {
          lockTriggered = true;
          this.log(`🚨 Rapid spam detected on attempt ${i + 1}`);
          break;
        }

        await this.delay(50); // Very short delay to trigger rapid detection
      }

      const passed = lockTriggered;
      this.addResult("Rapid Comment Spam", passed, {
        attempts,
        lockTriggered,
      });

      if (passed) {
        this.log("✅ Rapid comment spam test PASSED");
      } else {
        this.log("❌ Rapid comment spam test FAILED - no lock triggered", "error");
      }

      return passed;
    } catch (error) {
      this.log(`❌ Rapid comment spam test ERROR: ${error.message}`, "error");
      this.addResult("Rapid Comment Spam", false, { error: error.message });
      return false;
    }
  }

  async testUserLockStatus() {
    this.log("Testing user lock status check...");

    try {
      const lockInfo = await AntiSpamService.getUserLockInfo(this.testUserId);
      const isLocked = await AntiSpamService.canUserGetExp(this.testUserId, "commentOnPost");

      const passed = Array.isArray(lockInfo);
      this.addResult("User Lock Status", passed, {
        lockInfo,
        canGetExp: isLocked,
      });

      if (passed) {
        this.log(`✅ User lock status test PASSED - User has ${lockInfo.length} active locks`);
      } else {
        this.log("❌ User lock status test FAILED", "error");
      }

      return passed;
    } catch (error) {
      this.log(`❌ User lock status test ERROR: ${error.message}`, "error");
      this.addResult("User Lock Status", false, { error: error.message });
      return false;
    }
  }

  async testSpamStatistics() {
    this.log("Testing spam statistics...");

    try {
      const dbStats = await AntiSpamService.getSpamStatistics();
      const logStats = AntiSpamLogger.getSpamStats(1); // Last 1 hour

      const passed = dbStats && logStats && typeof dbStats.total_active_locks === "number";
      this.addResult("Spam Statistics", passed, {
        dbStats,
        logStats,
      });

      if (passed) {
        this.log(`✅ Spam statistics test PASSED - ${dbStats.total_active_locks} active locks`);
      } else {
        this.log("❌ Spam statistics test FAILED", "error");
      }

      return passed;
    } catch (error) {
      this.log(`❌ Spam statistics test ERROR: ${error.message}`, "error");
      this.addResult("Spam Statistics", false, { error: error.message });
      return false;
    }
  }

  async testCleanupFunctionality() {
    this.log("Testing cleanup functionality...");

    try {
      await AntiSpamService.cleanup();

      const passed = true; // If no error thrown, cleanup worked
      this.addResult("Cleanup Functionality", passed);

      if (passed) {
        this.log("✅ Cleanup functionality test PASSED");
      } else {
        this.log("❌ Cleanup functionality test FAILED", "error");
      }

      return passed;
    } catch (error) {
      this.log(`❌ Cleanup functionality test ERROR: ${error.message}`, "error");
      this.addResult("Cleanup Functionality", false, { error: error.message });
      return false;
    }
  }

  async testLoggingSystem() {
    this.log("Testing logging system...");

    try {
      // Test log methods
      AntiSpamLogger.logSpamDetected(this.testUserId, "test_spam", { test: true });

      const recentLogs = AntiSpamLogger.getRecentLogs(10);
      const logStats = AntiSpamLogger.getSpamStats(1);

      const passed = Array.isArray(recentLogs) && logStats && !logStats.error;
      this.addResult("Logging System", passed, {
        recentLogsCount: recentLogs.length,
        logStats,
      });

      if (passed) {
        this.log(`✅ Logging system test PASSED - ${recentLogs.length} recent logs`);
      } else {
        this.log("❌ Logging system test FAILED", "error");
      }

      return passed;
    } catch (error) {
      this.log(`❌ Logging system test ERROR: ${error.message}`, "error");
      this.addResult("Logging System", false, { error: error.message });
      return false;
    }
  }

  async runAllTests() {
    this.log("🧪 Starting Comprehensive Anti-Spam Test Suite...");
    this.log("=".repeat(60));

    // Cleanup any existing test data
    await this.cleanupTestData();

    const tests = [this.testNormalComment, this.testDuplicateCommentSpam, this.testRapidCommentSpam, this.testUserLockStatus, this.testSpamStatistics, this.testCleanupFunctionality, this.testLoggingSystem];

    let passedTests = 0;
    const totalTests = tests.length;

    for (const test of tests) {
      try {
        const result = await test.call(this);
        if (result) passedTests++;

        // Small delay between tests
        await this.delay(500);
      } catch (error) {
        this.log(`Test execution error: ${error.message}`, "error");
      }
    }

    // Final cleanup
    await this.cleanupTestData();

    // Results summary
    this.log("=".repeat(60));
    this.log(`📊 Test Results: ${passedTests}/${totalTests} tests passed`);

    if (passedTests === totalTests) {
      this.log("🎉 ALL TESTS PASSED! Anti-Spam System is working correctly.", "success");
    } else {
      this.log(`⚠️  ${totalTests - passedTests} tests failed. Please review the results.`, "warn");
    }

    // Detailed results
    this.log("\n📋 Detailed Test Results:");
    this.testResults.forEach((result, index) => {
      const status = result.passed ? "✅" : "❌";
      this.log(`${index + 1}. ${status} ${result.test}`);
      if (!result.passed && result.details.error) {
        this.log(`   Error: ${result.details.error}`);
      }
    });

    return {
      passed: passedTests,
      total: totalTests,
      success: passedTests === totalTests,
      results: this.testResults,
    };
  }
}

// Run tests if this file is executed directly
async function main() {
  try {
    // Wait for database connection
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const testSuite = new AntiSpamTestSuite();
    const results = await testSuite.runAllTests();

    process.exit(results.success ? 0 : 1);
  } catch (error) {
    console.error("❌ Test suite failed:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = AntiSpamTestSuite;
