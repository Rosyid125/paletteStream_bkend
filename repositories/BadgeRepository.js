// import model
const Badge = require("../models/Badge");
const db = require("../config/db");

class BadgeRepository {
  // Get all badges
  static async findAll() {
    const badges = await Badge.query();
    return badges;
  }

  // Get badge by id
  static async findById(id) {
    const badge = await Badge.query().findOne({ id });
    return badge;
  }

  // Get badge by name
  static async findByName(name) {
    const badge = await Badge.query().findOne({ name });
    return badge;
  }

  // Create a new badge
  static async create(name, description, icon) {
    const badge = await Badge.query().insert({ name, description, icon });
    return badge;
  }

  // Update badge
  static async update(id, name, description, icon) {
    const badge = await Badge.query().findOne({ id });
    if (!badge) {
      return null;
    }
    await Badge.query().findOne({ id }).patch({ name, description, icon });
    return badge;
  }

  // Delete a badge
  static async delete(id) {
    const badge = await Badge.query().findOne({ id });
    if (!badge) {
      return null;
    }
    await Badge.query().findOne({ id }).delete();
    return badge;
  }
}

module.exports = BadgeRepository;
