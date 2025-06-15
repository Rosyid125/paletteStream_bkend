#!/usr/bin/env node

/**
 * Anti-Spam System Setup and Test Script
 *
 * Usage:
 * node setup-anti-spam.js --test          # Run tests only
 * node setup-anti-spam.js --cleanup       # Run cleanup only
 * node setup-anti-spam.js --stats         # Show statistics only
 * node setup-anti-spam.js                 # Full setup and test
 */

const { GamificationService } = require("./services/GamificationService");
const AntiSpamService = require("./services/AntiSpamService");
const AntiSpamScheduler = require("./schedulers/AntiSpamScheduler");

async function showStatistics() {
  console.log("📊 Current Anti-Spam Statistics:");
  console.log("=".repeat(50));

  try {
    const stats = await AntiSpamService.getSpamStatistics();
    console.log("Active Locks:", stats.total_active_locks);
    console.log("Comment Spam Locks:", stats.comment_spam_locks);
    console.log("Locks by Type:", stats.locks_by_type);
  } catch (error) {
    console.error("Error getting statistics:", error.message);
  }

  console.log("=".repeat(50));
}

async function runCleanup() {
  console.log("🧹 Running Anti-Spam Cleanup...");

  try {
    await AntiSpamService.cleanup();
    console.log("✅ Cleanup completed successfully");
  } catch (error) {
    console.error("❌ Cleanup failed:", error.message);
  }
}

async function runTests() {
  console.log("🧪 Running Anti-Spam Tests...");
  console.log("=".repeat(50));

  try {
    const { testAntiSpamSystem } = require("./test-anti-spam-system");
    await testAntiSpamSystem();
  } catch (error) {
    console.error("❌ Tests failed:", error.message);
  }
}

async function fullSetup() {
  console.log("🚀 Anti-Spam System Setup");
  console.log("=".repeat(50));

  // Show current status
  await showStatistics();

  // Run cleanup
  await runCleanup();

  // Show updated statistics
  await showStatistics();

  console.log("✅ Anti-Spam System is ready!");
  console.log("");
  console.log("💡 Next steps:");
  console.log("   - Start your server: npm run dev");
  console.log("   - Test comment spam detection");
  console.log("   - Check admin panel: /api/admin/spam/statistics");
  console.log("   - Monitor spam logs in console");
}

async function main() {
  const args = process.argv.slice(2);

  try {
    // Wait for DB connection
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (args.includes("--test")) {
      await runTests();
    } else if (args.includes("--cleanup")) {
      await runCleanup();
    } else if (args.includes("--stats")) {
      await showStatistics();
    } else {
      await fullSetup();
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Setup failed:", error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n👋 Anti-Spam setup interrupted");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n👋 Anti-Spam setup terminated");
  process.exit(0);
});

if (require.main === module) {
  main();
}

module.exports = {
  showStatistics,
  runCleanup,
  runTests,
  fullSetup,
};
