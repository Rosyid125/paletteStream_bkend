const { gamificationEmitter } = require("./emitters/gamificationEmitter");

// Test untuk memeriksa apakah event challengeWinner dan challengeParticipant berfungsi
console.log("🧪 Testing Challenge Events...");

// Mock user ID untuk testing
const testUserId = 1;

// Test challengeParticipant event
console.log("\n📝 Testing challengeParticipant event...");
gamificationEmitter.emit("challengeParticipant", testUserId);

// Delay untuk melihat hasil
setTimeout(() => {
  // Test challengeWinner event
  console.log("\n🏆 Testing challengeWinner event...");
  gamificationEmitter.emit("challengeWinner", testUserId);

  setTimeout(() => {
    console.log("\n✅ Challenge events test completed!");
    process.exit(0);
  }, 2000);
}, 2000);
