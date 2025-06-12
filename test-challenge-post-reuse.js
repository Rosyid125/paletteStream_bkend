// Test script untuk memverifikasi error handling post reuse di challenge
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testPostReuseErrorHandling() {
  try {
    console.log('🧪 Testing Post Reuse Error Handling in Challenges...\n');

    // Mock data - sesuaikan dengan data yang ada di database
    const challengeId1 = 2; // Challenge pertama
    const challengeId2 = 3; // Challenge kedua (jika ada)
    const postId = 73; // Post yang akan ditest
    const userId = 50; // User ID

    console.log('1️⃣ Test: Submit post ke challenge pertama');
    try {
      const response1 = await axios.post(
        `${API_BASE}/challenges/${challengeId1}/submit-post`,
        { postId },
        {
          headers: {
            'Content-Type': 'application/json',
            // Tambahkan cookie authentication jika diperlukan
          },
          withCredentials: true
        }
      );
      console.log('✅ First submission successful:', response1.data);
    } catch (error) {
      if (error.response?.status === 400 && error.response.data.message.includes('already submitted')) {
        console.log('⚠️ Post already submitted to this challenge (expected if running multiple times)');
      } else {
        console.log('❌ First submission failed:', error.response?.data || error.message);
      }
    }

    console.log('\n2️⃣ Test: Submit same post ke challenge kedua (should fail)');
    try {
      const response2 = await axios.post(
        `${API_BASE}/challenges/${challengeId2}/submit-post`,
        { postId },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true
        }
      );
      console.log('❌ Second submission should have failed but succeeded:', response2.data);
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Expected error received:', error.response.data.message);
        
        // Verify it's the correct error message
        if (error.response.data.message.includes('already been submitted to another challenge')) {
          console.log('✅ Correct error message: Post reuse prevention working!');
        } else {
          console.log('⚠️ Different error message:', error.response.data.message);
        }
      } else {
        console.log('❌ Unexpected error:', error.response?.data || error.message);
      }
    }

    console.log('\n🎉 Test completed!');
    
  } catch (error) {
    console.error('❌ Test setup failed:', error.message);
  }
}

// Run test
testPostReuseErrorHandling();
