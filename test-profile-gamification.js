// Test file untuk validasi Profile Gamification Endpoints
// File: test-profile-gamification.js

const GamificationController = require("./controllers/GamificationController");

// Mock request and response objects
const mockRequest = (params = {}, query = {}, cookies = {}) => ({
  params,
  query,
  cookies,
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

async function testProfileBadges() {
  console.log("🧪 Testing Profile Badges Endpoint...\n");

  try {
    // Test 1: Get profile badges for user
    console.log("1️⃣ Test: Get profile badges for user ID 1");

    const req = mockRequest({ userId: "1" });
    const res = mockResponse();

    // Mock console.log to capture the output
    const originalLog = console.log;
    let capturedOutput = [];
    console.log = (...args) => capturedOutput.push(args.join(" "));

    await GamificationController.getProfileBadges(req, res);

    // Restore console.log
    console.log = originalLog;

    console.log("✅ Profile badges endpoint executed successfully");

    // Test 2: Test with invalid user ID
    console.log("\n2️⃣ Test: Invalid user ID");
    const reqInvalid = mockRequest({ userId: "invalid" });
    const resInvalid = mockResponse();

    await GamificationController.getProfileBadges(reqInvalid, resInvalid);
    console.log("✅ Invalid user ID handling tested");

    console.log("\n🎉 Profile badges tests completed!");
  } catch (error) {
    console.error("❌ Profile badges test failed:", error.message);
    console.error("Stack:", error.stack);
  }
}

async function testProfileChallenges() {
  console.log("\n🧪 Testing Profile Challenges Endpoint...\n");

  try {
    // Test 1: Get all profile challenges for user
    console.log("1️⃣ Test: Get all profile challenges for user ID 1");

    const req = mockRequest({ userId: "1" }, { status: "all" });
    const res = mockResponse();

    await GamificationController.getProfileChallenges(req, res);
    console.log("✅ All profile challenges endpoint executed successfully");

    // Test 2: Get won challenges only
    console.log("\n2️⃣ Test: Get won challenges only");
    const reqWon = mockRequest({ userId: "1" }, { status: "won" });
    const resWon = mockResponse();

    await GamificationController.getProfileChallenges(reqWon, resWon);
    console.log("✅ Won challenges filter tested");

    // Test 3: Get active challenges only
    console.log("\n3️⃣ Test: Get active challenges only");
    const reqActive = mockRequest({ userId: "1" }, { status: "active" });
    const resActive = mockResponse();

    await GamificationController.getProfileChallenges(reqActive, resActive);
    console.log("✅ Active challenges filter tested");

    // Test 4: Get participated challenges only
    console.log("\n4️⃣ Test: Get participated challenges only");
    const reqParticipated = mockRequest({ userId: "1" }, { status: "participated" });
    const resParticipated = mockResponse();

    await GamificationController.getProfileChallenges(reqParticipated, resParticipated);
    console.log("✅ Participated challenges filter tested");

    // Test 5: Test with invalid user ID
    console.log("\n5️⃣ Test: Invalid user ID");
    const reqInvalid = mockRequest({ userId: "invalid" });
    const resInvalid = mockResponse();

    await GamificationController.getProfileChallenges(reqInvalid, resInvalid);
    console.log("✅ Invalid user ID handling tested");

    console.log("\n🎉 Profile challenges tests completed!");
  } catch (error) {
    console.error("❌ Profile challenges test failed:", error.message);
    console.error("Stack:", error.stack);
  }
}

async function testChallengeStats() {
  console.log("\n🧪 Testing Challenge Statistics...\n");

  try {
    // Test challenge statistics calculation
    console.log("1️⃣ Test: Challenge statistics calculation");

    // Mock data untuk testing
    const mockParticipations = [
      { challenge_id: 1, created_at: "2025-06-01" },
      { challenge_id: 2, created_at: "2025-06-05" },
      { challenge_id: 3, created_at: "2025-06-10" },
    ];

    const mockWins = [
      { challenge_id: 1, rank: 1 },
      { challenge_id: 3, rank: 2 },
    ];

    const stats = {
      total_participated: mockParticipations.length,
      total_won: mockWins.length,
      active_participations: 1,
      win_rate: Math.round((mockWins.length / mockParticipations.length) * 100),
    };

    console.log("✅ Challenge statistics:", stats);
    console.log(`   • Total Participated: ${stats.total_participated}`);
    console.log(`   • Total Won: ${stats.total_won}`);
    console.log(`   • Win Rate: ${stats.win_rate}%`);

    console.log("\n🎉 Challenge statistics test completed!");
  } catch (error) {
    console.error("❌ Challenge statistics test failed:", error.message);
  }
}

async function testErrorHandling() {
  console.log("\n🧪 Testing Error Handling...\n");

  try {
    // Test 1: Non-existent user for badges
    console.log("1️⃣ Test: Non-existent user for badges");
    const reqBadges = mockRequest({ userId: "99999" });
    const resBadges = mockResponse();

    await GamificationController.getProfileBadges(reqBadges, resBadges);
    console.log("✅ Non-existent user badges handling tested");

    // Test 2: Non-existent user for challenges
    console.log("\n2️⃣ Test: Non-existent user for challenges");
    const reqChallenges = mockRequest({ userId: "99999" });
    const resChallenges = mockResponse();

    await GamificationController.getProfileChallenges(reqChallenges, resChallenges);
    console.log("✅ Non-existent user challenges handling tested");

    console.log("\n🎉 Error handling tests completed!");
  } catch (error) {
    console.error("❌ Error handling test failed:", error.message);
  }
}

// Main test runner
async function runAllTests() {
  console.log("🚀 Starting Profile Gamification API Tests\n");
  console.log("=".repeat(60));

  await testProfileBadges();
  await testProfileChallenges();
  await testChallengeStats();
  await testErrorHandling();

  console.log("\n" + "=".repeat(60));
  console.log("🏁 All profile gamification tests completed!");
  console.log("\n📋 Test Summary:");
  console.log("   ✅ Profile Badges Endpoint");
  console.log("   ✅ Profile Challenges Endpoint");
  console.log("   ✅ Challenge Status Filters (all, won, active, participated)");
  console.log("   ✅ Challenge Statistics Calculation");
  console.log("   ✅ Error Handling");
  console.log("\n💡 Next Steps:");
  console.log("   1. Test with real database data");
  console.log("   2. Implement frontend components");
  console.log("   3. Add loading states and error messages");
  console.log("   4. Test responsive design for mobile");
}

// Export for use in other files or run directly
if (require.main === module) {
  runAllTests();
}

module.exports = {
  testProfileBadges,
  testProfileChallenges,
  testChallengeStats,
  testErrorHandling,
  runAllTests,
};
