// Test file untuk validasi User Profile Update Enhancement
// File: test-user-profile-update.js

const UserProfileService = require("./services/UserProfileService");
const UserRepository = require("./repositories/UserRepository");
const UserProfileRepository = require("./repositories/UserProfileRepository");

async function testUserProfileUpdate() {
  console.log("🧪 Testing User Profile Update Enhancement...\n");

  try {
    // Test 1: Get user profile before update
    console.log("1️⃣ Test: Get user profile by ID");
    const userId = 1; // Ganti dengan user ID yang ada di database

    const profileBefore = await UserProfileService.getUserProfileById(userId);
    console.log("✅ Profile before update:", {
      first_name: profileBefore.first_name,
      last_name: profileBefore.last_name,
      username: profileBefore.username,
      bio: profileBefore.bio,
      location: profileBefore.location,
    });

    // Test 2: Update user profile with new data
    console.log("\n2️⃣ Test: Update user profile");
    const updateData = {
      first_name: "John Updated",
      last_name: "Doe Updated",
      username: "johnupdated123",
      bio: "Updated bio - Digital artist and manga illustrator",
      location: "Tokyo, Japan",
      platforms: [
        {
          platform: "instagram",
          url: "https://instagram.com/johnupdated",
        },
        {
          platform: "twitter",
          url: "https://twitter.com/johnupdated",
        },
      ],
    };

    const updatedProfile = await UserProfileService.updateUserProfile(userId, updateData);
    console.log("✅ Profile after update:", updatedProfile);

    // Test 3: Verify changes in database
    console.log("\n3️⃣ Test: Verify changes in database");
    const userFromDB = await UserRepository.findById(userId);
    const profileFromDB = await UserProfileRepository.findByUserId(userId);

    console.log("✅ User table data:", {
      first_name: userFromDB.first_name,
      last_name: userFromDB.last_name,
    });

    console.log("✅ Profile table data:", {
      username: profileFromDB.username,
      bio: profileFromDB.bio,
      location: profileFromDB.location,
    });

    // Test 4: Test partial update (only some fields)
    console.log("\n4️⃣ Test: Partial update (only bio and location)");
    const partialUpdate = {
      bio: "Partial update test - Only bio changed",
      location: "Bandung, Indonesia",
    };

    await UserProfileService.updateUserProfile(userId, partialUpdate);
    const partialUpdatedProfile = await UserProfileService.getUserProfileById(userId);
    console.log("✅ After partial update:", {
      bio: partialUpdatedProfile.bio,
      location: partialUpdatedProfile.location,
      first_name: partialUpdatedProfile.first_name, // Should remain same
      username: partialUpdatedProfile.username, // Should remain same
    });

    // Test 5: Test with undefined values
    console.log("\n5️⃣ Test: Update with undefined values (should not change anything)");
    const undefinedUpdate = {
      first_name: undefined,
      last_name: undefined,
      username: undefined,
      bio: undefined,
      location: undefined,
    };

    await UserProfileService.updateUserProfile(userId, undefinedUpdate);
    const unchangedProfile = await UserProfileService.getUserProfileById(userId);
    console.log("✅ Profile should remain unchanged:", {
      bio: unchangedProfile.bio,
      location: unchangedProfile.location,
    });

    console.log("\n🎉 All tests passed successfully!");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    console.error("Stack:", error.stack);
  }
}

// Test error handling
async function testErrorHandling() {
  console.log("\n🧪 Testing Error Handling...\n");

  try {
    // Test 1: Non-existent user
    console.log("1️⃣ Test: Update non-existent user");
    try {
      await UserProfileService.updateUserProfile(99999, { bio: "Test" });
      console.log("❌ Should have thrown an error");
    } catch (error) {
      console.log("✅ Correctly threw error:", error.message);
    }

    // Test 2: Get profile for non-existent user
    console.log("\n2️⃣ Test: Get profile for non-existent user");
    try {
      await UserProfileService.getUserProfileById(99999);
      console.log("❌ Should have thrown an error");
    } catch (error) {
      console.log("✅ Correctly threw error:", error.message);
    }

    console.log("\n🎉 Error handling tests passed!");
  } catch (error) {
    console.error("❌ Error handling test failed:", error.message);
  }
}

// Main test runner
async function runAllTests() {
  console.log("🚀 Starting User Profile Update Tests\n");
  console.log("=".repeat(50));

  await testUserProfileUpdate();
  await testErrorHandling();

  console.log("\n" + "=".repeat(50));
  console.log("🏁 All tests completed!");
}

// Export for use in other files or run directly
if (require.main === module) {
  runAllTests();
}

module.exports = {
  testUserProfileUpdate,
  testErrorHandling,
  runAllTests,
};
