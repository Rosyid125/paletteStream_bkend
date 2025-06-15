const axios = require("axios");

// Test configuration
const BASE_URL = "http://localhost:3000/api/user-follows";
const TEST_USER_ID = 1; // Ganti dengan user ID yang valid
const TEST_TOKEN = "your_test_token_here"; // Ganti dengan token yang valid

async function testFollowersPagination() {
  console.log("🧪 Testing Followers Pagination API...\n");

  try {
    // Test dengan parameter default
    console.log("📋 Test 1: Default pagination (page=1, limit=10)");
    const response1 = await axios.get(`${BASE_URL}/${TEST_USER_ID}/followers`, {
      headers: {
        Authorization: `Bearer ${TEST_TOKEN}`,
      },
    });

    console.log("✅ Status:", response1.status);
    console.log("📊 Response structure:", {
      success: response1.data.success,
      message: response1.data.message,
      dataCount: response1.data.data?.length,
      pagination: response1.data.pagination,
    });
    console.log("");

    // Test dengan parameter custom
    console.log("📋 Test 2: Custom pagination (page=1, limit=5)");
    const response2 = await axios.get(`${BASE_URL}/${TEST_USER_ID}/followers?page=1&limit=5`, {
      headers: {
        Authorization: `Bearer ${TEST_TOKEN}`,
      },
    });

    console.log("✅ Status:", response2.status);
    console.log("📊 Response structure:", {
      success: response2.data.success,
      message: response2.data.message,
      dataCount: response2.data.data?.length,
      pagination: response2.data.pagination,
    });
    console.log("");

    // Test halaman kedua (jika ada)
    if (response2.data.pagination?.has_next) {
      console.log("📋 Test 3: Second page (page=2, limit=5)");
      const response3 = await axios.get(`${BASE_URL}/${TEST_USER_ID}/followers?page=2&limit=5`, {
        headers: {
          Authorization: `Bearer ${TEST_TOKEN}`,
        },
      });

      console.log("✅ Status:", response3.status);
      console.log("📊 Response structure:", {
        success: response3.data.success,
        message: response3.data.message,
        dataCount: response3.data.data?.length,
        pagination: response3.data.pagination,
      });
      console.log("");
    }
  } catch (error) {
    console.error("❌ Error testing followers pagination:", error.response?.data || error.message);
  }
}

async function testFollowingPagination() {
  console.log("🧪 Testing Following Pagination API...\n");

  try {
    // Test dengan parameter default
    console.log("📋 Test 1: Default pagination (page=1, limit=10)");
    const response1 = await axios.get(`${BASE_URL}/${TEST_USER_ID}/following`, {
      headers: {
        Authorization: `Bearer ${TEST_TOKEN}`,
      },
    });

    console.log("✅ Status:", response1.status);
    console.log("📊 Response structure:", {
      success: response1.data.success,
      message: response1.data.message,
      dataCount: response1.data.data?.length,
      pagination: response1.data.pagination,
    });
    console.log("");

    // Test dengan parameter custom
    console.log("📋 Test 2: Custom pagination (page=1, limit=5)");
    const response2 = await axios.get(`${BASE_URL}/${TEST_USER_ID}/following?page=1&limit=5`, {
      headers: {
        Authorization: `Bearer ${TEST_TOKEN}`,
      },
    });

    console.log("✅ Status:", response2.status);
    console.log("📊 Response structure:", {
      success: response2.data.success,
      message: response2.data.message,
      dataCount: response2.data.data?.length,
      pagination: response2.data.pagination,
    });
    console.log("");

    // Test data structure dari item pertama
    if (response2.data.data && response2.data.data.length > 0) {
      console.log("📋 Test 3: Data structure validation");
      const firstItem = response2.data.data[0];
      console.log("📄 First item structure:", {
        hasFollowedId: "followed_id" in firstItem,
        hasFollowedAt: "followed_at" in firstItem,
        hasUserId: "user_id" in firstItem,
        hasFirstName: "first_name" in firstItem,
        hasLastName: "last_name" in firstItem,
        hasUsername: "username" in firstItem,
        hasAvatar: "avatar" in firstItem,
        hasBio: "bio" in firstItem,
      });
      console.log("");
    }
  } catch (error) {
    console.error("❌ Error testing following pagination:", error.response?.data || error.message);
  }
}

async function testEdgeCases() {
  console.log("🧪 Testing Edge Cases...\n");

  try {
    // Test dengan limit besar (harus dibatasi ke 50)
    console.log("📋 Test 1: Large limit (should be capped at 50)");
    const response1 = await axios.get(`${BASE_URL}/${TEST_USER_ID}/followers?limit=100`, {
      headers: {
        Authorization: `Bearer ${TEST_TOKEN}`,
      },
    });

    console.log("✅ Status:", response1.status);
    console.log("📊 Per page (should be max 50):", response1.data.pagination?.per_page);
    console.log("");

    // Test dengan page 0 (harus menjadi 1)
    console.log("📋 Test 2: Page 0 (should default to 1)");
    const response2 = await axios.get(`${BASE_URL}/${TEST_USER_ID}/followers?page=0`, {
      headers: {
        Authorization: `Bearer ${TEST_TOKEN}`,
      },
    });

    console.log("✅ Status:", response2.status);
    console.log("📊 Current page (should be 1):", response2.data.pagination?.current_page);
    console.log("");

    // Test dengan limit 0 (harus menjadi 1)
    console.log("📋 Test 3: Limit 0 (should default to 1)");
    const response3 = await axios.get(`${BASE_URL}/${TEST_USER_ID}/followers?limit=0`, {
      headers: {
        Authorization: `Bearer ${TEST_TOKEN}`,
      },
    });

    console.log("✅ Status:", response3.status);
    console.log("📊 Per page (should be at least 1):", response3.data.pagination?.per_page);
    console.log("");
  } catch (error) {
    console.error("❌ Error testing edge cases:", error.response?.data || error.message);
  }
}

async function runAllTests() {
  console.log("🚀 Starting User Follow Pagination API Tests\n");
  console.log("⚠️  Make sure to update TEST_USER_ID and TEST_TOKEN before running!\n");

  await testFollowersPagination();
  await testFollowingPagination();
  await testEdgeCases();

  console.log("✅ All tests completed!");
}

// Jalankan test jika file ini dieksekusi langsung
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  testFollowersPagination,
  testFollowingPagination,
  testEdgeCases,
  runAllTests,
};
