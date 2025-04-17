// Import model
const Achievement = require("../models/Achievement");
// Import custom error handler
const customError = require("../errors/customError");
// For error handling
const currentRepo = "AchievementRepository";

class AchievementRepository {
  // Get all achievements
  static async findAll() {
    try {
      const achievements = await Achievement.query();
      return achievements;
    } catch (error) {
      throw error;
    }
  }

  // Get achievement by id
  static async findById(id) {
    try {
      const achievement = await Achievement.query().findOne({ id });
      return achievement;
    } catch (error) {
      throw error;
    }
  }

  // Get achievement by name
  static async findByName(name) {
    try {
      const achievement = await Achievement.query().findOne({ name });
      return achievement;
    } catch (error) {
      throw error;
    }
  }

  // Create a new achievement
  static async create(name, description, icon) {
    try {
      const achievement = await Achievement.query().insert({ name, description, icon });
      return achievement;
    } catch (error) {
      throw error;
    }
  }

  // Update achievement
  static async update(id, name, description, icon) {
    try {
      const achievement = await Achievement.query().findOne({ id });
      if (!achievement) {
        return null;
      }
      await Achievement.query().findOne({ id }).patch({ name, description, icon });
      return achievement;
    } catch (error) {
      throw error;
    }
  }

  // Delete an achievement
  static async delete(id) {
    try {
      const achievement = await Achievement.query().findOne({ id });
      if (!achievement) {
        return null;
      }
      await Achievement.query().findOne({ id }).delete();
      return achievement;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AchievementRepository;
