// Import model
const Achievement = require("../models/Achievement");

class AchievementRepository {
  // Get all achievements
  static async findAll() {
    const achievements = await Achievement.query();
    return achievements;
  }

  // Get achievement by id
  static async findById(id) {
    const achievement = await Achievement.query().findOne({ id });
    return achievement;
  }

  // Get achievement by name
  static async findByName(name) {
    const achievement = await Achievement.query().findOne({ name });
    return achievement;
  }

  // Create a new achievement
  static async create(name, description, icon) {
    const achievement = await Achievement.query().insert({ name, description, icon });
    return achievement;
  }

  // Update achievement
  static async update(id, name, description, icon) {
    const achievement = await Achievement.query().findOne({ id });
    if (!achievement) {
      return null;
    }
    await Achievement.query().findOne({ id }).patch({ name, description, icon });
    return achievement;
  }

  // Delete an achievement
  static async delete(id) {
    const achievement = await Achievement.query().findOne({ id });
    if (!achievement) {
      return null;
    }
    await Achievement.query().findOne({ id }).delete();
    return achievement;
  }
}

module.exports = AchievementRepository;
