/**
 * Debug script untuk menguji sistem anti-spam
 * Menjalankan test manual untuk melihat dimana masalahnya
 */

const { GamificationService } = require("./services/GamificationService");
const AntiSpamService = require("./services/AntiSpamService");
const PostCommentService = require("./services/PostCommentService");

async function debugAntiSpam() {
  console.log("🔍 Starting Anti-Spam Debug...\n");

  // Use actual existing data from database
  const testUserId = 29; // Existing user ID
  const testPostId = 32; // Existing post ID
  const testComment = "Test spam comment";

  try {
    console.log("=== Step 1: Test Direct Anti-Spam Service ===");
    console.log(`Testing with userId: ${testUserId}, postId: ${testPostId}`);
    console.log(`Comment: "${testComment}"`);

    const spamResult = await AntiSpamService.checkCommentSpam(testUserId, testPostId, testComment);
    console.log("Direct spam check result:", JSON.stringify(spamResult, null, 2));
    console.log("");

    console.log("=== Step 2: Test GamificationService Integration ===");
    const gamificationResult = await GamificationService.handleCommentWithSpamCheck(testUserId, testPostId, testComment);
    console.log("Gamification spam check result:", JSON.stringify(gamificationResult, null, 2));
    console.log("");

    console.log("=== Step 3: Test Multiple Comments (Simulate Spam) ===");
    for (let i = 1; i <= 6; i++) {
      console.log(`\n--- Attempt ${i} ---`);
      const result = await AntiSpamService.checkCommentSpam(testUserId, testPostId, testComment);
      console.log(`Spam Check ${i}:`, {
        isSpam: result.isSpam,
        canGiveExp: result.canGiveExp,
        reason: result.reason,
      });

      // Small delay
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    console.log("\n=== Step 4: Check Database Tables ===");
    // Check if tracking table has data
    const db = require("./config/db");

    const trackingData = await db("comment_spam_tracking").where("user_id", testUserId).orderBy("created_at", "desc").limit(10);

    console.log(`Found ${trackingData.length} tracking records:`, trackingData);

    const lockData = await db("user_spam_locks").where("user_id", testUserId).where("is_active", true).orderBy("created_at", "desc");

    console.log(`Found ${lockData.length} active locks:`, lockData);

    console.log("\n=== Step 5: Test User Lock Status ===");
    const lockStatus = await AntiSpamService.getUserLockInfo(testUserId);
    console.log("User lock info:", lockStatus);

    const canGetExp = await AntiSpamService.canUserGetExp(testUserId, "commentOnPost");
    console.log("Can user get EXP:", canGetExp);
  } catch (error) {
    console.error("❌ Debug Error:", error);
    console.error("Stack:", error.stack);
  }
}

async function main() {
  try {
    // Wait for DB connection
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await debugAntiSpam();

    console.log("\n✅ Debug completed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Debug Suite Failed:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { debugAntiSpam };
