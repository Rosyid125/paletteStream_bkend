// import model
const Badge = require("../models/Badge");
// For error handling
const currentRepo = "BadgeRepository";

class BadgeRepository {
  // Get all badges
  static async findAll() {
    try {
      const badges = await Badge.query();
      return badges;
    } catch (error) {
      throw error;
    }
  }

  // Get badge by id
  static async findById(id) {
    try {
      const badge = await Badge.query().findOne({ id });
      return badge;
    } catch (error) {
      throw error;
    }
  }

  // Get badge by name
  static async findByName(name) {
    try {
      const badge = await Badge.query().findOne({ name });
      return badge;
    } catch (error) {
      throw error;
    }
  }

  // Create a new badge
  static async create(name, description, icon) {
    try {
      const badge = await Badge.query().insert({ name, description, icon });
      return badge;
    } catch (error) {
      throw error;
    }
  }

  // Update badge
  static async update(id, name, description, icon) {
    try {
      const badge = await Badge.query().findOne({ id });
      if (!badge) {
        return null;
      }
      await Badge.query().findOne({ id }).patch({ name, description, icon });
      return badge;
    } catch (error) {
      throw error;
    }
  }

  // Delete a badge
  static async delete(id) {
    try {
      const badge = await Badge.query().findOne({ id });
      if (!badge) {
        return null;
      }
      await Badge.query().findOne({ id }).delete();
      return badge;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = BadgeRepository;
