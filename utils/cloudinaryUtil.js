const { v2: cloudinary } = require('cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Memory storage for multer (we'll handle Cloudinary upload manually)
const storage = multer.memoryStorage();

// File filter for images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, JPG, and GIF files are allowed'), false);
  }
};

// Upload configurations
const uploadConfig = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

// Upload functions for different types
const uploadToCloudinary = async (buffer, folder, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: `palettestream/${folder}`,
      resource_type: 'image',
      ...options,
    };

    cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    ).end(buffer);
  });
};

// Specific upload functions
const uploadPostImage = async (buffer) => {
  return uploadToCloudinary(buffer, 'uploads', {
    transformation: [
      { width: 1200, height: 1200, crop: 'limit', quality: 'auto' }
    ]
  });
};

const uploadAvatar = async (buffer) => {
  return uploadToCloudinary(buffer, 'avatars', {
    transformation: [
      { width: 400, height: 400, crop: 'fill', gravity: 'face', quality: 'auto' }
    ]
  });
};

const uploadBadge = async (buffer) => {
  return uploadToCloudinary(buffer, 'badges', {
    transformation: [
      { width: 200, height: 200, crop: 'fill', quality: 'auto' }
    ]
  });
};

// Helper function to delete image from Cloudinary
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
};

// Helper function to extract public ID from Cloudinary URL
const extractPublicId = (url) => {
  if (!url) return null;
  
  // Handle Cloudinary URLs
  if (url.includes('cloudinary.com')) {
    // Extract public_id from Cloudinary URL
    // Format: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/public_id.jpg
    const matches = url.match(/\/v\d+\/(.+)\.(jpg|jpeg|png|gif|webp)$/);
    if (matches) {
      return matches[1]; // Returns folder/public_id
    }
  }
  
  return null;
};

// Helper function to get optimized URL
const getOptimizedUrl = (url, options = {}) => {
  if (!url || !url.includes('cloudinary.com')) return url;
  
  const { width, height, quality = 'auto' } = options;
  const publicId = extractPublicId(url);
  
  if (!publicId) return url;
  
  let transformation = `q_${quality}`;
  
  if (width && height) {
    transformation += `,w_${width},h_${height},c_fill`;
  } else if (width) {
    transformation += `,w_${width},c_scale`;
  }
  
  return cloudinary.url(publicId, { transformation });
};

// Helper function to check if URL is from Cloudinary
const isCloudinaryUrl = (url) => {
  return url && url.includes('cloudinary.com');
};

module.exports = {
  cloudinary,
  uploadConfig,
  uploadToCloudinary,
  uploadPostImage,
  uploadAvatar,
  uploadBadge,
  deleteImage,
  extractPublicId,
  getOptimizedUrl,
  isCloudinaryUrl,
};
