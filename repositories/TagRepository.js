// Import model
const Tag = require("../models/Tag");
// For error handling
const currentRepo = "TagRepository";

class TagRepository {
  // Get all tags
  static async findAll() {
    try {
      const tags = await Tag.query();
      return tags;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Get tag by id
  static async findById(id) {
    try {
      const tag = await Tag.query().findOne({ id });
      return tag;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Get tag by name
  static async findByName(name) {
    try {
      const tag = await Tag.query().findOne({ name });
      return tag;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Get tags by ids
  static async findTagsByIds(tagIds) {
    try {
      return await Tag.query().whereIn("id", tagIds);
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Create a new tag
  static async create(name) {
    try {
      const tag = await Tag.query().insert({ name });
      return tag;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Update tag
  static async update(id, name) {
    try {
      const tag = await Tag.query().findOne({ id });
      if (!tag) {
        return null;
      }
      await Tag.query().findOne({ id }).patch({ name });
      return tag;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Delete a tag
  static async delete(id) {
    try {
      const tag = await Tag.query().findOne({ id });
      if (!tag) {
        return null;
      }
      await Tag.query().findOne({ id }).delete();
      return tag;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }

  // Find and create tag if not exist
  static async findOrCreate(name) {
    try {
      let tag = await Tag.query().findOne({ name });
      if (!tag) {
        tag = await Tag.query().insert({ name });
      }
      return tag;
    } catch (error) {
      throw new Error(`${currentRepo} Error: ${error.message}`);
    }
  }
}

module.exports = TagRepository;
