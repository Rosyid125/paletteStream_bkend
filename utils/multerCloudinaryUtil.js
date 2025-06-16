const multer = require("multer");
const { uploadConfig } = require("./cloudinaryUtil");

// Export upload configurations for different use cases
const upload = uploadConfig;

// Specific upload middleware for different endpoints
const uploadSingle = (fieldName) => upload.single(fieldName);
const uploadArray = (fieldName, maxCount = 10) => upload.array(fieldName, maxCount);
const uploadFields = (fields) => upload.fields(fields);

module.exports = {
  upload,
  uploadSingle,
  uploadArray,
  uploadFields,
};
