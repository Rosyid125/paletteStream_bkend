// Simple test script to verify multer error handling
const express = require("express");
const { uploadSingle } = require("./utils/multerCloudinaryUtil");

const app = express();

// Test endpoint
app.post("/test-avatar", (req, res) => {
  uploadSingle("avatar")(req, res, (err) => {
    if (err) {
      console.log("Multer error caught:", err.message, "Code:", err.code);

      // Handle specific multer errors
      let errorMessage = "Avatar upload failed";
      let statusCode = 400;

      if (err.code === "LIMIT_FILE_SIZE") {
        errorMessage = "File size too large. Maximum size is 10MB";
      } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
        errorMessage = "Unexpected file field";
      } else if (err.message.includes("Only JPEG, PNG, JPG, and GIF")) {
        errorMessage = "Invalid file type. Only JPEG, PNG, JPG, and GIF files are allowed";
      }

      return res.status(statusCode).json({
        success: false,
        message: errorMessage,
      });
    }

    res.json({ success: true, message: "File uploaded successfully" });
  });
});

console.log("Test server ready. Multer error handling should now work properly.");
