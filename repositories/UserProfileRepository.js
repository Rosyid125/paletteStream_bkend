// Import model
const UserProfile = require("../models/UserProfile");
const db = require("../config/db");

class UserProfileRepository {
  // Get all user profiles
  static async findAll() {
    const userProfiles = await UserProfile.query();
    return userProfiles;
  }

  // Get user profile by user id
  static async findByUserId(user_id) {
    const userProfile = await UserProfile.query().findOne({ user_id });
    return userProfile;
  }

  // Create a new user profile
  static async create(user_id, username, avatar, bio, location) {
    const userProfile = await UserProfile.query().insert({ user_id, username, avatar, bio, location });
    return userProfile;
  }

  // Update user profile
  static async update(userId, username, avatar, bio, location) {
    const userProfile = await UserProfile.query().findOne({ userId });
    if (!userProfile) {
      return null;
    }
    await UserProfile.query().findOne({ userId }).patch({ username, avatar, bio, location });
    return userProfile;
  }

  // More based on app requirements
}

module.exports = UserProfileRepository;
