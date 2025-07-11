// Import model
const UserProfile = require("../models/UserProfile");
// For error handling
const currentRepo = "UserProfileRepository";

// Get default user data from env
const DEFAULT_USER_USERNAME = process.env.DEFAULT_USER_USERNAME || "player";
const DEFAULT_USER_AVATAR = process.env.DEFAULT_USER_AVATAR || "storage/avatars/noimage.png";
const DEFAULT_USER_BIO = process.env.DEFAULT_USER_BIO || "Hello, I'm new here!";
const DEFAULT_USER_LOCATION = process.env.DEFAULT_USER_LOCATION || "Earth";

class UserProfileRepository {
  // Get all user profiles
  static async findAll() {
    try {
      const userProfiles = await UserProfile.query();
      return userProfiles;
    } catch (error) {
      throw error;
    }
  }

  // Get user mini infos by user id
  static async findMiniInfosByUserId(user_id) {
    try {
      const userProfile = await UserProfile.query().findOne({ user_id }).withGraphFetched("profile[user]");

      return userProfile;
    } catch (error) {
      throw error;
    }
  }

  // Get user profile by user id
  static async findByUserId(user_id) {
    try {
      const userProfile = await UserProfile.query().findOne({ user_id });

      return userProfile;
    } catch (error) {
      throw error;
    }
  }

  // Create a default user profile
  static async createDefault(user_id) {
    try {
      // Default data
      const username = DEFAULT_USER_USERNAME;
      const avatar = DEFAULT_USER_AVATAR;
      const bio = DEFAULT_USER_BIO;
      const location = DEFAULT_USER_LOCATION;
      const userProfile = await UserProfile.query().insert({ user_id, username, avatar, bio, location });
      return userProfile;
    } catch (error) {
      throw error;
    }
  }

  // Create a new user profile
  static async create(user_id, username, avatar, bio, location) {
    try {
      const userProfile = await UserProfile.query().insert({ user_id, username, avatar, bio, location });
      return userProfile;
    } catch (error) {
      throw error;
    }
  }
  static async update(user_id, updateData) {
    try {
      const userProfile = await UserProfile.query().findOne({ user_id });
      if (!userProfile) {
        return null;
      }

      // Buat objek update yang bersih, hanya field yang tidak undefined
      const safeUpdate = {};
      if (updateData.username !== undefined) safeUpdate.username = updateData.username;
      if (updateData.avatar !== undefined) safeUpdate.avatar = updateData.avatar;
      if (updateData.bio !== undefined) safeUpdate.bio = updateData.bio;
      if (updateData.location !== undefined) safeUpdate.location = updateData.location;

      // Hanya lakukan update jika ada field yang berubah
      if (Object.keys(safeUpdate).length > 0) {
        await UserProfile.query().findOne({ user_id }).patch(safeUpdate);
      }

      // Return updated profile
      return await UserProfile.query().findOne({ user_id });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserProfileRepository;
