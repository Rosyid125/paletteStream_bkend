const PostReportService = require("./services/PostReportService");

async function testReportSearch() {
  try {
    console.log("Testing report search functionality...");

    // Test 1: Get all reports without search
    console.log("\n1. Getting all reports without search:");
    const allReports = await PostReportService.getAllReports();
    console.log(`Found ${allReports.reports.length} reports, Total: ${allReports.total}`);

    // Test 2: Search with pagination
    console.log("\n2. Testing search with pagination:");
    const searchResult = await PostReportService.getAllReports({
      search: "spam",
      page: 1,
      limit: 5,
    });
    console.log(`Search for "spam": Found ${searchResult.reports.length} reports, Total: ${searchResult.total}`);

    // Test 3: Test pagination
    console.log("\n3. Testing pagination:");
    const paginatedResult = await PostReportService.getAllReports({
      page: 1,
      limit: 3,
    });
    console.log(`Page 1, Limit 3: Found ${paginatedResult.reports.length} reports`);
    console.log(`Pagination info: Page ${paginatedResult.page}/${paginatedResult.totalPages}, Total: ${paginatedResult.total}`);

    console.log("\nTest completed successfully!");
  } catch (error) {
    console.error("Test failed:", error.message);
  }
}

testReportSearch();
