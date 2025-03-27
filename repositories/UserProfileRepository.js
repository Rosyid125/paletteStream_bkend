// Import model
const UserProfile = require("../models/UserProfile");
const currentRepo = "UserProfileRepository";

class UserProfileRepository {
  // Get all user profiles
  static async findAll() {
    try {
      const userProfiles = await UserProfile.query();
      return userProfiles;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Get user profile by user id
  static async findByUserId(user_id) {
    try {
      const userProfile = await UserProfile.query().findOne({ user_id });
      return userProfile;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
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
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Create a new user profile
  static async create(user_id, username, avatar, bio, location) {
    try {
      const userProfile = await UserProfile.query().insert({ user_id, username, avatar, bio, location });
      return userProfile;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Update user profile
  static async update(user_id, username, avatar, bio, location) {
    try {
      const userProfile = await UserProfile.query().findOne({ user_id });
      if (!userProfile) {
        return null;
      }
      await UserProfile.query().findOne({ user_id }).patch({ username, avatar, bio, location });
      return userProfile;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }
}

module.exports = UserProfileRepository;
