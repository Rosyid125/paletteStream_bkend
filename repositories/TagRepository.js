// Import model
const Tag = require("../models/Tag");

class TagRepository {
  // Get all tags
  static async findAll() {
    const tags = await Tag.query();
    return tags;
  }

  // Get tag by id
  static async findById(id) {
    const tag = await Tag.query().findOne({ id });
    return tag;
  }

  // Get tag by name
  static async findByName(name) {
    const tag = await Tag.query().findOne({ name });
    return tag;
  }

  // Create a new tag
  static async create(name) {
    const tag = await Tag.query().insert({ name });
    return tag;
  }

  // Update tag
  static async update(id, name) {
    const tag = await Tag.query().findOne({ id });
    if (!tag) {
      return null;
    }
    await Tag.query().findOne({ id }).patch({ name });
    return tag;
  }

  // Delete a tag
  static async delete(id) {
    const tag = await Tag.query().findOne({ id });
    if (!tag) {
      return null;
    }
    await Tag.query().findOne({ id }).delete();
    return tag;
  }

  // Find and create tag if not exist
  static async findOrCreate(name) {
    let tag = await Tag.query().findOne({ name });
    if (!tag) {
      tag = await Tag.query().insert({ name });
    }
    return tag;
  }
}

module.exports = TagRepository;
