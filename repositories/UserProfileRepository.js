// Import model
const UserProfile = require("../models/UserProfile");
// For error handling
const currentRepo = "UserProfileRepository";

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
      const username = `player${user_id}`;
      const avatar = "storage/avatars/noimage.png";
      const bio = "Hello, I'm new here!";
      const location = "Earth";
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

      // Buat hanya field yang tidak undefined
      const safeUpdate = {};
      if (updateData.name !== undefined) safeUpdate.username = updateData.name;
      if (updateData.avatar !== undefined) safeUpdate.avatar = updateData.avatar;
      if (updateData.bio !== undefined) safeUpdate.bio = updateData.bio;
      if (updateData.location !== undefined) safeUpdate.location = updateData.location;

      await UserProfile.query().findOne({ user_id }).patch(safeUpdate);

      return userProfile;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserProfileRepository;
