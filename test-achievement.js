// Test script for Achievement System
const { gamificationEmitter } = require("./emitters/gamificationEmitter");
const AchievementService = require("./services/AchievementService");
const AchievementUtils = require("./utils/achievementUtils");
const UserAchievementRepository = require("./repositories/UserAchievementRepository");
const AchievementRepository = require("./repositories/AchievementRepository");

async function testAchievementSystem() {
  console.log("🧪 Testing Achievement System...\n");

  try {
    // Test 1: Check if achievements exist
    console.log("1️⃣ Testing achievement retrieval...");
    const achievements = await AchievementService.getAllAchievements();
    console.log(`✅ Found ${achievements.length} achievements in database`);

    if (achievements.length > 0) {
      console.log(`   First achievement: ${achievements[0].title}`);
    } // Test 2: Test handleEvent function with dummy data
    console.log("\n2️⃣ Testing achievement event handling...");
    const testUserId = 29; // Using real user ID from database

    // Test post_liked event
    await AchievementService.handleEvent("post_liked", testUserId, { postId: 32 });
    console.log("✅ post_liked event handled"); // Test post_uploaded event
    await AchievementService.handleEvent("post_uploaded", testUserId, {});
    console.log("✅ post_uploaded event handled");

    // Test user_followed event
    await AchievementService.handleEvent("user_followed", testUserId, {});
    console.log("✅ user_followed event handled");

    // Test 3: Check user achievements after events
    console.log("\n3️⃣ Testing user achievement retrieval...");
    const userAchievements = await UserAchievementRepository.findByUserId(testUserId);
    console.log(`✅ Found ${userAchievements.length} user achievements`);

    // Test 4: Test progress summary
    console.log("\n4️⃣ Testing progress summary...");
    const summary = await AchievementUtils.getProgressSummary(testUserId);
    console.log(`✅ Progress summary: ${summary.completed}/${summary.total} (${summary.percentage}%) completed`); // Test 5: Test gamification emitter
    console.log("\n5️⃣ Testing gamification emitter...");
    // Test enhanced achievement event
    AchievementUtils.emitAchievementEvent("post_liked", testUserId, {
      postId: 1,
      likedAt: new Date().toISOString(),
    });
    console.log("✅ Achievement event emitted successfully");

    // Test regular gamification event
    gamificationEmitter.emit("postGotLiked", testUserId);
    console.log("✅ Regular gamification event emitted successfully");

    // Test 6: Test event validation
    console.log("\n6️⃣ Testing event validation...");
    const validEvent = AchievementUtils.validateEventData("post_liked", testUserId, { postId: 1 });
    const invalidEvent = AchievementUtils.validateEventData("", "invalid", null);

    if (validEvent && !invalidEvent) {
      console.log("✅ Event validation working correctly");
    } else {
      console.log("❌ Event validation failed");
    }

    console.log("\n🎉 All tests completed successfully!");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    console.error("Stack trace:", error.stack);
  }
}

// Initialize database connection first
const db = require("./config/db");

// Run tests
testAchievementSystem()
  .then(() => {
    console.log("\n✨ Test script finished");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Test script failed:", error);
    process.exit(1);
  });
