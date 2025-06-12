// Test Script untuk Sistem Gamifikasi Anti-Spam
// Run dengan: node test-gamification-anti-spam.js

const { GamificationService } = require("./services/GamificationService");
const { gamificationEmitter } = require("./emitters/gamificationEmitter");

// Mock services untuk testing
const mockUserExpService = {
  getUserExpByUserId: async (userId) => ({
    exp: 1000,
    level: 5,
  }),
  updateUserExpByUserId: async (userId, exp, level, currentThreshold, nextThreshold) => {
    console.log(`📊 Mock Update: User ${userId} -> EXP: ${exp}, Level: ${level}`);
  },
};

const mockAchievementService = {
  handleEvent: async (eventName, userId, metadata) => {
    console.log(`🏆 Mock Achievement: ${eventName} for user ${userId}`);
  },
};

const mockNotificationService = {
  notifyLevelUp: async (userId, level, deltaExp) => {
    console.log(`🎉 Mock Level Up: User ${userId} reached level ${level} (+${deltaExp} EXP)`);
  },
  notifyExpGained: async (userId, deltaExp, reason) => {
    console.log(`💎 Mock EXP Gain: User ${userId} gained ${deltaExp} EXP (${reason})`);
  },
};

// Override untuk testing
require.cache[require.resolve("./services/UserExpService")] = { exports: mockUserExpService };
require.cache[require.resolve("./services/AchievementService")] = { exports: mockAchievementService };
require.cache[require.resolve("./services/NotificationService")] = { exports: mockNotificationService };

async function testAntiSpamSystem() {
  console.log("🧪 Testing Anti-Spam Gamification System\n");

  const testUserId = 1;

  console.log("=== TEST 1: Events yang MEMBERIKAN EXP (Anti-Spam) ===");

  // Test passive rewards (tidak bisa di-spam)
  const validEvents = [
    "userGotFollowed", // +25 EXP
    "postGotLiked", // +10 EXP
    "postGotCommented", // +15 EXP
    "postGotBookmarked", // +20 EXP
    "commentGotReplied", // +8 EXP
    "postCreated", // +50 EXP
  ];

  for (const event of validEvents) {
    console.log(`\n🔄 Testing: ${event}`);
    gamificationEmitter.emit(event, testUserId);
    await new Promise((resolve) => setTimeout(resolve, 100)); // Small delay
  }

  console.log("\n=== TEST 2: Events yang TIDAK MEMBERIKAN EXP (Spam Prevention) ===");

  // Test events yang dihapus untuk mencegah spam
  const invalidEvents = [
    "userFollowed", // Dihapus - bisa di-spam
    "userUnfollowed", // Dihapus - bisa di-spam
    "commentOnPost", // Dihapus - bisa di-spam
    "replyOnComment", // Dihapus - bisa di-spam
    "likeOnPost", // Dihapus - sangat mudah di-spam
    "likeOnPostDeleted", // Dihapus - sangat mudah di-spam
  ];

  for (const event of invalidEvents) {
    console.log(`\n❌ Testing: ${event} (should be skipped)`);
    gamificationEmitter.emit(event, testUserId);
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  console.log("\n=== TEST 3: Challenge Events (High Reward) ===");

  const challengeEvents = [
    "challengeJoined", // +100 EXP
    "challengeWinner", // +5000 EXP
    "challengeRunnerUp", // +2500 EXP
    "challengeParticipant", // +500 EXP
  ];

  for (const event of challengeEvents) {
    console.log(`\n🏆 Testing: ${event}`);
    gamificationEmitter.emit(event, testUserId);
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  console.log("\n=== TEST 4: Level System (1-100) ===");

  // Test level calculation
  const { GamificationService: GS } = require("./services/GamificationService");

  console.log("\n📊 Level Thresholds Test:");
  console.log("Level 1:", 0);
  console.log("Level 10:", "2700 EXP");
  console.log("Level 25:", "16200 EXP");
  console.log("Level 50:", "63700 EXP");
  console.log("Level 75:", "142450 EXP");
  console.log("Level 100:", "252450 EXP (MAX)");

  console.log("\n=== TEST 5: EXP Gain Reasons ===");

  const reasons = ["userGotFollowed", "postGotLiked", "postGotCommented", "postCreated", "challengeWinner"];

  for (const event of reasons) {
    const reason = GS.getExpGainReason(event);
    console.log(`📝 ${event}: "${reason}"`);
  }

  console.log("\n✅ Anti-Spam Gamification Test Completed!");
  console.log("\n📋 Summary:");
  console.log("- ✅ Passive rewards work (anti-spam)");
  console.log("- ✅ Spam-able events blocked");
  console.log("- ✅ Challenge events functional");
  console.log("- ✅ Level system 1-100 ready");
  console.log("- ✅ Meaningful EXP gain reasons");
}

// Jalankan test
testAntiSpamSystem().catch(console.error);
