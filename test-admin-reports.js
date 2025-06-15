const AdminController = require("./controllers/AdminController");

// Mock the request and response objects
const mockReq = {
  query: {
    search: "spam",
    page: "1",
    limit: "10",
  },
};

const mockRes = {
  json: (data) => {
    console.log("Response:", JSON.stringify(data, null, 2));
  },
  status: (code) => {
    console.log("Status Code:", code);
    return {
      json: (data) => {
        console.log("Error Response:", JSON.stringify(data, null, 2));
      },
    };
  },
};

async function testAdminController() {
  console.log("Testing AdminController.getAllReports...");
  try {
    await AdminController.getAllReports(mockReq, mockRes);
  } catch (error) {
    console.error("Test failed:", error);
  }
}

testAdminController();
