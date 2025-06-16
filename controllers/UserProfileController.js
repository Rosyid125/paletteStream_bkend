const { parse } = require("dotenv");
const UserProfileService = require("../services/UserProfileService");
const customError = require("../errors/customError");
// logger
const logger = require("../utils/winstonLogger");
const jwt = require("jsonwebtoken");
const { uploadSingle } = require("../utils/multerCloudinaryUtil");
const { uploadAvatar, deleteImage, extractPublicId, isCloudinaryUrl } = require("../utils/cloudinaryUtil");
const path = require("path");

class UserProfileController {
  // get user mini infos by user id
  static async getUserMiniInfos(req, res) {
    try {
      const { userId } = req.params;

      // Convert userId to an integer
      const parsedUserId = parseInt(userId);

      const userProfile = await UserProfileService.findMiniInfosByUserId(parsedUserId);

      if (!userProfile) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      res.json({ success: true, data: userProfile });
    } catch (error) {
      // Tangkap error dan log ke file
      logger.error(`Error: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      res.status(500).json({ success: false, messege: "An unexpected error occurred." });
    }
  }

  // get user profile and other neccesaries data by user id
  static async getUserProfile(req, res) {
    try {
      const { userId } = req.params;

      // Get current user id from token
      const currentUserId = req.user.id;

      const userProfile = await UserProfileService.getUserProfile(currentUserId, userId);

      if (!userProfile) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      res.json({ success: true, data: userProfile });
    } catch (error) {
      // Tangkap error dan log ke file
      logger.error(`Error: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      res.status(500).json({ success: false, messege: "An unexpected error occurred." });
    }
  }

  // get user profile by user id
  static async getUserProfile2(req, res) {
    try {
      // Get userId form token
      const token = req.cookies.accessToken; // Access the token from the cookies
      if (!token) {
        throw new customError("Unauthorized", 401);
      }

      // Verifikasi token akses
      const user = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      const userId = user.id; // Ambil userId dari token
      // Convert userId to an integer
      const parsedUserId = parseInt(userId);
      const userProfile = await UserProfileService.getUserProfileById(parsedUserId);
      if (!userProfile) {
        throw new customError("User profile not found", 404);
      }
      res.json({ success: true, data: userProfile });
    } catch (error) {
      // Tangkap error dan log ke file
      logger.error(`Error: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      if (error instanceof customError) {
        return res.status(error.statusCode).json({ success: false, message: error.message });
      } else {
        res.status(500).json({ success: false, messege: "An unexpected error occurred." });
      }
    }
  }
  // update user profile
  static async updateUserProfile(req, res) {
    try {
      // 1. Gunakan multer untuk menangani upload SATU file 'avatar'
      // Nama 'avatar' harus sesuai dengan nama field di form-data frontend
      uploadSingle("avatar")(req, res, async (err) => {
        // Handle error dari multer
        if (err) {
          // Contoh error: file terlalu besar, tipe file salah, dll.
          logger.warn(`Avatar upload failed for user attempt: ${err.message}`, { code: err.code });
          throw new customError("Avatar upload failed", 400); // Ganti dengan error yang sesuai
        }

        // Lanjutkan di dalam callback multer
        try {
          // Get userId form token
          const token = req.cookies.accessToken; // Access the token from the cookies
          if (!token) {
            throw new customError("Unauthorized", 401);
          }

          // Verifikasi token akses
          const user = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
          const userId = user.id; // Ambil userId dari token

          // Validasi userId dasar
          if (isNaN(userId)) {
            return res.status(400).json({ success: false, error: "Invalid user ID format." });
          } // Ambil data dari request body
          const { first_name, last_name, username, bio, location, platforms } = req.body;

          // 2. Upload avatar to Cloudinary if file exists
          let avatarUrl = undefined; // Default tidak ada perubahan avatar
          if (req.file) {
            try {
              const result = await uploadAvatar(req.file.buffer);
              avatarUrl = result.secure_url;
            } catch (uploadError) {
              logger.error(`Error uploading avatar to Cloudinary: ${uploadError.message}`);
              throw new customError("Avatar upload failed", 500);
            }
          }
          // Jika req.file tidak ada, avatarUrl akan tetap undefined,
          // service akan tahu untuk tidak mengubah avatar.          // 3. Persiapkan data untuk service
          // Kirim sebagai objek agar lebih mudah dikelola di service
          const updateData = {
            first_name, // untuk update tabel users
            last_name, // untuk update tabel users
            username, // untuk update tabel user_profiles
            bio, // untuk update tabel user_profiles
            location, // untuk update tabel user_profiles
            avatarUrl, // untuk update tabel user_profiles (Cloudinary URL)
            platforms, // untuk update social links
          };

          // 4. Panggil service dengan data yang sudah diproses
          const updatedProfile = await UserProfileService.updateUserProfile(userId, updateData);

          // Jika service mengembalikan null/undefined karena user tidak ditemukan
          if (!updatedProfile) {
            return res.status(404).json({ success: false, error: "User profile not found." });
          }

          // 5. Kirim response ke client
          res.json({ success: true, message: "Profile updated successfully", data: updatedProfile });
        } catch (error) {
          throw error;
        }
      });
    } catch (error) {
      // Error yang sangat jarang terjadi di luar multer/logic utama
      logger.error(`Unexpected Error before/during multer processing: ${error.message}`, {
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      if (error instanceof customError) {
        return res.status(error.statusCode).json({ success: false, message: error.message });
      } else {
        res.status(500).json({ success: false, message: "An unexpected error occurred." });
      }
    }
  }
}

module.exports = UserProfileController;
