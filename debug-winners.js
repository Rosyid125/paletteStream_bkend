// Debug script untuk test challenge winners endpoints
const knex = require("./config/db");
const ChallengeWinnerService = require("./services/ChallengeWinnerService");
const ChallengeWinnerRepository = require("./repositories/ChallengeWinnerRepository");

async function debugChallengeWinners() {
  try {
    console.log("🔍 Starting Challenge Winners Debug...\n");

    // Test 1: Check database connection
    console.log("1. Testing database connection...");
    const result = await knex.raw("SELECT 1 as test");
    console.log("✅ Database connected:", result[0]);

    // Test 2: Check if challenge_winners table exists and structure
    console.log("\n2. Checking challenge_winners table...");
    const tableInfo = await knex.raw("DESCRIBE challenge_winners");
    console.log("✅ Table structure:", tableInfo[0]);

    // Test 3: Find a closed challenge with posts
    console.log("\n3. Finding test challenge...");
    const challenges = await knex("challenges").select("id", "title", "is_closed").where("is_closed", true).limit(1);

    if (challenges.length === 0) {
      console.log("❌ No closed challenges found");
      return;
    }

    const challenge = challenges[0];
    console.log("✅ Found challenge:", challenge);

    // Test 4: Find challenge posts
    console.log("\n4. Finding challenge posts...");
    const challengePosts = await knex("challenge_posts").select("*").where("challenge_id", challenge.id);

    console.log("✅ Found challenge posts:", challengePosts.length);
    if (challengePosts.length > 0) {
      console.log("Challenge posts:", challengePosts);
    }

    // Test 5: Check existing winners
    console.log("\n5. Checking existing winners...");
    const existingWinners = await knex("challenge_winners").select("*").where("challenge_id", challenge.id);

    console.log("✅ Existing winners:", existingWinners);

    // Test 6: Try to create a winner directly via repository
    if (challengePosts.length > 0) {
      console.log("\n6. Testing direct winner creation...");

      // Clear existing winners first
      await knex("challenge_winners").where("challenge_id", challenge.id).del();

      const testWinner = await ChallengeWinnerRepository.create(challenge.id, challengePosts[0].user_id, challengePosts[0].post_id, 1, 10, "Test winner creation");

      console.log("✅ Winner created via repository:", testWinner);

      // Verify it was inserted
      const verifyWinner = await knex("challenge_winners").select("*").where("id", testWinner.id).first();

      console.log("✅ Winner verified in database:", verifyWinner);

      // Clean up test data
      await knex("challenge_winners").where("id", testWinner.id).del();
      console.log("✅ Test data cleaned up");
    }

    // Test 7: Try selectWinners service
    if (challengePosts.length > 0) {
      console.log("\n7. Testing selectWinners service...");

      const winnersData = [
        {
          userId: challengePosts[0].user_id,
          postId: challengePosts[0].post_id,
          rank: 1,
        },
      ];

      try {
        const result = await ChallengeWinnerService.selectWinners(challenge.id, winnersData, "Test via service");

        console.log("✅ Service result:", result);

        // Verify in database
        const dbWinners = await knex("challenge_winners").select("*").where("challenge_id", challenge.id);

        console.log("✅ Winners in database after service call:", dbWinners);

        // Clean up
        await knex("challenge_winners").where("challenge_id", challenge.id).del();
      } catch (error) {
        console.error("❌ Service error:", error.message);
        console.error("Error details:", error);
      }
    }

    console.log("\n🎉 Debug completed!");
  } catch (error) {
    console.error("❌ Debug failed:", error);
  } finally {
    await knex.destroy();
  }
}

// Run the debug
debugChallengeWinners();
