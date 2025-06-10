// Test file untuk Challenge Winners System
// Jalankan: node test-challenge-winners.js

const ChallengeWinnerService = require("./services/ChallengeWinnerService");
const ChallengeService = require("./services/ChallengeService");

async function testChallengeWinners() {
  try {
    console.log("🧪 Testing Challenge Winners System...\n");

    // Test 1: Get all challenges
    console.log("1. Testing getAllChallenges...");
    const challenges = await ChallengeService.getAllChallenges();
    console.log(`✅ Found ${challenges.length} challenges`);

    if (challenges.length > 0) {
      const challenge = challenges[0];
      console.log(`📋 Testing with challenge: "${challenge.title}" (ID: ${challenge.id})`);

      // Test 2: Get challenge winners
      console.log("\n2. Testing getChallengeWinners...");
      const winners = await ChallengeWinnerService.getChallengeWinners(challenge.id);
      console.log(`✅ Found ${winners.length} winners for this challenge`);

      if (winners.length > 0) {
        console.log("👑 Winners:");
        winners.forEach((winner) => {
          console.log(`   - Rank ${winner.rank}: User ${winner.user_id} (Score: ${winner.final_score})`);
        });
      }

      // Test 3: Check if challenge has winners
      console.log("\n3. Testing challengeHasWinners...");
      const hasWinners = await ChallengeWinnerService.challengeHasWinners(challenge.id);
      console.log(`✅ Challenge has winners: ${hasWinners}`);
    }

    // Test 4: Test with user ID (if available)
    console.log("\n4. Testing getUserWins...");
    try {
      const userWins = await ChallengeWinnerService.getUserWins(1); // Test with user ID 1
      console.log(`✅ User 1 has ${userWins.length} wins`);
    } catch (error) {
      console.log(`ℹ️  User 1 test skipped: ${error.message}`);
    }

    console.log("\n🎉 All tests completed successfully!");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    console.error(error.stack);
  }
}

// Run the test
if (require.main === module) {
  testChallengeWinners();
}

module.exports = testChallengeWinners;
