/**
 * Cleanup script untuk membersihkan data test spam
 */

const db = require("./config/db");

async function cleanupTestData() {
  try {
    console.log("🧹 Cleaning up test spam data...");

    // Cleanup tracking data
    const deletedTracking = await db("comment_spam_tracking").where("comment_content", "Test spam comment").del();

    console.log(`Deleted ${deletedTracking} tracking records`);

    // Cleanup locks
    const deletedLocks = await db("user_spam_locks").where("user_id", 29).del();

    console.log(`Deleted ${deletedLocks} lock records`);

    console.log("✅ Cleanup completed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Cleanup failed:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  cleanupTestData();
}

module.exports = { cleanupTestData };
