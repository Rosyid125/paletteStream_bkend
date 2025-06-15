const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const { GamificationService } = require("./services/GamificationService");
const AntiSpamService = require("./services/AntiSpamService");

const app = express();
app.use(cors());
app.use(express.json());

/**
 * Test script untuk menguji sistem anti-spam comment EXP
 */

async function testAntiSpamSystem() {
  console.log("🧪 Starting Anti-Spam System Test...\n");

  const testUserId = 1;
  const testPostId = 1;
  const spamComment = "This is a spam comment";

  try {
    console.log("=== Test 1: Normal Comment (Should Pass) ===");
    const normalResult = await GamificationService.handleCommentWithSpamCheck(testUserId, testPostId, "This is a normal comment");
    console.log("Normal Comment Result:", normalResult);
    console.log("");

    console.log("=== Test 2: Spam Detection (Multiple Same Comments) ===");
    // Spam dengan comment yang sama 5 kali
    for (let i = 1; i <= 6; i++) {
      console.log(`Attempt ${i}:`);
      const result = await GamificationService.handleCommentWithSpamCheck(testUserId, testPostId, spamComment);
      console.log(`  Result: ${result.success ? "SUCCESS" : "BLOCKED"} - ${result.message}`);

      // Delay 100ms untuk simulasi
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    console.log("");

    console.log("=== Test 3: Check User Lock Status ===");
    const lockStatus = await AntiSpamService.getUserLockInfo(testUserId);
    console.log("User Lock Status:", lockStatus);
    console.log("");

    console.log("=== Test 4: Rapid Commenting Test ===");
    // Test rapid commenting (3 comment berbeda dalam waktu cepat)
    const rapidComments = [
      "Comment 1",
      "Comment 2",
      "Comment 3",
      "Comment 4", // Should trigger rapid commenting detection
    ];

    for (let i = 0; i < rapidComments.length; i++) {
      console.log(`Rapid Comment ${i + 1}:`);
      const result = await GamificationService.handleCommentWithSpamCheck(
        testUserId + 1, // Different user to avoid existing lock
        testPostId,
        rapidComments[i]
      );
      console.log(`  Result: ${result.success ? "SUCCESS" : "BLOCKED"} - ${result.message}`);

      // Very short delay to trigger rapid detection
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    console.log("");

    console.log("=== Test 5: Spam Statistics ===");
    const stats = await AntiSpamService.getSpamStatistics();
    console.log("Spam Statistics:", stats);
    console.log("");

    console.log("=== Test 6: Cleanup Test ===");
    await AntiSpamService.cleanup();
    console.log("Cleanup completed");
    console.log("");
  } catch (error) {
    console.error("❌ Test Error:", error);
  }
}

async function runTests() {
  try {
    // Wait for DB connection
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await testAntiSpamSystem();

    console.log("✅ All tests completed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Test Suite Failed:", error);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = { testAntiSpamSystem };
