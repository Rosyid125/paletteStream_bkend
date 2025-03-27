// import model
const Badge = require("../models/Badge");
const currentRepo = "BadgeRepository";

class BadgeRepository {
  // Get all badges
  static async findAll() {
    try {
      const badges = await Badge.query();
      return badges;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Get badge by id
  static async findById(id) {
    try {
      const badge = await Badge.query().findOne({ id });
      return badge;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Get badge by name
  static async findByName(name) {
    try {
      const badge = await Badge.query().findOne({ name });
      return badge;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Create a new badge
  static async create(name, description, icon) {
    try {
      const badge = await Badge.query().insert({ name, description, icon });
      return badge;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
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
      throw new Error(`${currentRepo} Error: ${error.message}`);
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
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }
}

module.exports = BadgeRepository;
